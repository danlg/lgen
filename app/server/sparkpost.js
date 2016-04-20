'use strict';

var key = Meteor.settings.SPARKPOST_KEY
  , SparkPost = Meteor.npmRequire('sparkpost')
  , client = new SparkPost(key);

Accounts.emailTemplates.testMail= {
  html: function () {
    log.info("Sending Test Mail");
    return testMail();
  }
};

Accounts.emailTemplates.verifyEmail= {
  html: function (user, url) {
    log.info(user.profile.role);
    var role = user.profile.role;
    return verificationEmailTemplate(role,user,url);
  }

 , siteName: function () {
    return "Smartix";
  }

  , from:function() {
    return "Smartix <contactemail@littlegenius.io>";
  }

  , subject:function(user) {
    var subjectLang = user.profile.lang || "en";
    var verifyEmailSubject = TAPi18n.__("VerifyEmailSubject", {}, lang_tag= subjectLang);
    return verifyEmailSubject;
  }
};
