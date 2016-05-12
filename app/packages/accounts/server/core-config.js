Accounts.config({
    sendVerificationEmail: true
});

Accounts.onCreateUser(function (options, user) {
    
    // Setting default values
    user.profile = options.profile || {};
    user.profile = lodash.assign({
        firstName: "",
        lastName: "",
        avatarValue: "apple"
    }, user.profile);
    user.dob = "";
    user.city = "";
    user.lang = "";
    user.tel = "";
    user.emailNotifications = false;

    user.pushNotifications = false;

    user.firstChat = true;
    user.firstInvitation = true;
    user.firstPicture = true;
    user.firstClassJoined = true;
    user.hybridAppPromote = false;
    user.hasUserSeenTour = false;
    user.referral = 0;

    //console.log("user.profile.avatarValue", user.profile.avatarValue);

    // If available, overwrite current using Google accounts details
    if (user.services.hasOwnProperty('google')) {
        var existingUser = Meteor.users.findOne({"email":user.services.google.email});
        //only add email column if user does not have existing account to be merged with. Merging is handled by meteor-accounts-meld
        if(!existingUser){
            
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
                throw new Meteor.Error("existing-account-not-verified", 
                "You have an account that is not verified. You must verify it before you can use google login");                
            }
        }

    }
    
    return user;
});
