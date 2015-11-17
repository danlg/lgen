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
      var userAgent = window.navigator.userAgent;
      var input  = document.getElementById("shareLink");
      
      e.preventDefault(); 
 
      //http://stackoverflow.com/questions/3272089/programmatically-selecting-text-in-an-input-field-on-ios-devices-mobile-safari     
      //because of mobile safari, instead of input.select() we need to run the below two lines instead
      input.focus();
      input.setSelectionRange(0, 9999);
      
      log.info("copy?");
      var isCopied = document.execCommand("copy");
      if(isCopied == false){
 
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
          // iPad or iPhone's mobile safari
          // do nothing
        }else if( userAgent.match(/Safari/i) && userAgent.match(/Macintosh/i)){
         //safari  does not support copy & paste yet. See below for browser support.
         //https://zenorocha.github.io/clipboard.js/        
          IonPopup.alert({
            title: 'Oops',
            template: 'Press ⌘·C to copy',
            okText: 'Got It.'
          });           
        }
        else {
         //any other browsers that does not support copy & paste yet.
          IonPopup.alert({
            title: 'Oops',
            template: 'Long press on the link to copy or Press Crtl·C to copy',
            okText: 'Got It.'
          }); 
        }             
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
