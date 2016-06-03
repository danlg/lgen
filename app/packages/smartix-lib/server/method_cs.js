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
    //console.log('profile/edit doc:',doc);
    var ModifiedDoc = lodash.merge(Meteor.user(), doc);
    //console.log('profile/edit ModifiedDoc:',ModifiedDoc); 
    Meteor.call('smartix:accounts/editUser', Meteor.userId(), ModifiedDoc);
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
  'pushNotificationToggle': function (toggle) {
    Meteor.users.update(Meteor.userId(), {$set: {pushNotifications: toggle}});
  },
  'emailNotificationToggle': function (toggle) {
    Meteor.users.update(Meteor.userId(), {$set: {emailNotifications: toggle}});
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
});


