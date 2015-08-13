
/*****************************************************************************/
/* EmailInvite: Event Handlers */
/*****************************************************************************/
Template.EmailInvite.events({
  'click .inviteBtn':function(){

    AutoForm.submitFormById("#inviteClassForm")
  }

});

/*****************************************************************************/
/* EmailInvite: Helpers */
/*****************************************************************************/
Template.EmailInvite.helpers({
  inviteClassSchema:Schema.inviteClass
});

/*****************************************************************************/
/* EmailInvite: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailInvite.created = function () {
};

Template.EmailInvite.rendered = function () {
};

Template.EmailInvite.destroyed = function () {
};
