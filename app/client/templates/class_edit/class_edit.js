/*var isValid = ReactiveVar(false);*/
/*****************************************************************************/
/* ClassEdit: Event Handlers */
/*****************************************************************************/
Template.ClassEdit.events({
  'click .removeAllUserBtn': function () {

    Meteor.call("class/deleteUser", Classes.findOne(), function () {
      alert("success removed!");
    });
  },
  'click .removeClass': function () {
    Meteor.call("class/delete", Classes.findOne(), function () {
      Router.go('TabClasses');
    });
  }
});

/*****************************************************************************/
/* ClassEdit: Helpers */
/*****************************************************************************/
Template.ClassEdit.helpers({
  classObj: function () {
    return Classes.findOne({classCode: Router.current().params.classCode});
  },
  classId: function () {
    return Classes.findOne()._id;
  },
});

/*****************************************************************************/
/* ClassEdit: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassEdit.created = function () {
};

Template.ClassEdit.rendered = function () {
};

Template.ClassEdit.destroyed = function () {
};

Template.ionNavBar.events({
  'click .saveClassBtn': function () {
    AutoForm.submitFormById("#updateClass");
  }
});
