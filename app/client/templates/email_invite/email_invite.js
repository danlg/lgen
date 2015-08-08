var form;
/*****************************************************************************/
/* EmailInvite: Event Handlers */
/*****************************************************************************/
Template.EmailInvite.events({
  'click .inviteBtn':function(){
    $(form).submit();

  }

});

/*****************************************************************************/
/* EmailInvite: Helpers */
/*****************************************************************************/
Template.EmailInvite.helpers({
});

/*****************************************************************************/
/* EmailInvite: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailInvite.created = function () {
};

Template.EmailInvite.rendered = function () {
  form =  $("#inviteClassForm");
};

Template.EmailInvite.destroyed = function () {
};
