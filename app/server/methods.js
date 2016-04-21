/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/* Server Only Methods */


var key = Meteor.settings.SPARKPOST_KEY
  , SparkPost = Meteor.npmRequire('sparkpost')
  , client = new SparkPost(key);

Meteor.methods({

  testEmail: function () {
    try {
      client.transmissions.send(testMail("", ""));
      log.info("Sent Email!");
    }
    catch (e) {
      log.error(e);
    }
  },

  feedback: function (content) {
    // feedback@littlegenius.io
    console.log(feedback(content));
    try {
      client.transmissions.send(feedback(content),
      function(err, res) {
                if (err) {
                    console.log('Something went wrong');
                    console.log(err);
                } else {
                    console.log('Email Sent!');
                }
            });
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
                                        if(user.profile.email){
                                            if(user.emails[0].verified || user.services.google.verified_email){
                                                return true;
                                            }   
                                        }else{
                                            return false;
                                        }
                                      })
                                      .groupBy('profile.lang')
                                      .value();
    
    log.info(optInUsersGroupByLang);
    
    for(var lang in optInUsersGroupByLang){
        
        var chatRoomRecepientArr = []; 
        optInUsersGroupByLang[lang].map(function(eachUser){
            var chatRoomRecepient = { 
                email: eachUser.emails[0].address,
                name:  eachUser.profile.firstname+ " " + eachUser.profile.lastname
            }
            chatRoomRecepientArr.push(chatRoomRecepient);            
        });
        
        log.info(chatRoomRecepientArr);
        log.info(lang);
        
        
            try {
              var emailTemplateByUserLangs = messageEmailTemplate(chatRoomRecepientArr, orginateUser, content);
            //   , {
            //                                     type:'chat',
            //                                     lang:lang
            //                                  });  
              console.log(emailTemplateByUserLangs);
              client.transmissions.send(emailTemplateByUserLangs,function(err, res) {
                if (err) {
                    console.log('Something went wrong');
                    console.log(err);
                } else {
                    console.log('Email Sent!');
                }
            });
            }
            catch (e) {
              log.error(e);
            }
               
    }
  },

  addClassMail: function (to, _id) {
    var classObj = Classes.findOne( {_id: _id});
    if (lodash.get(Meteor.user(), "profile.email")) {
      try {
        
        log.info("newClassMail:" + classObj.classCode);
        //retrieveContent("en");
        client.transmissions.send(newClassMailTemplate(to, classObj.className, classObj.classCode),
         function(err, res) {
                if (err) {
                    console.log('Something went wrong');
                    console.log(err);
                } else {
                    console.log('Email Sent!');
                }
            }
        );
      }
      catch (e) {
        log.error("add class mail: " + e);
      }
    }
  },

  classinvite: function (classObj, targetFirstEmail) {
    var acceptLink = Meteor.settings.public.SHARE_URL + "/join/" + classObj.classCode;
    var acceptLinkEncoded = encodeURI(acceptLink);
    var first = Meteor.user().profile.firstname;
    var last = Meteor.user().profile.lastname;
    log.info("classinvite:classCode:"+ classObj.classCode+":from:"+last+ ":to:"+ targetFirstEmail + ":URI:"+acceptLinkEncoded);
    //do not log the CONTENT of every message sent !
      try {
        client.transmissions.send(inviteClassMailTemplate(targetFirstEmail, classObj),
        function(err, res) {
                    if (err) {
                        console.log('Something went wrong');
                        console.log(err);
                    } else {
                        console.log('You just sent your mail!');
                    }
            });
      }
      catch (e) {
        log.error("classinvite:couldn't send invite email:classCode:"+ classObj.classCode+ ":to:"+ targetFirstEmail );
        log.error(e);
      }
    
  },
  chatCreate: function (chatArr,chatObjExtra) {
    //user who create this chat is also added into the chat
    chatArr.push(Meteor.userId());
    
    //try to find if there is existing room
    //size needs to be specified, or else a wrong result of larger chat room group may be found
    //http://stackoverflow.com/questions/6165121/mongodb-query-an-array-for-an-exact-element-match-but-may-be-out-of-order/6165143#6165143
    var res = Chat.findOne({chatIds: {$size : chatArr.length, $all: chatArr}});
    if (res) {
      //return the existing chat room id if there is one
      return res._id;
    }
    else {
      //no room exists. create a new one
      var newRoom;
      
      //add createdAt,lastUpdatedAt field in chat collection
      var ChatObj = {chatIds: chatArr, messagesObj: [], createdAt: new Date(), createdBy: Meteor.userId(), lastUpdatedAt: new Date(),lastUpdatedBy: Meteor.userId()};
      //var ChatObj = {chatIds: chatArr, messagesObj: []};
      //extra property for chat room, currently use during create of group chat room only.
      if(chatObjExtra){
          
          if(chatObjExtra.chatRoomName && chatObjExtra.chatRoomName !=""){
              ChatObj.chatRoomName = chatObjExtra.chatRoomName;
          }
                
          if(chatObjExtra.chatRoomAvatar && chatObjExtra.chatRoomAvatar !=""){
              ChatObj.chatRoomAvatar = chatObjExtra.chatRoomAvatar;              
          }
          
          if(chatObjExtra.chatRoomModerator && chatObjExtra.chatRoomModerator !=""){
              ChatObj.chatRoomModerator = chatObjExtra.chatRoomModerator;
          }
      }
      //log.info(ChatObj); 
      newRoom = Chat.insert(ChatObj);          
      
      return newRoom;
    }
  },

  'chat/setting/update': function (doc) {
    Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.chatSetting': doc}}, {validate: false});
  },

  getFullNameById: function (id) {
    var userObj = Meteor.users.findOne({_id: id});
    var name = userObj.profile.firstname + " " + userObj.profile.lastname;
    return name;
  },
  getAvatarById: function(id){
    var userObj = Meteor.users.findOne({_id: id});
    
    if(userObj && userObj.profile && userObj.profile.useravatar ){
     return userObj.profile.useravatar;
    }else{
     return "green_apple";             
    }

  },
  getUserCreateClassesCount: function(){
      return Classes.find({createBy: Meteor.userId()}).count();
  },
  chatSendImage: function (file, chatRoomId) {
    Images.insert(file, function (err, fileObj) {
      if (err) {
        // handle error
      } else {
        // handle success depending what you need to do
        var userId = Meteor.userId();
        var imagesURL = {
          'profile.image': '/cfs/files/images/' + fileObj._id
        };
        // Meteor.users.update(userId, {
        //   $set: imagesURL
        // });

        var pushObj = {};
        pushObj.from = Meteor.user();
        pushObj.sendAt = moment().format('x');
        pushObj.text = "";
        pushObj.image = fileObj._id;

        Chat.update({_id: Router.current().params.chatRoomId}, {$push: {messagesObj: pushObj}});
      }
    });
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

  serverNotification: function (notificationObj,inAppNotifyObj) {
  
    var notificationObjType;
    var filteredUserIdsWhoEnablePushNotify = [];
    
    //if is an object. i.e userId: {$in: flattenArray}
    if(lodash.isPlainObject(notificationObj.query.userId) ){
            notificationObjType="multiple";      
            //only keep users who want to receive push notification
                filteredUserIdsWhoEnablePushNotify = notificationObj.query.userId.$in.filter(function(eachUserId){
                var userObj = Meteor.users.findOne(eachUserId);
                if (lodash.get(userObj, 'profile.push')) {
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
        if (lodash.get(userObj, 'profile.push')) {
            filteredUserIdsWhoEnablePushNotify.push(userId);
            notificationObj.badge = getTotalUnreadNotificationCount(userId);
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
                                                chatRoomId: inAppNotifyObj.chatRoomId                                  
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
    Classes.update({_id: dataObject.classId}, {$pull: {joinedUserId: dataObject.userId}});
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
    Meteor.users.update(Meteor.userId(), {$inc: {'profile.referral': 1}});
  },
  resendVerificationEmail: function(email){
      log.info(Meteor.userId());
      if (email) {
       var newEmailArray = [];
       newEmailArray.push({address:email,verified:false});
       Meteor.users.update(Meteor.userId(), {$set: {emails: newEmailArray}});
       
        Accounts.sendVerificationEmail(Meteor.userId(), email);
      } else {
        Accounts.sendVerificationEmail(Meteor.userId());
      }
  },
  getUserList:function(){
    if(Meteor.user().admin){
      var result = Meteor.users.find({}).fetch();
      return result;
    }else{
      return "";
    }
  },
  getClassList:function(){
    if(Meteor.user().admin){
      var result = Classes.find({}).fetch();
      return result;
    }else{
      return "";
    }    
  },
  getSetting:function(){
    if(Meteor.user().admin){
      var result = Meteor.settings.public;
      var resultWrapInArray = [];
      resultWrapInArray.push(result);
      
      return resultWrapInArray;
    }else{
      return [];
    }    
  }

});

