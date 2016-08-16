/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Template.UserDetail.onCreated( function() {
  let classCode = Router.current().params.classCode;
  let classId = Router.current().params.classId;
  let _id = Router.current().params._id;
  log.info("Template.UserDetail.onCreated.classCode", classCode);
  log.info("Template.UserDetail.onCreated.classId", classId);
  log.info("Template.UserDetail.onCreated._id", _id);
  if (classCode) {
      Meteor.subscribe('smartix:classes/classByClassCode', classCode);
  }
  if (classId) {
      Meteor.subscribe('getCommentsByClassIdNId', classId, _id);
  }
  Meteor.subscribe('getUserById', _id);
  Meteor.subscribe('getJoinedClassByUserId', _id);
});

Template.UserDetail.onRendered( function() {
});

Template.UserDetail.destroyed = function () {
};

Template.UserDetail.events({
  'click .talkToBtn': function (e) {
    let targetIds = [Router.current().params._id];
    // let schoolId = UI._globalHelpers['getCurrentSchoolId']();
    let schoolName = UI._globalHelpers['getCurrentSchoolName']();
    // log.info("schoolId",schoolId);
    //log.info("targetIds", targetIds);

    //log.info("pickedSchoolId", Session.get('pickedSchoolId'));
    Meteor.call('chatCreate', targetIds, undefined, schoolName,
        function (err, roomId) {
          log.info("talkToBtn", roomId);
          Router.go('ChatRoom', {chatRoomId: roomId});
        }
    );
  }
});

Template.UserDetail.helpers({
  userProfile: function () {
    //log.info("userProfile", Router.current().params._id);
    let find = Meteor.users.findOne({_id: Router.current().params._id});
    //log.info("userProfile.find", find);
    return find;
  },

  hisJoinedClasses: Smartix.Groups.Collection.find({
      type: 'class'
  }),

  userId: function (argument) {
    return Router.current().params._id;
  },

  isStudentHigherThirteen: function () {
    var user = Meteor.users.findOne({_id: Router.current().params._id});
    var age = moment(lodash.get(user, 'dob')) || moment();
    var now = moment();
    return now.diff(age, 'years') > 12;
  },
  canChat: function () {
    //TODO refine the logic
    return true;
    // var user = Meteor.users.findOne({_id: Router.current().params._id});
    // // TODO: If user is admin or teacher, return `true` immediately
    // var age = moment(lodash.get(user, 'dob')) || moment();
    // var now = moment();
    // var isHigherThan13 = now.diff(age, 'years') > 12;
    // var ageRestrictedClass;
    // if (Router.current().params.classCode) {
    //   var classObj = Smartix.Groups.Collection.findOne({
    //       type: 'class',
    //       classCode: Router.current().params.classCode
    //     });
    //   ageRestrictedClass = classObj.ageRestricted;
    // }
    // else {
    //   ageRestrictedClass = true;
    // }
    // if (isHigherThan13) {
    //   return true;
    // }
    // if (!ageRestrictedClass) {
    //   return true;
    // }
    //
    // if (ageRestrictedClass && isHigherThan13) {
    //   return true;
    // } else if (!isHigherThan13 && !ageRestrictedClass) {
    //   return true;
    // }
    // return false;
  },
  classCode: function (argument) {
    return Router.current().params.classCode || "";
  },
  getnote: function (argument) {
    return lodash.get(Commend.findOne({
        userId: Router.current().params._id,
        classId: Router.current().params.classId
      }), 'comment') || TAPi18n.__("No_private_note_yet");
  },
  classId: function (argument) {
    return Router.current().params.classId || "";
  },

  canEmail: function (argument) {
    var user = Meteor.users.findOne({_id: Router.current().params._id});
    var flag = lodash.get(user, 'emailNotifications') || false;
    return flag ?  "checked" : "";
  },

  canPush: function (argument) {
    var user = Meteor.users.findOne({_id: Router.current().params._id});
    var flag =  lodash.get(user, 'pushNotifications') || false;
    return flag ?  "checked" : "";
  }
  //,
  //checked: function (type) {
  //  return lodash.get(Meteor.user(), 'profile.' + type) ? "checked" : "";
  //}

});


