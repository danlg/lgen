var shareLink = ReactiveVar('');
/*****************************************************************************/
/* ShareInvite: Event Handlers */
/*****************************************************************************/
Template.ShareInvite.events({
  'click .copyBth': function () {

    if (Meteor.isCordova) {
      cordova.plugins.clipboard.copy(shareLink.get());
    }
  },
  'click .shareBtn': function (argument) {
    if (Meteor.isCordova) {
      // testShareSheet();
      var link = shareLink.get();
      window.plugins.socialsharing.share(link);
    }
  }
});

/*****************************************************************************/
/* ShareInvite: Helpers */
/*****************************************************************************/
Template.ShareInvite.helpers({
  'classCode': function (argument) {
    return Router.current().params.classCode;
  },
  'getShareLink': function () {
    return shareLink.get();
  }

});

/*****************************************************************************/
/* ShareInvite: Lifecycle Hooks */
/*****************************************************************************/
Template.ShareInvite.created = function () {
  Meteor.call("getShareLink", Router.current().params.classCode, function (error, result) {
    if (error) {
      log.error("error", error);
    }
    if (result) {
      shareLink.set(result);
    }
  });

};

Template.ShareInvite.rendered = function () {
};

Template.ShareInvite.destroyed = function () {
};
