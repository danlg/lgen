/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */



//clientId: "122417300165-4i555ct1kvrf8fesec9bp1f9vprdrlef.apps.googleusercontent.com",
//secret: "jyI4QhG3lz2J_fXxSk1QXxJG"

//log.info('loginServicesConfigured with ClientID=' + Meteor.settings.GOOGLE_CLIENT_ID);
//var loginServicesConfigured = Accounts.loginServicesConfigured();
//log.info('loginServicesConfigured =' + loginServicesConfigured);

/*Accounts.onCreateUser(function (options, user) {
  // analytics.track("Sign Up", {
  //   date: new Date(),
  // });
  user.profile = options.profile ? options.profile : {};
  user.profile = lodash.assign(Schema.profile, user.profile);

  if (user.services.hasOwnProperty('google')) {
    user.emails = [];
    user.emails.push({
      address: user.services.google.email
    });
    user.profile.firstName = user.services.google.given_name;
    user.profile.lastName = user.services.google.family_name;
    
    //explicitiy set that when account is login by google oauth, role is empty
    user.profile.role = "";
  }
  else {
    // we wait for Meteor to create the user before sending an email
    Meteor.setTimeout(function () {
      Accounts.sendVerificationEmail(user._id);
    }, 2 * 1000);
  }
  return user;
});*/




Accounts.emailTemplates.verifyEmail= {
  html: function (user, url) {
    log.info(user.profile.role);
    var role = user.profile.role;
    return Smartix.verificationEmailTemplate(role,user,url);
  }

  , siteName: function () {
    return "Smartix";
  }

  , from:function() {
    return "Smartix <contactemail@littlegenius.io>";
  }

  , subject:function(user) {
    var subjectLang = user.lang || "en";
    var verifyEmailSubject = TAPi18n.__("VerifyEmailSubject", {}, lang_tag= subjectLang);
    return verifyEmailSubject;
  }
};

Accounts.emailTemplates.resetPassword ={
  html: function (user, url) {
    log.info(user.profile.role);
    var role = user.profile.role;
    
    return Smartix.resetPasswordEmailTemplate(role,user,url);
  }

  , siteName: function () {
    return "Smartix";
  }

  , from:function() {
    return "Smartix <contactemail@littlegenius.io>";
  }

  , subject:function(user) {
    var subjectLang = user.lang || "en";
    
    var resetPasswordEmailSubject = TAPi18n.__("ResetPasswordEmailSubject", {}, lang_tag= subjectLang);
    return resetPasswordEmailSubject;
  }     
};