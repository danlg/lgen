/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var legalLink = ReactiveVar("");

Template.About.helpers({

  getVersion: function (argument) {
    //require plugin cordova-plugin-compile-time
    //http://eclipsesource.com/blogs/2015/04/07/an-apache-cordova-hook-to-auto-bump-ios-cfbundleversion-and-android-versioncode/
    //https://gist.github.com/hstaudacher/d78b154509e2783cfcc2 - timestamp_version_bump.js
    var version = "1.2.2 build 292";
    return version;
    // if (Meteor.isCordova) {
    //   //version = window.cordova.compileTime.version; //now broken with carmel branch
    //   return version;
    // }
    // //TODO fix me on web version !
    // else {
    //   //let txt = Assets.getText("../../mobile-config.js");
    //   //log.info(txt);
    //   return (Meteor.settings && Meteor.settings.VERSION) ?  Meteor.settings.VERSION : version;
    // }
  },

  getlegal: function () {
    return legalLink.get();
    //return Meteor.call("getPpLink","en");
  }
});


Template.About.onCreated( function() {
});

Template.About.destroyed = function () {
};

Template.ionNavBar.events({
});

Template.About.events({

});
Template.About.onRendered( function() {

});


