/*****************************************************************************/
/* UserDetail: Event Handlers */
/*****************************************************************************/
Template.UserDetail.events({
  'click .talkToBtn': function (e) {
    var targetIds = [Router.current().params._id];
      Meteor.call('chatCreate', targetIds, function (err, data) {
      Router.go('ChatRoom', {chatRoomId: data});
    });
  }
});

/*****************************************************************************/
/* UserDetail: Helpers */
/*****************************************************************************/
Template.UserDetail.helpers({
  userPofile: function () {
    return Meteor.users.findOne({_id: Router.current().params._id});
  },
  hisJoinedClasses: Classes.find(),
  userId: function (argument) {
    return Router.current().params._id;
  },
  isStudentHigherThirteen: function () {
    var user = Meteor.users.findOne({_id: Router.current().params._id});
    var age = moment(lodash.get(user, 'profile.dob')) || moment();
    var now = moment();
    return now.diff(age, 'years') > 12;
  },
  canChat: function () {
    var user = Meteor.users.findOne({_id: Router.current().params._id});

    if (user.profile.role !== "Student") {
      return true;
    }

    var age = moment(lodash.get(user, 'profile.dob')) || moment();
    var now = moment();
    var isHigherThan13 = now.diff(age, 'years') > 12;


    var higherThirteenClass;
    if (Router.current().params.classCode) {
      var classObj = Classes.findOne({classCode: Router.current().params.classCode});
      higherThirteenClass = classObj.higherThirteen;
    } else {
      higherThirteenClass = true;
    }

    if (isHigherThan13) {
      return true;
    }

    if (!higherThirteenClass) {
      return true;
    }

    if (higherThirteenClass && isHigherThan13) {
      return true;
    } else if (!isHigherThan13 && !higherThirteenClass) {
      return true;
    }
    return false;
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
    var flag = lodash.get(user, 'profile.email') || false;
    return flag ?  "checked" : "";
  },

  canPush: function (argument) {
    var user = Meteor.users.findOne({_id: Router.current().params._id});
    var flag =  lodash.get(user, 'profile.push') || false;
    return flag ?  "checked" : "";
  }
  //,
  //checked: function (type) {
  //  return lodash.get(Meteor.user(), 'profile.' + type) ? "checked" : "";
  //}

});

/*****************************************************************************/
/* UserDetail: Lifecycle Hooks */
/*****************************************************************************/
Template.UserDetail.created = function () {
};

Template.UserDetail.rendered = function () {
};

Template.UserDetail.destroyed = function () {
};
