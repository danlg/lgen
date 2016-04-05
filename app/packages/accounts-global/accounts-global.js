if(Meteor.isServer){


   
Schema = Schema || {};
Schema.profile = {
  firstname: "",
  lastname: "",
  dob: "",
  city: "",
  lang: "",
  email: false, //default as false so user needs to opt it to receive email message notificaiton
  push: true,
  firstchat: true,
  firstinvitation: true,
  firstpicture: true,
  firstclassjoined: true,
  hybridapppromote:false,
  hasUserSeenTour:false,
  referral: 0
};

Accounts.onCreateUser(function (options, user) {
  // analytics.track("Sign Up", {
  //   date: new Date(),
  // });
  user.profile = options.profile || {};
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


    Meteor.methods({
       'smartix:accounts-global/createGlobalUser':function(options){
           
           
            var id =  Accounts.createUser({
                email: options.email,
                password: options.password,
                profile: options.profile,
                username: Smartix.Accounts.helpers.generateUniqueUserName(options.profile.firstname,options.profile.lastname)
            });
            
            Roles.addUsersToRoles(id,['user'],'global');
          
       },
       'smartix:accounts-global/updateGlobalUser':function(user,options){
           
           //var updateOptions = {};
           //updateOptions.firstName = options.firstName;
           
           if(Meteor.userId() == user ||
              Roles.userIsInRole(Meteor.userId(),'admin','system') ||
              Roles.userIsInRole(Meteor.userId(),'admin','global')
             )
           {
              //if it is normal user, cannot change self's role 
              if(!Roles.userIsInRole(Meteor.userId(),'admin','system') && !Roles.userIsInRole(Meteor.userId(),'admin','global')){
                 delete options.roles;
              }
              //console.log(options.doc);
              
              //`lodash.merge` would do a recursive operations to update the fields passed from `options`.
              var ModifiedDoc = lodash.merge(Meteor.users.findOne(user), options);              
              //console.log(ModifiedDoc);
              Meteor.users.update({_id: user},  ModifiedDoc  );
       
           }           
       },      
       'smartix:accounts-global/hardDeleteGlobalUser':function(user){
           if(Meteor.userId() == user ||
              Roles.userIsInRole(Meteor.userId(),'admin','system') ||
              Roles.userIsInRole(Meteor.userId(),'admin','global')
             ){
              Meteor.users.remove(user);
           }
       },       
       'smartix:accounts-global/deleteGlobalUser':function(user){
           if(Meteor.userId() == user ||
              Roles.userIsInRole(Meteor.userId(),'admin','system') ||
              Roles.userIsInRole(Meteor.userId(),'admin','global')
             ){
              
              //Perform `update` operation using `alanning:roles`,
              //removing the appropriate object from the `roles` array
              Roles.removeUsersFromRoles(user,['user'],'global')
              
              //Soft-delete user
              Meteor.users.update({_id: user},  {$set: {softDelete : true}}  );
               
            }
       },        
    });
}

//console.log('ac-global','is Smartix exist?',Smartix || {});
Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.registerOrLoginWithGoogle  = function(){
        Meteor.loginWithGoogle(
        {
            forceApprovalPrompt: true,
            requestPermissions: ['email'],
            loginStyle: 'popup',
            requestOfflineToken: true
        }
        ,function (err) { // <-- the callback would NOT be called. It only works if loginStyle is popup
                            //see https://github.com/meteor/meteor/blob/devel/packages/accounts-oauth/oauth_client.js Line 16

            var loginServicesConfigured = Accounts.loginServicesConfigured();
            console.log('loginServicesConfigured='+loginServicesConfigured);
            if (err) {
            // set a session variable to display later if there is a login error
            Session.set('loginError', 'reason: ' + err.reason + ' message: ' + err.message || 'Unknown error');
            //alert(err.message + ":" + err.reason);
            toastr.error('Sorry. Google Login is not available at the moment because it is unable to connect to the Internet.')
            console.log('login:google:'+ err.reason +" msg="+ err.message);
            }
            else {
            console.log("login:google:" + Meteor.userId());
            if (Meteor.user().profile.role !== ""){
                console.log("user has role");
                Smartix.helpers.routeToTabClasses();
            }
            else{
                //first time user
                console.log("user does not have role");
                Router.go('role');
            }
            }
        });   
    };