/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
// server code
/*Mandrill.config({
 username: Meteor.settings.MANDRILL_API_USER,  // the email address you log into Mandrill with. Only used to set MAIL_URL.
 key: Meteor.settings.MANDRILL_API_KEY,  // get your Mandrill key from https://mandrillapp.com/settings/index
 port: 587,  // defaults to 465 for SMTP over TLS
 // host: 'smtp.mandrillapp.com',  // the SMTP host
 // baseUrl: 'https://mandrillapp.com/api/1.0/'  // update this in case Mandrill changes its API endpoint URL or version
 });*/

//Mandrill.config({
//  username: Meteor.settings.MANDRILL_USERNAME,   // the email address you l""og into Mandrill with. Only used to set MAIL_URL.
//  key: Meteor.settings.MANDRILL_KEY,   // the email address you l""og into Mandrill with. Only used to set MAIL_URL.
//  port: Meteor.settings.MANDRILL_PORT  // defaults to 465 for SMTP over TLS
//  // host: 'smtp.mandrillapp.com',  // the SMTP host
//  // baseUrl: 'https://mandrillapp.com/api/1.0/'  // update this in case Mandrill changes its API endpoint URL or version
//});




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
    return "Smartix <contactemail@gosmartix.com>";
  }

  , subject:function(user) {
    var subjectLang = user.profile.lang || "en";
    var verifyEmailSubject = TAPi18n.__("VerifyEmailSubject", {}, lang_tag= subjectLang);
    return verifyEmailSubject;
  }
};
