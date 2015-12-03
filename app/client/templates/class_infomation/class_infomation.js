/*****************************************************************************/
/* ClassInformation: Event Handlers */
/*****************************************************************************/
Template.ClassInformation.events({
  'click .unsub': function () {
    Meteor.call('class/leaveByCode', Router.current().params.classCode, function () {
      Router.go('TabClasses')
    })
  }
});

/*****************************************************************************/
/* ClassInformation: Helpers */
/*****************************************************************************/
Template.ClassInformation.helpers({
  classObj: function () {
    return Classes.findOne({classCode: Router.current().params.classCode});
  },
  teacher: function () {
    var teacherUserid = Classes.findOne({classCode: Router.current().params.classCode}).createBy;
    return Meteor.users.findOne(teacherUserid);
  }
});

/*****************************************************************************/
/* ClassInformation: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassInformation.created = function () {
};

Template.ClassInformation.rendered = function () {


};

Template.ClassInformation.destroyed = function () {
};
