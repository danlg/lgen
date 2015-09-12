/*****************************************************************************/
/* Server Only Methods */
/*****************************************************************************/



Meteor.methods({
  /*
   * Example:
   *
   * '/app/items/insert': function (item) {
   * }
   */
  'ping': function() {
    this.unblock();
    try {
      console.log(Mandrill.users.ping());
    } catch (e) {
      console.log(e);
    }
  },
  'ping2': function() {
    this.unblock();
    try {
      console.log(Mandrill.users.ping2());
    } catch (e) {
      console.log(e);
    }
  },
  'testEmail': function() {
    try {
      Mandrill.messages.send(testMail("", ""));
    } catch (e) {
      console.log(e);
    }
  },
  'FeedBack': function(content) {
    // feedback@littlegenius.io
    try {
      Mandrill.messages.send(feedback(content));
    } catch (e) {
      console.log(e);
    }
  },
  'addClassMail': function(to, _id) {

    var classObj = Classes.findOne({
      _id: _id
    });
    try {
      Mandrill.messages.send(addClassMailTemplate(to, classObj.className,classObj.classCode));
    } catch (e) {
      console.log(e);
    }
  },
  "class/invite": function(classObj,targetFirstEmail) {

    var acceptLink = process.env.WEB_URL +classObj.classCode;
    var acceptLinkEncoded =  encodeURI(acceptLink);
    var first = Meteor.user().profile.firstname;
    var last = Meteor.user().profile.lastname;

    // console.log("send invite");
    // console.log(first+last+" "+acceptLinkEncoded+" TO: "+"  "+ targetFirstEmail);
    // console.log(inviteClassMailTemplateTest(targetFirstEmail, classObj));

    try {
      Mandrill.messages.send(inviteClassMailTemplateTest(targetFirstEmail, classObj));
    } catch (e) {
      console.log(e);
    }

  },
  "sendMsg": function(target, msg) {

    var msgObj = {};
    var date = moment().format('x');
    msgObj.msgId = CryptoJS.SHA1(date + msg).toString().substring(0, 6);
    msgObj.content = msg;
    msgObj.checked = [];
    msgObj.star = [];
    msgObj.close = [];
    msgObj.help = [];
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

  },
  'updateMsgRating': function(type, msgId, classObj) {

    var arr = ["star", "checked", "close", "help"];



    var selector = {};
    selector.classCode = classObj.classCode;
    selector.messagesObj = {
      $elemMatch: {
        msgId: msgId
      }
    };

    _.forEach(arr, function(element, index) {

      var updateObj={};
        updateObj['messagesObj.$.'+element] = {_id:Meteor.userId()};


      Classes.update(
        selector,
        {$pull:  updateObj  }
      )


    })
    if(type){
      var updateObj2={};
        updateObj2['messagesObj.$.'+type] = Meteor.user();
      Classes.update(
        {classCode:classObj.classCode, messagesObj:{$elemMatch:{msgId:msgId}}},
        {$push: updateObj2 }
      )
    }
  },


  'chat/create':function(chatArr){
    /*var _id = lodash.first(chatArr);*/
    // var arrOfUser = Meteor.users.find({_id:{$in:chatArr}}).fetch();

    // arrOfUser.push(Meteor.user());
    chatArr.push(Meteor.userId());
    var res = Chat.findOne({chatIds:{$all:chatArr}});
    if(res)
    {
      return res._id;
    }
    else{
        //no room exists
      var newRoom= Chat.insert({chatIds:chatArr,messagesObj:[]});
      return newRoom;
    }
  },


  'chat/setting/update':function(doc){
    Meteor.users.update({_id:Meteor.userId()},{$set:{'profile.chatSetting':doc}},{validate: false});
  },



  'getFullNameById':function(id){
    var userObj = Meteor.users.findOne({_id:id});
    var name =  userObj.profile.firstname+" "+userObj.profile.lastname;
    return name ;
  },

  'chatSendImage':function (file,chatRoomId) {

    Images.insert(file, function(err, fileObj) {
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


        Chat.update({_id:Router.current().params.chatRoomId},{$push:{messagesObj:pushObj}});

      }
    });





  },
  'pushTest':function (userId) {
    Push.send({
        from: 'push',
        title: 'Hello',
        text: 'world',
        query: {
            userId: userId
        }
    });
  },
  serverNotification: function ( notificationObj ) {

    Push.send(notificationObj);

	},
  'insertImageTest':function (filePath) {

    Images.insert(filePath, function (err, fileObj) {
        if(err)console.log(err);
        else{
          console.log(fileObj);
        }
    });
  },
  'addInvitedPplId':function (id) {
    var profile="";
    if(!Meteor.user().profile['invitedContactIds']){
      profile = Meteor.user().profile;
      var contactsIds = [];
      contactsIds.push(id);
      profile.contactsIds=contactsIds;
      Meteor.users.update(Meteor.userId(),{$set:{profile:profile}});
    }else{
      profile = Meteor.user().profile;
      var contactsIds = Meteor.user().profile.contactsIds.push(id);
      profile.contactsIds=contactsIds;
      console.log(profile);
      Meteor.users.update(Meteor.userId(),{$set:{profile:profile}});
    }
  },
  'getShareLink':function (classCode) {
    return process.env.WEB_URL+classCode;
  }


});
