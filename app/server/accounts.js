// first, remove configuration entry in case service is already configured
// Accounts.loginServiceConfiguration.remove({
//   service: "google"
// });
// Accounts.loginServiceConfiguration.insert({
//   service: "google",
//   clientId: "621918568251-nf0apn9k6s71808cvp7v5j1ciuluk6vr.apps.googleusercontent.com",
//   secret: "cayfgSLf0iONHPtki5E78ov2"
// });




ServiceConfiguration.configurations.remove({
   service: "google",
});
ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: "621918568251-nf0apn9k6s71808cvp7v5j1ciuluk6vr.apps.googleusercontent.com",
    secret: "cayfgSLf0iONHPtki5E78ov2"
});


Accounts.onCreateUser(function(options, user) {

  user.profile = options.profile ? options.profile : {};

  if(user.services.hasOwnProperty('google')){
    user.emails = [];
    user.emails.push({
      address:user.services.google.email
      });
    user.profile.firstname = user.services.google.given_name;
    user.profile.lastname = user.services.google.family_name;


  }else{
    // we wait for Meteor to create the user before sending an email
    Meteor.setTimeout(function() {
      Accounts.sendVerificationEmail(user._id);
    }, 2 * 1000);
  }



  return user;
});
