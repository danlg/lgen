var legalLink = ReactiveVar("");

Template.About.helpers({

  getVersion: function (argument) {
    //require plugin cordova-plugin-compile-time
    //http://eclipsesource.com/blogs/2015/04/07/an-apache-cordova-hook-to-auto-bump-ios-cfbundleversion-and-android-versioncode/
    //https://gist.github.com/hstaudacher/d78b154509e2783cfcc2 - timestamp_version_bump.js
    if (Meteor.isCordova) {
      version = window.cordova.compileTime.version;
      //buildNumber = window.cordova.compileTime.buildNumber;
      //return version + " build " + buildNumber;
      return version;
    }
    //TODO fix me on web version !
    else {return (Meteor.settings && Meteor.settings.VERSION) ?  Meteor.settings.VERSION : "1.0"}

  },

  getlegal: function () {
    return legalLink.get();
    //return Meteor.call("getPpLink","en");
  }
});


Template.About.created = function () {
};


Template.About.destroyed = function () {
};

Template.ionNavBar.events({
});

Template.About.events({

});
Template.About.rendered = function () {

};


