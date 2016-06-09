Accounts.config({
    sendVerificationEmail: true
});

Accounts.onCreateUser(function (options, user) {
    
    //log.info('onCreateUser');
    
    // Setting default values
    user.profile = options.profile || {};
    user.profile = lodash.assign({
        firstName: "",
        lastName: "",
        avatarValue: "apple",
        avatarType: "emoji"
    }, user.profile);
    user.dob = "";
    user.city = "";
    user.lang = "";
    user.tel = "";
    user.emailNotifications = false;

    user.pushNotifications = true;

    user.firstChat = true;
    user.firstInvitation = true;
    user.firstPicture = true;
    user.firstClassJoined = true;
    user.hybridAppPromote = false;
    user.hasUserSeenTour = false;
    user.referral = 0;

    //log.info("user.profile.avatarValue", user.profile.avatarValue);

    // If available, overwrite current using Google accounts details
    if (user.services.hasOwnProperty('google')) {
       
        var existingUser = Meteor.users.findOne({"emails.address":user.services.google.email});
          
        //only add email column if user does not have existing account to be merged with. Merging is handled by meteor-accounts-meld
        if(!existingUser){
            log.info('no existing account is found, try to create new user');
            user.emails = [];
            user.emails.push({
                address: user.services.google.email
            });
            user.profile.firstName = user.services.google.given_name;
            user.profile.lastName = user.services.google.family_name;
            
           //google login without exsting account, add  global namespace as user

           var rolesObj = {global:['user']};
           user.roles = rolesObj;
                  
        }else{
            if(existingUser.emails[0].verified === false){
              var updateCount = Meteor.users.update( {_id: existingUser._id},{$set:{ "emails.0.verified":true , "registered_emails.0.verified":true }} );
                              
              throw new Meteor.Error("existing-account-not-verified", 
                "Since you have an existing account. We have just updated our database to accept google login.  Please login again with google login");                
            }
        }

    }
    
    return user;
});
