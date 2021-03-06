/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/* Server Only Methods */

Meteor.methods({
    testEmail: function () {
        try {
            //send test email
            this.unblock();
            Smartix.testMail("", "");
        }
        catch (e) {
            log.error(e);
        }
    },

    feedback: function (content) {
        // feedback@gosmartix.com
        try {
            //send feedback
            this.unblock();
            Smartix.feedback(content);
        }
        catch (e) {
            log.error(e);
        }
    },

    chatroomEmail: function(recipientUsers,orginateUser,content){
        //log.info(recipientUsers);
        //log.info(orginateUser);
        //log.info(content);

        //1. we filter and retain user who is opted to receive email
        //2. we filter and retain user whose email is verified
        //3. group recipient users by their lang, if they dont have lang, default it as en.
        //4. Then we send email in batch per each lang

        var optInUsersGroupByLang = lodash.chain(recipientUsers)
            .filter(function(user){
                if(user.emailNotifications){
                    if(user.emails[0].verified || user.services.google.verified_email){
                        return true;
                    }
                }else{
                    return false;
                }
            })
            .groupBy('lang')
            .value();

        log.info(optInUsersGroupByLang);

        for(var lang in optInUsersGroupByLang) {
            var chatRoomRecepientArr = [];
            optInUsersGroupByLang[lang].map(function(eachUser){
                var chatRoomRecepient = {
                    email: eachUser.emails[0].address,
                    name:  eachUser.profile.firstName+ " " + eachUser.profile.lastName
                };
                chatRoomRecepientArr.push(chatRoomRecepient);
            });

            log.info(chatRoomRecepientArr);
            log.info(lang);
            try {
                //send email
                this.unblock();
                Smartix.messageEmailTemplate(
                    chatRoomRecepientArr, orginateUser, content, {
                        type:'chat',
                        lang:lang
                    });
            }
            catch (e) {
                log.error(e);
            }
        }
    },


    getUserCreateClassesCount: function(){
        return Smartix.Groups.Collection.find({
            type: 'class',
            admins: Meteor.userId()
        }).count();
    },


    pushTest: function (userId) {
        Push.send({
            from: 'push',
            title: 'Hello',
            text: 'world',
            query: {
                userId: userId
            }
        });
    },

    doPushNotification: function (notificationObj,inAppNotifyObj) {
        //refer to the above `pushTest` for the input format of notificationObj
        var notificationObjType;
        var filteredUserIdsWhoEnablePushNotify = [];

        //if is an object. i.e userId: {$in: flattenArray}
        if(lodash.isPlainObject(notificationObj.query.userId) ){
            //notificationObjType = "multiple";
            //only keep users who want to receive push notification
            filteredUserIdsWhoEnablePushNotify = notificationObj.query.userId.$in.filter(function (eachUserId) {
                var userObj = Meteor.users.findOne(eachUserId);
                return userObj.pushNotifications;
            });
            notificationObj.query.userId.$in = filteredUserIdsWhoEnablePushNotify;
            Push.send(notificationObj);
        }
        else{ //is just one userid
            notificationObjType="single";
            var userId = notificationObj.query.userId;
            var userObj = Meteor.users.findOne(userId);
            //log.info("doPushNotification, single:", userId);//very verbose
            if(userObj) {
                if (userObj.pushNotifications) {
                    filteredUserIdsWhoEnablePushNotify.push(userId);
                    notificationObj.badge = Smartix.helpers.getTotalUnreadNotificationCount(userId);
                    Push.send(notificationObj);
                }
                else { // User chose not to be notified, it's OK
                    log.info("doPushNotification, cannot notify, user chose not to be notified",  userId);
                }
            }
            else { // User not found, why ? It's an issue to be fixed
                log.warn("doPushNotification, cannot notify, user not found ",  userId);
            }
        }
        var userIds = filteredUserIdsWhoEnablePushNotify;
        if(inAppNotifyObj && notificationObj.payload.type === 'chat'){
            //send notification via websocket using Streamy
            userIds.map(function(userId){
                var userObj = Meteor.users.findOne(userId);
                if (userObj && userId) {
                    //log.info("streamy:newchatmessage:"+userId);
                    var socketObj = Streamy.socketsForUsers(userId);
                    socketObj._sockets.map(function(socket){
                        Streamy.emit('newchatmessage', { from: notificationObj.from,
                            text: notificationObj.text,
                            chatRoomId: inAppNotifyObj.groupId
                        }, socket);
                    });
                }
                else {
                    log.warn("doPushNotification 'chat', cannot notify via streamy, user not found ", userId);
                }
            });
        }
        else if(inAppNotifyObj && notificationObj.payload.type === 'class'){
            userIds.map(function(userId){
                //log.info("streamy:newchatmessage:"+userId);
                var userObj = Meteor.users.findOne(userId);
                if (userObj && userId) {
                    var socketObj = Streamy.socketsForUsers(userId);
                    socketObj._sockets.map(function(socket){
                        Streamy.emit('newclassmessage', { from: notificationObj.from,
                            text: notificationObj.text,
                            classCode: inAppNotifyObj.classCode
                        }, socket);
                    });
                }
                else {
                    log.warn("doPushNotification 'class', cannot notify via streamy, user not found ", userId);
                }
            });
        }
        else if(inAppNotifyObj && notificationObj.payload.type === 'newsgroup'){
            //log.info('newsgroup',notificationObj);
            userIds.map(function(userId){
                var userObj = Meteor.users.findOne(userId);
                if (userObj && userId) {
                    var socketObj = Streamy.socketsForUsers(userId);
                    socketObj._sockets.map(function(socket){
                        Streamy.emit('newnewsgroupmessage', { from: notificationObj.title, text: notificationObj.text
                        }, socket);
                    });
                }
                else {
                    log.warn("doPushNotification 'newsgroup', cannot notify via streamy, user not found ", userId);
                }
            });
        }
        else if(notificationObj.payload.type === 'attendance' && notificationObj.payload.subType === 'attendanceSubmission'){
            //log.info(notificationObj.payload.subType,notificationObj);
            userIds.map(function(userId){
                var userObj = Meteor.users.findOne(userId);
                if (userObj && userId) {
                    var socketObj = Streamy.socketsForUsers(userId);
                    socketObj._sockets.map(function(socket){
                        Streamy.emit(notificationObj.payload.subType, { from: notificationObj.title, text: notificationObj.text,
                            namespace: notificationObj.payload.namespace
                        }, socket);
                    });
                }
                else {
                    log.warn("doPushNotification 'attendance subtype', cannot notify via streamy, user not found ", userId);
                }
            });
        }
        else{
            //log.info('other',notificationObj);
            userIds.map(function(userId){
                var userObj = Meteor.users.findOne(userId);
                if (userObj && userId) {
                    var socketObj = Streamy.socketsForUsers(userId);
                    socketObj._sockets.map(function(socket){
                        Streamy.emit('other', { from: notificationObj.title, text: notificationObj.text
                        }, socket);
                    });
                }
                else {
                    log.warn("doPushNotification 'other', cannot notify via streamy, user not found ", userId);
                }
            });
        }
    },

    addInvitedPplId: function (id) {
        var profile = "";
        if (!Meteor.user().profile['invitedContactIds']) {
            profile = Meteor.user().profile;
            var contactsIds = [];
            contactsIds.push(id);
            profile.contactsIds = contactsIds;
            Meteor.users.update(Meteor.userId(), {$set: {profile: profile}});
        } else {
            profile = Meteor.user().profile;
            var contactsIds = Meteor.user().profile.contactsIds.push(id);
            profile.contactsIds = contactsIds;
            //log.info(profile);
            Meteor.users.update(Meteor.userId(), {$set: {profile: profile}});
        }
    },

    getShareLink: function (classCode) {
        //not in use
        return Meteor.settings.public.SHARE_URL + "/" + classCode;
    },

    giveComment: function (commentObj) {
        var selector = {};
        selector.userId = commentObj.userId;
        selector.classId = commentObj.classId;
        Commend.upsert(selector, {
            $set: {
                comment: commentObj.comment
            }
        });
    },

    'class/removeStd': function (dataObject) {
        var selector = {};
        selector.userId = dataObject.userId;
        selector.classId = dataObject.classId;

        //log.info(dataObject);
        //log.info(dataObject.userId);
        //log.info(dataObject.classId);
        // Commend.remove(dataObject);
        Smartix.Groups.Collection.update({
            _id: dataObject.classId
        }, {
            $pull: {
                users: dataObject.userId
            }
        });
    },

    getPpLink: function (lang) {
        //this is broken and not called
        return Meteor.settings.public.SHARE_URL + "/legal/" + lang + ".privacy.html";
    },

    updateProfileByPath: function (path, value) {
        // var obj = {};
        // obj = lodash.set(obj,path,value);
        this.unblock();
        var user = Meteor.user();
        lodash.set(user, path, value);
        if(typeof user === 'object') {
            Meteor.users.update(Meteor.userId(), user, function(err, success){
                if(err)
                    log.error("Error", err);
            });
        }
        else {
            //invoking method 'updateProfileByPath' Error: Invalid modifier. Modifier must be an object
            log.error("updateProfileByPath:latent bug", (typeof user));
            log.error("updateProfileByPath:latent bug:user", user);
            log.error("updateProfileByPath:latent bug:value", value);
        }
    },

    updateProfileByPath2: function (path, func) {
        var value = lodash.get(Meteor.user(), 'profile.' + path) || "";
        var newValue = func(value);
        var updateObj = {};
        updateObj['profile' + path] = newValue;
        Meteor.users.update(Meteor.userId(), {$set: updateObj});
    },

    addReferral: function (userId) {
        Meteor.users.update(Meteor.userId(), {$inc: {'referral': 1}});
    },

    getUserList:function(){
        if(Meteor.user().admin){
            var result = Meteor.users.find({}).fetch();
            return result;
        } else {
            return "";
        }
    },
    getClassList:function(){
        if(Meteor.user().admin){
            var result = Smartix.Groups.Collection.find({
                type: 'class'
            }).fetch();
            return result;
        } else {
            return "";
        }
    },
    getSetting:function(){
        if(Meteor.user().admin){
            var result = Meteor.settings.public;
            var resultWrapInArray = [];
            resultWrapInArray.push(result);

            return resultWrapInArray;
        } else {
            return [];
        }
    }

});



