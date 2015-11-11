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
    return Classes.findOne();
  },
  teacher: function () {
    return Meteor.users.findOne({_id: {$nin: [Meteor.userId()]}});
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
