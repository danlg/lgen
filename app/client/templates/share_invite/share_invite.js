var shareLink = ReactiveVar('');
var classObj;
/*****************************************************************************/
/* ShareInvite: Event Handlers */
/*****************************************************************************/
Template.ShareInvite.events({
  'click .copyBth': function (e) {

    if (Meteor.isCordova) {
      cordova.plugins.clipboard.copy(shareLink.get());
    }else{
      var input  = document.getElementById("shareLink");
      
      e.preventDefault(); 
 
      //http://stackoverflow.com/questions/3272089/programmatically-selecting-text-in-an-input-field-on-ios-devices-mobile-safari     
      //because of mobile safari, instead of input.select() we need to run the below two lines instead
      input.focus();
      input.setSelectionRange(0, 9999);
      
      log.info("copy?");
      var isCopied = document.execCommand("copy");
      if(isCopied == false){
        //safari does not support copy & paste yet. See below for browser support.
        //https://zenorocha.github.io/clipboard.js/
        //alert("Oops. Press ⌘·C to copy") 
      }else{
        alert("Copied");
      }
      
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
    return  shareLink.get();
  }

});

/*****************************************************************************/
/* ShareInvite: Lifecycle Hooks */
/*****************************************************************************/
Template.ShareInvite.created = function () {
  var link = Meteor.settings.public.SHARE_URL;
  log.info ("Setting SHARE_URL="+link);

  classObj = Classes.findOne();
  shareLink.set (link + "/join/"+ classObj.classCode);
};

Template.ShareInvite.rendered = function () {
};

Template.ShareInvite.destroyed = function () {
};
