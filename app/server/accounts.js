// first, remove configuration entry in case service is already configured
// Accounts.loginServiceConfiguration.remove({
//   service: "google"
// });
// Accounts.loginServiceConfiguration.insert({
//   service: "google",
//   clientId: "621918568251-nf0apn9k6s71808cvp7v5j1ciuluk6vr.apps.googleusercontent.com",
//   secret: "cayfgSLf0iONHPtki5E78ov2"
// });

Accounts.config({
   loginExpirationInDays: null
});


ServiceConfiguration.configurations.remove({
   service: "google",
});
ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: "621918568251-nf0apn9k6s71808cvp7v5j1ciuluk6vr.apps.googleusercontent.com",
    secret: "qZ5NcbllTG4Hy_gkGiZ9mKkT"
});

// Accounts.onLogin(function (argument) {
//
//
//
//
//
//
//   Meteor.call("raix:push-setuser", token , function(error, result){
//     if(error){
//       console.log("error", error);
//     }
//     if(result){
//        console.log("updateGcm");
//     }
//   });
// });


Accounts.onCreateUser(function(options, user) {

  user.profile = options.profile ? options.profile : {};

  if(user.services.hasOwnProperty('google')){
    user.emails = [];
    user.emails.push({
      address:user.services.google.email
      });
    user.profile.firstname = user.services.google.given_name;
    user.profile.lastname = user.services.google.family_name;
    user.profile.role = "";


  }else{
    // we wait for Meteor to create the user before sending an email
    Meteor.setTimeout(function() {
      Accounts.sendVerificationEmail(user._id);
    }, 2 * 1000);

    /*switch(_.pick(options,role)){
      case "Teacher":
        Roles.addUsersToRoles(user._id, 'Teacher');
      break;
      case "Student":
        Roles.addUsersToRoles(user._id, 'Student');
      break;
      case "Parent":
        Roles.addUsersToRoles(user._id, 'Parent');
      break;
    }*/

    

  }



  return user;
});
