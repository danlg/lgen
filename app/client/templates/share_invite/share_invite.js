
/*****************************************************************************/
/* ShareInvite: Event Handlers */
/*****************************************************************************/
Template.ShareInvite.events({
  'click .copyBth':function(){

    if (Meteor.isCordova) {
      cordova.plugins.clipboard.copy(Router.current().params.classCode);
    }
  },
  'click .shareBtn':function (argument) {
    if (Meteor.isCordova) {
      // testShareSheet();
      var link = "https://gen.me/join/"+Router.current().params.classCode;
      window.plugins.socialsharing.share(link);
    }
  }
});

/*****************************************************************************/
/* ShareInvite: Helpers */
/*****************************************************************************/
Template.ShareInvite.helpers({
  'classCode':function (argument) {
    return Router.current().params.classCode;
  }
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

// share
// function testShareSheet() {
//   var options = {
//     'androidTheme' : window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT,
//     'title': 'What do you want with this image?',
//     'buttonLabels': ['Share via Facebook', 'Share via Twitter'],
//     'androidEnableCancelButton' : true,
//     'winphoneEnableCancelButton' : true,
//     'addCancelButtonWithLabel': 'Cancel',
//     'addDestructiveButtonWithLabel' : 'Delete it',
//     'position': [20, 40] // for iPad pass in the [x, y] position of the popover
//   };
//
//   // Depending on the buttonIndex, you can now call f.i. shareViaFacebook or shareViaTwitter
//   // of the SocialSharing plugin (http://plugins.telerik.com/plugin/socialsharing)
//   window.plugins.actionsheet.show(options, callback);
// };
//
// function callback(argument) {
//   alert("callback");
// }
