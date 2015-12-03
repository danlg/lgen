/* Server Only Methods */

Meteor.methods({
   /* Example:
   * '/app/items/insert': function (item) {}
   */

  ping: function () {
    this.unblock();
    try {
     log.info(Mandrill.users.ping());
    }
    catch (e) {
      log.error(e);
    }
  },

  ping2: function () {
    this.unblock();
    try {
      log.info(Mandrill.users.ping2());
    }
    catch (e) {
      log.error(e);
    }
  },

  testEmail: function () {
    try {
      Mandrill.messages.send(testMail("", ""));
    }
    catch (e) {
      log.error(e);
    }
  },

  feedback: function (content) {
    // feedback@littlegenius.io
    try {
      Mandrill.messages.send(feedback(content));
    }
    catch (e) {
      log.error(e);
    }
  },
  chatroomEmail: function(recipientUser,orginateUser,content){
    //log.info(recipientUser);
    //log.info(orginateUser);
    //log.info(content);
    
    //send to user only if they opt to receive email
    var isUserOptToReceiveEmail = recipientUser.profile.email;
    log.info(isUserOptToReceiveEmail);
  
    if (isUserOptToReceiveEmail) {
      
      //need to make sure the email is verfied. For now, to ensure that, only people login by google can be checked.
      //TODO: verify user's email address who is not registered with google acc.
      if (recipientUser.services) {
        if (recipientUser.services.google) {
          if (recipientUser.services.google.verified_email) {
            log.info("try sending chat room mail to " + recipientUser.emails[0].address);
            
            var chatRoomRecepientArr = [];
            var chatRoomRecepient = { 
                email: recipientUser.emails[0].address,
                name:  recipientUser.profile.name
            }
            chatRoomRecepientArr.push(chatRoomRecepient);
            
            try {
              Mandrill.messages.send(messageEmailTemplate(chatRoomRecepientArr, orginateUser.profile.name, content));
            }
            catch (e) {
              log.error(e);
            }
          }
        }
      }
    }
  },

  addClassMail: function (to, _id) {
    var classObj = Classes.findOne( {_id: _id});
    if (lodash.get(Meteor.user(), "profile.email")) {
      try {
        
        log.info("newClassMail:" + classObj.classCode);
        //retrieveContent("en");
        Mandrill.messages.send(newClassMailTemplate(to, classObj.className, classObj.classCode));
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
    log.info("send invite");
    log.info(first+last+" "+acceptLinkEncoded+" TO: "+"  "+ targetFirstEmail);
    log.info(inviteClassMailTemplate(targetFirstEmail, classObj));
    if (lodash.get(Meteor.user(), "profile.email")) {
      try {
        Mandrill.messages.send(inviteClassMailTemplate(targetFirstEmail, classObj));
      }
      catch (e) {
        log.error(e);
      }
    }
  },

  sendMsg: function (target, msg, mediaObj, classId) {
    var msgObj = {};
    var date = moment().format('x');
    // msgObj.msgId = CryptoJS.SHA1(date + msg).toString().substring(0, 6);
    msgObj.msgId = Random.id();
    msgObj.sendAt = date;
    msgObj.content = msg;
    msgObj.checked = [];
    msgObj.star  = [];
    msgObj.close = [];
    msgObj.help  = [];
    msgObj.imageArr = mediaObj.imageArr;
    msgObj.soundArr = mediaObj.soundArr;
    Classes.update({
      classCode: {
        $in: target
      }
    }, {
      $push: {
        messagesObj: msgObj
      }
    }, {
      validate: false
    });
    
    if(!msg){
      if (msgObj.imageArr && msgObj.imageArr.length>0){
               msg="New image";
      }
      if (msgObj.soundArr && msgObj.soundArr.length>0){
               msg="New sound";
      }
    }
    var arrayOfClasses = Classes.find({classCode: {$in: target}}).fetch();
    var arrayOfTarget = lodash.map(arrayOfClasses, 'joinedUserId');
    var flattenArray = lodash.flatten(arrayOfTarget);
    var index = flattenArray.indexOf(Meteor.userId());
    if (index > -1) {
      flattenArray.splice(index, 1);
    }
    Push.send({
      from: 'push',
      title: 'Message From Classroom',
      text: msg,
      query: {
        userId: {$in: flattenArray}
      }
    });
    sendEmailMessageToClasses(flattenArray,arrayOfClasses,msg,Meteor.user());
  },

  updateMsgRating: function (type, msgId, classObj) {
    var arr = ["star", "checked", "close", "help"];
    var selector = {};
    selector.classCode = classObj.classCode;
    selector.messagesObj = {
      $elemMatch: {
        msgId: msgId
      }
    };
    _.forEach(arr, function (element, index) {
      var updateObj = {};
      updateObj['messagesObj.$.' + element] = {_id: Meteor.userId()};
      Classes.update(
        selector,
        {$pull: updateObj}
      );
    });
    if (type) {
      var updateObj2 = {};
      updateObj2['messagesObj.$.' + type] = Meteor.user();
      Classes.update(
        {classCode: classObj.classCode, messagesObj: {$elemMatch: {msgId: msgId}}},
        {$push: updateObj2}
      );
    }
  },

  chatCreate: function (chatArr) {
    /*var _id = lodash.first(chatArr);*/
    // var arrOfUser = Meteor.users.find({_id:{$in:chatArr}}).fetch();
    // arrOfUser.push(Meteor.user());
    chatArr.push(Meteor.userId());
    var res = Chat.findOne({chatIds: {$all: chatArr}});
    if (res) {
      return res._id;
    }
    else {
      //no room exists
      var newRoom = Chat.insert({chatIds: chatArr, messagesObj: []});
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

  serverNotification: function (notificationObj) {
    var userId = notificationObj.query.userId;
    var userObj = Meteor.users.findOne(userId);
    if (lodash.get(userObj, 'profile.push')) {
      Push.send(notificationObj);
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
  }  

});


sendEmailMessageToClasses = function(targetUserids, classes, message, originateUser){
  
  //if it is a solely image or voice message, exit early.
  if(message == ""){
    return;
  }
  
  var arrayOfTargetUsers = Meteor.users.find({ _id: { $in: targetUserids } }).fetch();
  log.info(arrayOfTargetUsers);

  var classRecepientArr = [];
  arrayOfTargetUsers.forEach(function (targetUser) {
    
    if (targetUser.profile.email) {
      if (targetUser.services) {
        if (targetUser.services.google) {
          if (targetUser.services.google.verified_email) {
            
            var classRecepient = {
              email: targetUser.emails[0].address,
              name: targetUser.profile.name
            }
            classRecepientArr.push(classRecepient);
          }
        }
      }
    }
  });

  //extract and join all the classes name to a single string
  var allClassName = lodash.flatten(lodash.map(classes, 'className')).join();

  try {
    Mandrill.messages.send(messageEmailTemplate(classRecepientArr, originateUser.profile.name, message, allClassName));
    log.info(classRecepientArr.length + " email(s) are sent for class(es) " + allClassName + " msg: " + message);
  }
  catch (e) {
    log.error(e);
  }  
      
}
