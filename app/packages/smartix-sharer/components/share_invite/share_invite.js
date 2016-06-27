/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var shareLink = ReactiveVar('');
var classObj;

/* ShareInvite: Event Handlers */
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
            template: TAPi18n.__("PressCtrlCToCopyMac"),
            okText: TAPi18n.__("OKayGotIt")
          });           
        }
        else {
         //any other browsers that does not support copy & paste yet. Android browser is not working
          IonPopup.alert({
            title: 'Oops',
            template: TAPi18n.__("PressCtrlCorLongPressToCopy"),
            okText: TAPi18n.__("OKayGotIt")
          }); 
        }             
      }else{
         toastr.success("Copied!");
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

/* ShareInvite: Helpers */
Template.ShareInvite.helpers({
  getclassCode: function (argument) {
    return Router.current().params.classCode;
  },
  getShareLink: function () {
    return  shareLink.get();
  }
});

/* ShareInvite: Lifecycle Hooks */
Template.ShareInvite.onCreated( function() {
  var link = Meteor.settings.public.SHARE_URL;
  log.info ("Setting SHARE_URL="+link);

  classObj = Smartix.Groups.Collection.findOne({
      type: 'class',
      classCode: Router.current().params.classCode
    });
  shareLink.set (link + "/join/"+ classObj.classCode);
});

Template.ShareInvite.onRendered( function() {
});

Template.ShareInvite.destroyed = function () {
};
