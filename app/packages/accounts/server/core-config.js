Accounts.config({
    sendVerificationEmail: true
});

Accounts.onCreateUser(function (options, user) {
    
    // Setting default values
    user.profile = options.profile || {};
    user.profile = lodash.assign({
        firstName: "",
        lastName: ""
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
    
    // If available, overwrite current using Google accounts details
    if (user.services.hasOwnProperty('google')) {
        user.emails = [];
        user.emails.push({
            address: user.services.google.email
        });
        user.profile.firstName = user.services.google.given_name;
        user.profile.lastName = user.services.google.family_name;
    }
    
    return user;
});
