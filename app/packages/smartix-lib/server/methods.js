/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/* Server Only Methods */

Meteor.methods({

  'class/join': function (doc, userToAdd) {
      
    check(userToAdd, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    if(!(userToAdd === null)) {
        userToAdd = userToAdd || this.userId || Meteor.userId();
    }
      
    if (doc && doc.classCode) {
      log.info("class/join:" + doc.classCode.trim());
      var classCode = doc.classCode.trim();
      var regexp = new RegExp("^" + classCode.trim() + "$", "i");
      var resultset = Smartix.Groups.Collection.findOne({"classCode": {$regex: regexp}});//OK
      
      var targetSchoolNamespace = doc.schoolName;
      if(doc.schoolName === 'global' || doc.schoolName === 'system'){
         targetSchoolNamespace = doc.schoolName;
      }else{
        var targetSchool = SmartixSchoolsCol.findOne({username:doc.schoolName});
        targetSchoolNamespace = targetSchool._id;           
      }
      
      if (resultset) {
        
        if(resultset.namespace !== targetSchoolNamespace){
          log.info('class/join: cant join the class in different namespace');
          throw new Meteor.Error("class-different-namespace", "Can't join the class in different namespace");
        }
        
        if (resultset.admins.indexOf(userToAdd) > -1) {
          log.warn("class/join: can't join the class you own:" + classCode + ":from user:" + userToAdd);
          throw new Meteor.Error("class-you-own", "Can't join a class you own");
        }
        else {
          log.info("User " + userToAdd + " attempting to join class " + doc.classCode);
          //log.info("Server?"+Meteor.isServer);
          //this was the trick to make it case insensitive
          
          Smartix.Class.addUsersToClass(resultset._id, [userToAdd]);
          
          
        //   Smartix.Groups.Collection.update(
        //     {"classCode": {$regex: regexp}},
        //     {
        //       $addToSet: {users: userToAdd}
        //     });
          return true;
        }
      }
      else { //class is not found
        log.info("classcode '" + classCode + "' not found");
        throw new Meteor.Error("class-not-foun", "Can't find the class");
      }
    }
    else {
      log.warn("there is no input");
    }
    return false;
  },
  'class/joinAsAdmin': function (doc, userToAdd) {
      
      // 
      
      check(userToAdd, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    if(!(userToAdd === null)) {
        userToAdd = userToAdd || this.userId || Meteor.userId();
    }
    
    if (doc && doc.classCode) {
      log.info("class/join:" + doc.classCode.trim());
      var classCode = doc.classCode.trim();
      var regexp = new RegExp("^" + classCode.trim() + "$", "i");
      var resultset = Smartix.Groups.Collection.findOne({"classCode": {$regex: regexp}});//OK
      
      var targetSchoolNamespace = doc.schoolName;
      if(doc.schoolName === 'global' || doc.schoolName === 'system'){
         targetSchoolNamespace = doc.schoolName;
      }else{
        var targetSchool = SmartixSchoolsCol.findOne({username:doc.schoolName});
        targetSchoolNamespace = targetSchool._id;           
      }
      
      if (resultset) {
        
        if(resultset.namespace !== targetSchoolNamespace){
          log.info('class/join: cant join the class in different namespace');
          throw new Meteor.Error("class-different-namespace", "Can't join the class in different namespace");
        }
        
        else {
          log.info("User " + userToAdd + " attempting to join class " + doc.classCode);
          //log.info("Server?"+Meteor.isServer);
          //this was the trick to make it case insensitive
          
          Smartix.Class.addAdminsToClass(resultset._id, [userToAdd]);
          
        //   Smartix.Groups.Collection.update(
        //     {"classCode": {$regex: regexp}},
        //     {
        //       $addToSet: {admins: userToAdd}
        //     });
          return true;
        }
      }
      else { //class is not found
        log.info("classcode '" + classCode + "' not found");
        throw new Meteor.Error("class-not-foun", "Can't find the class");
      }
    }
    else {
      log.warn("there is no input");
    }
    return false;
  },
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
  
    var notificationObjType;
    var filteredUserIdsWhoEnablePushNotify = [];
    
    //if is an object. i.e userId: {$in: flattenArray}
    if(lodash.isPlainObject(notificationObj.query.userId) ){
            notificationObjType="multiple";      
            //only keep users who want to receive push notification
                filteredUserIdsWhoEnablePushNotify = notificationObj.query.userId.$in.filter(function(eachUserId){
                var userObj = Meteor.users.findOne(eachUserId);
                if (userObj.pushNotifications) {
                   return true;
                }else{
                   return false;
                }    
            });
            notificationObj.query.userId.$in = filteredUserIdsWhoEnablePushNotify;
            Push.send(notificationObj);


    }else{
    //else if is just one userid
        notificationObjType="single";
        var userId = notificationObj.query.userId;
        var userObj = Meteor.users.findOne(userId);
        log.info('doPushNotification:',userObj,userId);
        if (userObj.pushNotifications) {
            filteredUserIdsWhoEnablePushNotify.push(userId);
            notificationObj.badge = Smartix.helpers.getTotalUnreadNotificationCount(userId);
            Push.send(notificationObj);
        }             
    }
    
    if(inAppNotifyObj && notificationObj.payload.type == 'chat'){
        
        var userIds = filteredUserIdsWhoEnablePushNotify;
        
        //send notification via websocket using Streamy
        userIds.map(function(userId){
            //log.info("streamy:newchatmessage:"+userId);
            var socketObj = Streamy.socketsForUsers(userId);
            //log.info(socketObj);
            
            socketObj._sockets.map(function(socket){
                Streamy.emit('newchatmessage', { from: notificationObj.from,
                                                text: notificationObj.text,
                                                chatRoomId: inAppNotifyObj.groupId                                  
                }, socket); 
            });
        });        
    }else if(inAppNotifyObj && notificationObj.payload.type == 'class'){
        
        var userIds = filteredUserIdsWhoEnablePushNotify;
        
        //send notification via websocket using Streamy
        userIds.map(function(userId){
            //log.info("streamy:newchatmessage:"+userId);
            var socketObj = Streamy.socketsForUsers(userId);
            //log.info(socketObj);
            
            socketObj._sockets.map(function(socket){
                Streamy.emit('newclassmessage', { from: notificationObj.from,
                                                text: notificationObj.text,
                                                classCode: inAppNotifyObj.classCode                                  
                }, socket); 
            });
        });          
    }else if(inAppNotifyObj && notificationObj.payload.type == 'newsgroup'){
        log.info('newsgroup',notificationObj);
        var userIds = filteredUserIdsWhoEnablePushNotify;
        
        //send notification via websocket using Streamy
        userIds.map(function(userId){
            //log.info("streamy:newchatmessage:"+userId);
            var socketObj = Streamy.socketsForUsers(userId);
            //log.info(socketObj);
            
            socketObj._sockets.map(function(socket){
                Streamy.emit('newnewsgroupmessage', { from: notificationObj.title,
                                                text: notificationObj.text                                 
                }, socket); 
            });
        });          
    }

  },

  insertImageTest: function (filePath) {
    Images.insert(filePath, function (err, fileObj) {
      if (err)log.error(err);
      else {
        log.info(fileObj);
      }
    });
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
      log.info(profile);
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

    log.info(dataObject);
    log.info(dataObject.userId);
    log.info(dataObject.classId);
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
    var user = Meteor.user();
    lodash.set(user, path, value);
    Meteor.users.update(Meteor.userId(), user);
  },

  updateProfileByPath2: function (path, fuc) {
    var value = lodash.get(Meteor.user(), 'profile.' + path) || "";
    var newValue = fuc(value);
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



