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
    console.log("asd");
    this.unblock();
    try {
      console.log(Mandrill.users.ping());
    } catch (e) {
      console.log(e);
    }
  },
  'ping2': function() {
    console.log("asd");
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
  'addClassMail': function(to, _id) {

    var classObj = Classes.findOne({
      _id: _id
    });
    try {
      Mandrill.messages.send(addClassMailTemplate(to, classObj.className));
    } catch (e) {
      console.log(e);
    }
  },
  "class/invite": function(classObj,targetFirstEmail) {

    /*console.log(doc);

    var classObj = Classes.findOne({
      classCode: doc.classCode
    });

    */

    var acceptLink ="http://localhost:3000/"+classObj.classCode;
    var acceptLinkEncoded =  encodeURI(acceptLink);


    var first = Meteor.user().profile.firstname;
    var last = Meteor.user().profile.lastname;

      try {
        Mandrill.messages.send(inviteClassMailTemplate(
          targetFirstEmail,
          first,
          last,
          classObj.classCode,
          classObj.className,
          acceptLinkEncoded
        ));
      } catch (e) {
        console.log(e);
      }

    /*Router.go('TabClasses')*/

  },
  "sendMsg": function(target, msg) {

    var msgObj = {};
    var date = Date.now();
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





  }


});
