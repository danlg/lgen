Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.Global = Smartix.Accounts.Global || {};
Smartix.Accounts.Global.VALID_USER_TYPES = ['user'];

Smartix.Accounts.Global.canCreateUser = function (types, currentUser) {
    // Check if the type given is one of the valid types
    check(types, Match.Where(function (val) {
        if(!Array.isArray(types)) {
            return false;
        }
        _.each(val, function (type) {
            if (Smartix.Accounts.Global.VALID_USER_TYPES.indexOf(val) < 0) {
                return false;
            }
        });
        return true;
    }));
    
    // Anyone can create a global account through signing up
    return true;
}

Smartix.Accounts.Global.canRemoveUser = function (userId, currentUser) {
    // No one can create a new user except the user him/herself
    // OR the system administrator
    return userId === currentUser
       || Smartix.Accounts.System.isAdmin(currentUser);
}

Smartix.Accounts.Global.canGetUserInfo = function (userId, currentUser) {
    
    check(userId, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Return `true` if
    // The user info requested is by the current user
    return userId === currentUser
    
    // Or if the user is the system administrator
    || Smartix.Accounts.System.isAdmin(currentUser)
    
    // Or if the currently-logged in user is an admin for global,
    // and the user being requested has approved the school
      || (Smartix.Accounts.Global.isAdmin(currentUser) && Smartix.Accounts.Global.userHasApproved(userId));
}

Smartix.Accounts.Global.isAdmin = function (currentUser) {
    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Return `true` if the user is the system administrator
    return Smartix.Accounts.System.isAdmin(currentUser)
        // Or has the role of `admin` for the 'global'
        || (Roles.userIsInRole(currentUser, 'admin', 'global')
        // AND they've approved *global* in the form of adding it to the `school` array in their user document
        && Smartix.Accounts.Global.userHasApproved(currentUser))
}

Smartix.Accounts.Global.userHasApproved = function (userId) {
    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    var userDoc = Meteor.users.findOne({
        _id: currentUser
    });
    
    // If the current user does not exists
    if(!userDoc) {
        return false;
        // OPTIONAL: Throw error indicating user does not exist
        // Or is not logged on
    }
    
    return userDoc.schools.indexOf('global') > -1
}

Smartix.Accounts.Global.canGetBasicInfoOfAllUsers = function (currentUser) {
    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Only system admins can get the list of ALL users in the system namespace
    return Smartix.Accounts.System.isAdmin(currentUser);
}

Smartix.Accounts.Global.canGetAllUsers = function (currentUser) {
    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Only system admins can get the list of ALL users in the system namespace
    return Smartix.Accounts.System.isAdmin(currentUser);
}