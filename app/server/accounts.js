


//clientId: "122417300165-4i555ct1kvrf8fesec9bp1f9vprdrlef.apps.googleusercontent.com",
//secret: "jyI4QhG3lz2J_fXxSk1QXxJG"

//log.info('loginServicesConfigured with ClientID=' + Meteor.settings.GOOGLE_CLIENT_ID);
//var loginServicesConfigured = Accounts.loginServicesConfigured();
//log.info('loginServicesConfigured =' + loginServicesConfigured);

Accounts.onCreateUser(function (options, user) {
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
    user.profile.firstname = user.services.google.given_name;
    user.profile.lastname = user.services.google.family_name;
  }
  else {
    // we wait for Meteor to create the user before sending an email
    Meteor.setTimeout(function () {
      Accounts.sendVerificationEmail(user._id);
    }, 2 * 1000);
  }
  return user;
});
