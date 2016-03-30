/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var classObj;
/*****************************************************************************/
/* ClassInvitation: Event Handlers */
/*****************************************************************************/
Template.ClassInvitation.events({});

/*****************************************************************************/
/* ClassInvitation: Helpers */
/*****************************************************************************/
Template.ClassInvitation.helpers({
  getclassCode: function (argument) {
    return Router.current().params.classCode;
  },
  getClassName: function () {
    return classObj.className;
  }
});

/*****************************************************************************/
/* ClassInvitation: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassInvitation.created = function () {
   classObj = Classes.findOne({classCode: Router.current().params.classCode});
};

Template.ClassInvitation.rendered = function () {

};

Template.ClassInvitation.destroyed = function () {
};
