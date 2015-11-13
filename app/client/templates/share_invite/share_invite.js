var shareLink = ReactiveVar('');
var classObj;
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

  getclassCode: function (argument) {
    return Router.current().params.classCode;
  },
  getShareLink: function () {
    var share = shareLink.get() + "/join/"+ classObj.classCode;
    return share;
  }

});

/*****************************************************************************/
/* ShareInvite: Lifecycle Hooks */
/*****************************************************************************/
Template.ShareInvite.created = function () {
  var link = Meteor.settings.public.SHARE_URL;
  log.info ("Setting SHARE_URL="+link);
  shareLink.set (link);
  classObj = Classes.findOne();
};

Template.ShareInvite.rendered = function () {
};

Template.ShareInvite.destroyed = function () {
};
