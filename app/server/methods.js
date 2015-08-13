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
  'addClassMail': function(to, _id) {

    var classObj = Classes.findOne({
      _id: _id
    });
    try {
      Mandrill.messages.send(addClassMailTemplate(to, classObj.classname));
    } catch (e) {
      console.log(e);
    }
  },
  "class/invite": function(doc) {

    console.log(doc);

    var classObj = Classes.findOne({
      classCode: doc.classCode
    });
    var first = Meteor.user().profile.firstname;
    var last = Meteor.user().profile.lastname;


    Meteor.setTimeout(function() {
      try {
        Mandrill.messages.send(inviteClassMailTemplate(
          doc.emailOrName,
          first,
          last,
          doc.classCode,
          classObj.className
        ));
      } catch (e) {
        console.log(e);
      }
    }, 2 * 1000);

    /*Router.go("Classes");*/

  },
  "sendMsg": function(target, msg) {
    var msgObj = {};
    var date = Date.now();
    msgObj.msgId = CryptoJS.SHA1(date + msg).toString().substring(0, 6);
    msgObj.content = msg;
    msgObj.like = [];
    msgObj.dislike = [];
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

    var arr = ['like', 'dislike'];


    var selector = {};
    selector.classCode = classObj.classCode;
    selector.messagesObj = {
      $elemMatch: {
        msgId: msgId
      }
    };

    _.forEach(arr, function(element, index) {

      var updateObj={};
        updateObj['messagesObj.$.'+element] =  Meteor.userId();


      Classes.update(
        selector,
        {$pull:  updateObj  }
      )


    })


    if(type){
      var updateObj2={};

        updateObj2['messagesObj.$.'+type] = Meteor.userId();

      Classes.update(
        {classCode:classObj.classCode, messagesObj:{$elemMatch:{msgId:msgId}}},
        {$push: updateObj2 }
      )
    }


  }

// db.test.update({_id:"cpkqcGycHWBw7Qkz9", messagesObj:{$elemMatch:{msgId:"c62bdf"}}},{$push:{'messagesObj.$.like':"a"}})



});
