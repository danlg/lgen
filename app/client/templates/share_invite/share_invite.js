
/*****************************************************************************/
/* ShareInvite: Event Handlers */
/*****************************************************************************/
Template.ShareInvite.events({
  'click .copyBth':function(){

    if (Meteor.isCordova) {
      cordova.plugins.clipboard.copy(Router.current().params.classCode);
    }
  }
});

/*****************************************************************************/
/* ShareInvite: Helpers */
/*****************************************************************************/
Template.ShareInvite.helpers({
});

/*****************************************************************************/
/* ShareInvite: Lifecycle Hooks */
/*****************************************************************************/
Template.ShareInvite.created = function () {
};

Template.ShareInvite.rendered = function () {
};

Template.ShareInvite.destroyed = function () {
};
