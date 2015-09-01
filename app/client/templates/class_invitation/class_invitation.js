
/*****************************************************************************/
/* ClassInvitation: Event Handlers */
/*****************************************************************************/
Template.ClassInvitation.events({
});

/*****************************************************************************/
/* ClassInvitation: Helpers */
/*****************************************************************************/
Template.ClassInvitation.helpers({
  'getclassCode':function (argument) {
    return Router.current().params.classCode;
  }
});

/*****************************************************************************/
/* ClassInvitation: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassInvitation.created = function () {
};

Template.ClassInvitation.rendered = function () {

};

Template.ClassInvitation.destroyed = function () {
};
