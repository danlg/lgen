/*****************************************************************************/
/* TabClasses: Event Handlers */
/*****************************************************************************/
Template.TabClasses.events({});

/*****************************************************************************/
/* TabClasses: Helpers */
/*****************************************************************************/
Template.TabClasses.helpers({
  notCreateEmptyList: function () {
    return Classes.find({createBy: Meteor.userId()}).fetch().length > 0
  },
  notJoinedEmptyList: function () {
    return Classes.find({joinedUserId: {$in: [Meteor.userId()]}}).fetch().length > 0
  },
  joinedClass: function () {
    return Classes.find({joinedUserId: {$in: [Meteor.userId()]}});
  },
  createdClass: function () {
    return Classes.find({createBy: Meteor.userId()});
  },
  isTeacher: function () {
    return Meteor.user().profile.role === "Teacher";
  }


});

/*****************************************************************************/
/* TabClasses: Lifecycle Hooks */
/*****************************************************************************/
Template.TabClasses.created = function () {
};

Template.TabClasses.rendered = function () {


};

Template.TabClasses.destroyed = function () {
};
