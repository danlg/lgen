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
    user.profile.role = ""; // <---- DEPRECATED SYNTAX
  }
  else {
    // we wait for Meteor to create the user before sending an email
    Meteor.setTimeout(function () {
      Accounts.sendVerificationEmail(user._id);
    }, 2 * 1000);
  }
  return user;
});*/


Accounts.emailTemplates.sitename = "Smartix";
Accounts.emailTemplates.from = "Smartix <dan@gosmartix.com>";

Accounts.emailTemplates.verifyEmail = {
  html: function (user, url) {
    return Smartix.verificationEmailTemplate(user, url);
  },
  subject:function(user) {
    var subjectLang = user.lang || "en";
    var verifyEmailSubject = TAPi18n.__("VerifyEmailSubject", {}, lang_tag= subjectLang);
    return verifyEmailSubject;
  }
};

Accounts.emailTemplates.resetPassword ={
  html: function (user, url) {
    return Smartix.resetPasswordEmailTemplate(user, url);
  },
  subject:function(user) {
    var subjectLang = user.lang || "en";
    return TAPi18n.__("ResetPasswordEmailSubject", {}, lang_tag= subjectLang);
  }     
};

Accounts.emailTemplates.enrollAccount ={
  html: function (user, url) {
    return Smartix.enrollmentEmailTemplate(user, url);
  },
  subject:function(user) {
    var subjectLang = user.lang || "en";
    var enrollmentEmailSubject;
    //log.info("Accounts.emailTemplates.enrollAccount- User"+ user);
    //log.info(user.profile);
    if (user.profile && user.profile.firstName) {
      enrollmentEmailSubject = TAPi18n.__("Hi") + " " + user.profile.firstName + ". " + TAPi18n.__("WelcomeTo") + " " + TAPi18n.__("Smartix");
    }
    else {
      enrollmentEmailSubject = TAPi18n.__("WelcomeTo") + " " + TAPi18n.__("Smartix");
    }
    //log.info("enrollmentEmailSubject="+ enrollmentEmailSubject);
    //var enrollmentEmailSubject = TAPi18n.__("EnrollmentEmailSubject", {}, lang_tag= subjectLang);
    return enrollmentEmailSubject;
  }
};