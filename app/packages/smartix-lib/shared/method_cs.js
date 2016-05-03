/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*
 Client and Server Methods */

Meteor.methods({

  'signup/email': function (doc) {
    if (!lodash.has(doc, 'dob')) {
      doc.dob = "";
    }
    Accounts.createUser({
      email: doc.email,
      password: doc.password,
      profile: {
        firstname: doc.firstname,
        lastname: doc.lastname,
        role: doc.role,
        dob: doc.dob
      }
    });
  },
  'class/search': Smartix.Class.searchForClassWithClassCode,

  //todo remove redundant API function
  'class/searchExact': Smartix.Class.searchForClassWithClassCode,

  'class/leave': function (classId) {
    Smartix.Groups.Collection.update({_id: classId}, {$pull: {users: Meteor.userId()}});
  },

  'class/leaveByCode': function (classCode) {
    Smartix.Groups.Collection.update({classCode: classCode}, {$pull: {users: Meteor.userId()}});
  },

  'class/deleteUser': function (classObj, userid) {
    Smartix.Groups.Collection.update(classObj, {$pull: {users: userid}});
  },

  'class/deleteAllUser': function (classObj) {
    Smartix.Groups.Collection.update(classObj, {$set: {users: []}});
  },

  'class/delete': function (classObj) {
    Smartix.Groups.Collection.remove(classObj);
  },

  'class/update': function (doc) {
    Smartix.Groups.Collection.update({_id: doc._id}, {$set: doc});
  },


  'getUserNameById': function (userid) {
    var rawResult = Meteor.users.findOne({_id: userid});

    if (rawResult) {
      return rawResult.profile.firstName + " " + rawResult.profile.lastName;
    }
    else {
      return "";
    }
  },

  'getUserByIdArr': function (chatIds) {
    lodash.pull(chatIds, Meteor.userId());
    return Meteor.users.findOne({_id: {$in: chatIds}});
  },

  'profile/edit': function (doc) {

    //console.log('profile/edit','only changes would be inputted',doc);
    var email = doc.email;
    doc = lodash.omit(doc, 'email')
    Meteor.call('smartix:accounts/editUser', Meteor.userId(), {
      profile: doc
    });
    /*var email = doc.email;
     doc = lodash.omit(doc, 'email');
     var _id = Meteor.userId();
     var ModifiedDoc = lodash.assign(Meteor.user().profile, doc);

     Meteor.users.update({_id: _id}, {$set: {profile: ModifiedDoc}});
     var emailarr = lodash.map(Meteor.user().emails, 'address');

     if (!lodash.includes(emailarr, email)) {
     Meteor.users.update({_id: Meteor.user()._id}, {$push: {emails: {address: email, "verified": false}}});
     }*/
    /*Meteor.users.update({_id:Meteor.userId()},{$set:{'emails.$.items.0.address':}});*/
  },
  'profileUpdateByObj': function (user) {
    var usersProfile = user.profile;
    Meteor.users.update(Meteor.userId(), {$set: {profile: usersProfile}});
  },
  'getSimilarOrganizations': function (inputOrganizationKeyword) {

    var regexp = new RegExp("^" + inputOrganizationKeyword, "i");
    var rawResultSet = Meteor.users.find({"profile.organization": {$regex: regexp}}).fetch();//OK
    //log.info(rawResultSet);
    var resultSet = lodash.map(rawResultSet, 'profile.organization');
    //log.info(resultSet);

    return resultSet;
  },
  'getSimilarCities': function (inputCityKeyword) {

    var regexp = new RegExp("^" + inputCityKeyword, "i");
    var rawResultSet = Meteor.users.find({"city": {$regex: regexp}}).fetch();//OK
    //log.info(rawResultSet);
    var resultSet = lodash.map(rawResultSet, 'city');
    //log.info(resultSet);

    return resultSet;
  },
  addCommentToClassAnnoucement: function (msgId, classObj, comment) {
    //e.g Meteor.call('addCommentToClassAnnoucement','Hv4WrMysxGfeCEDRu',{_id:'GgWku5L8D9kLXjFyR'},'hi')
    var targetClass = {
      _id: classObj._id,

      messagesObj: {
        $elemMatch: {
          msgId: msgId,
          'comment.allowComment': true
        }
      }
    };

    var commentUpdatedBy = Meteor.userId();
    var commentUpdatedAt = new Date();
    var newCommentObj = {
      _id: Random.id(),
      comment: comment,
      createdAt: commentUpdatedAt,
      createdBy: commentUpdatedBy,
      isShown: true,
      lastUpdatedBy: commentUpdatedBy,
      lastUpdatedAt: commentUpdatedAt
    };

    //push new comment and at the same time update lastUpdatedAt fields
    Smartix.Groups.Collection.update(targetClass, {
        $push: {'messagesObj.$.comment.comments': newCommentObj},
        $set: {
          'messagesObj.$.lastUpdatedAt': commentUpdatedAt,
          'messagesObj.$.lastUpdatedBy': commentUpdatedBy,
          'lastUpdatedBy': commentUpdatedBy,
          'lastUpdatedAt': commentUpdatedAt
        }
      },
      {
        validate: false
      });

    var updatedClass = Smartix.Groups.Collection.findOne(targetClass);
    Meteor.call('insertNotification', {
      eventType: "newclasscomment",
      userId: updatedClass.admins[0],
      hasRead: false,
      classid: updatedClass._id,
      classCode: updatedClass.classCode,
      commentId: newCommentObj._Id,
      messageCreateTimestamp: newCommentObj.createdAt,
      messageCreateTimestampUnixTime: moment(newCommentObj.createdAt).unix(),
      messageCreateByUserId: Meteor.userId()
    });

  },
  showHideComment: function (isShown, messageid, commentIndex) {
    var msgObj = Smartix.Messages.Collection.findOne({_id: messageid});
    var currentAddonsObjIndex = lodash.findIndex(msgObj.addons, {"type": 'comment'});
    var currentCommentObjIndex = commentIndex;

    var modifier = {$set: {}};
    modifier.$set['addons.' + currentAddonsObjIndex + '.comments.' + currentCommentObjIndex + '.isShown'] = isShown;

    Smartix.Messages.Collection.update(messageid, modifier, {validate: false});

  },

  //move this to server only !
  "Smartix.sendEmailMessageToClasses": function (targetUserids, classes, message, originateUser) {
      //if it is a solely image or voice message, exit early.
      if (message == "") {
        return;
      }

      var arrayOfTargetUsers = Meteor.users.find({_id: {$in: targetUserids}}).fetch();
      log.info("sendEmailMessageToClasses:arrayOfTargetUsers:start");
      log.info(arrayOfTargetUsers);
      log.info("sendEmailMessageToClasses:arrayOfTargetUsers:end");
      var optInUsersGroupByLang = lodash.chain(arrayOfTargetUsers)
        .filter(function (user) {
          if (user.emailNotifications) {
            if (user.emails[0].verified || user.services.google.verified_email) {
              return true;
            }
          }
          else {
            return false;
          }
        })
        .groupBy('lang')
        .value();

      //extract and join all the classes name to a single string
      var allClassNameJoined = lodash.flatten(lodash.map(classes, 'className')).join();
      log.info("sendEmailMessageToClasses:className:" + allClassNameJoined);
      for (var lang in optInUsersGroupByLang) {
        var classRecepientArr = [];
        optInUsersGroupByLang[lang].map(function (eachUser) {
          var classRoomRecepient = {
            email: eachUser.emails[0].address,
            name: eachUser.profile.firstName + " " + eachUser.profile.lastName
          };
          classRecepientArr.push(classRoomRecepient);
        });

        log.info("sendEmailMessageToClasses:classRecepientArr:lang:" + lang + ":start");
        log.info(classRecepientArr);
        log.info("sendEmailMessageToClasses:classRecepientArr:lang:" + lang + ":end");
        try {
          this.unblock();
          //send email
          Smartix.messageEmailTemplate(classRecepientArr, originateUser, message, {
            type: 'class',
            lang: lang,
            className: allClassNameJoined
          });
        }
        catch (e) {
          log.error(e);
        }
      }
  }
});


