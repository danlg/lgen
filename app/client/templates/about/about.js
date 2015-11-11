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
  //'click .about': function (argument) {
  //  if (Meteor.isCordova) {
  //    var pattern = /-.*/g;
  /*    navigator.globalization.getPreferredLanguage(
        function (language) {
          // alert('language: ' + language.value + '\n');
          log.info(language);
          var lang = language.value.replace(pattern, "");

          log.info(lang);
          // var html  = "http://esprit.io/legal/"+lang+".privacy.html";
          // var html = Meteor.call("getPpLink",lang);
          Meteor.call("getPpLink", lang, function (error, result) {
            if (error) {
              log.error("error", error);
            }
            else {
              switch (window.device.platform) {
                case "Android":
                  navigator.app.loadUrl(result, {openExternal: true});
                  break;
                case "iOS":
                  window.open(result, '_system');
                  break;
              }
              // return legalLink.set(result);
            }
          });
          // return html;
        },
        function () {
          alert('Error getting language\n');
        }
      );
    } else {
      log.info('you are not in phone');
    }
  }*/
});
Template.About.rendered = function () {
  //if (Meteor.isCordova) {
  //  var pattern = /-.*/g;
  /*
    navigator.globalization.getPreferredLanguage(
      function (language) {
        // alert('language: ' + language.value + '\n');
        // log.info(language);
        var lang = language.value.replace(pattern, "");
        log.info(lang);
        // var html  = "http://esprit.io/legal/"+lang+".privacy.html";
        // var html = Meteor.call("getPpLink",lang);
        Meteor.call("getPpLink", lang, function (error, result) {
          if (error) {
            log.error("error", error);
          }
          else {
            return legalLink.set(result);
          }
        });
        // return html;
      },
      function () {
        alert('Error getting language\n');
      }
    );
  }
  else {
    Meteor.call("getPpLink", "en", function (error, result) {
      if (error) {
        log.error("error", error);
      }
      else {
        return legalLink.set(result);
      }
    });
  }*/
};


