/*****************************************************************************/
/* TabClasses: Event Handlers */
/*****************************************************************************/

function createdClassImpl() {
  return Classes.find({createBy: Meteor.userId()});
}

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

  isTeacher: function () {
    return Meteor.user().profile.role === "Teacher";
  },

  createdClass: createdClassImpl,

  classavatar_icon: function() {
    var ava =  (this.classavatar) ? true : false;
    if (ava) {
      return "e1a-" + this.classavatar;
    }
    else{ //default
      return "e1a-green_apple";
    }
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
