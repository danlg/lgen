Match.Maybe = Match.Maybe || Match.Optional;

Smartix = Smartix || {};

Smartix.Accounts = Smartix.Accounts || {};

Smartix.Accounts.DeleteUsersCol = new Mongo.Collection('smartix:accounts/deletedUsers');

Smartix.Accounts.listUserSchools = function () {
    var userToBeChecked = user || Meteor.userId();
    return Roles.getGroupsForUser(userToBeChecked);
}

Smartix.Accounts.createUserOptionsSchema = new SimpleSchema([Smartix.Accounts.Schema.pick([
    'username',
    'dob',
    'city',
    'lang',
    'tel'
]), {
    profile: {
        type: Object,
        blackbox: true
    },
    password: {
        type: String,
        optional: true
    }
}]);

Smartix.Accounts.createUser = function (email, options, namespace, types, currentUser) {
    
    // Check that the options provided are valid
    Smartix.Accounts.createUserOptionsSchema.clean(options);
    check(options, Smartix.Accounts.createUserOptionsSchema);
    
    // Check that the arguments are of the correct type
    check(email, Match.Where(function (val) {
        check(val, String);
        return SimpleSchema.RegEx.Email.test(val);
    }));
    
    check(namespace, String);
    check(types, [String]);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    var hasPermission = false;
    
    // Pass the permission checks to the corresponding child package
    switch(namespace) {
        case 'system':
            // Check permissions on `smartix:accounts-system`
            hasPermission = Smartix.Accounts.System.canCreateUser(types, currentUser);
            break;
        case 'global':
            // Check permission on `smartix:accounts-global`
            hasPermission = Smartix.Accounts.Global.canCreateUser(types, currentUser);
            break;
        default:
            // Pass checking permissions to `smartix:accounts-school`
            hasPermission = Smartix.Accounts.School.canCreateUser(namespace, types, currentUser);
    }
    
    if(!hasPermission) {
        return false;
        // OPTIONAL: Throw error indicating user does not have permission
    }
    
    var userToAddRoleTo;
    
    // Checks if user already exists
    if (Accounts.findUserByEmail(email) === undefined) {
        // If the user does not already exists, create a new user
        var newUserOptions = {};
        if (options.username) {
            newUserOptions.username = options.username;
        }
        if(!options.username && options.profile && options.profile.firstName && options.profile.lastName) {
            newUserOptions.username = Smartix.Accounts.helpers.generateUniqueUserName(options.profile.firstName, options.profile.lastName);
        }
        if (options.profile) {
            if (options.profile.firstName) {
                newUserOptions.profile = newUserOptions.profile || {};
                newUserOptions.profile.firstName = options.profile.firstName;
            }
            if (options.profile.lastName) {
                newUserOptions.profile = newUserOptions.profile || {};
                newUserOptions.profile.lastName = options.profile.lastName;
            }
        }
        newUserOptions.email = email;
        var newUserId = Accounts.createUser(newUserOptions);
        
        var newUserUpdateObj = {};
        
        if (options.dob) {
            newUserOptions.dob = options.dob;
        }
        if (options.city) {
            newUserOptions.city = options.city;
        }
        if (options.lang) {
            newUserOptions.lang = options.lang;
        }
        if (options.tel) {
            newUserOptions.tel = options.tel;
        }
        
        newUserOptions.schools = [namespace];
        
        Meteor.users.update({
            _id: newUserId
        }, {
            $set: newUserOptions
        });
        
        try {
            Accounts.sendEnrollmentEmail(newUserId);
        } catch(e) {
            console.log(e);
            // Temporary (to be removed once email credentials go into production)
            Accounts.setPassword(newUserId, 'password', {logout: false});
        }
        userToAddRoleTo = newUserId;
    } else {
        // Otherwise, set `userToAddRoleTo` to the `_id` of the existing user
        userToAddRoleTo = Accounts.findUserByEmail(email)._id;
    }
    
    // Add the role to the user
    Roles.addUsersToRoles(userToAddRoleTo, types, namespace);
    
    return true;

}

Smartix.Accounts.removeUser = function (userId, namespace, currentUser) {
    check(userId, String);
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Retrieve the target user
    var targetUser = Meteor.users.findOne({
        _id: userId
    });
    
    var hasPermission = false;
    
    // Pass the permission checks to the corresponding child package
    switch(namespace) {
        case 'system':
            // Check permissions on `smartix:accounts-system`
            hasPermission = Smartix.Accounts.System.canRemoveUser(userId, currentUser);
            break;
        case 'global':
            // Check permission on `smartix:accounts-global`
            hasPermission = Smartix.Accounts.Global.canRemoveUser(userId, currentUser);
            break;
        default:
            // Pass checking permissions to `smartix:accounts-school`
            hasPermission = Smartix.Accounts.School.canRemoveUser(userId, namespace, currentUser);
    }
    
    if(!hasPermission) {
        return false;
        // OPTIONAL: Throw error indicating user does not have permission
    }
    
    // Remove the school/global/system namespace from `roles` and the `schools` array
    Roles.removeUsersFromRoles(userId, ['user', 'admin', 'student', 'parent', 'teacher'], namespace);
    
    return true;
}

Smartix.Accounts.editUserSchema = Smartix.Accounts.Schema.pick([
    'username',
    'profile.firstName',
    'profile.lastName',
    'dob',
    'city',
    'lang',
    'tel'
]);

Smartix.Accounts.editUser = function (userId, options, currentUser) {
    if (Smartix.Accounts.canEditUser(userId, options, currentUser)) {
        return Meteor.users.update({
            _id: userId
        }, {
            $set: options
        })
    }
    return false;
}

Smartix.Accounts.canEditUser = function (userId, options, currentUser) {
    
    check(userId, String);
    
    // Allow only users to change certain fields (e.g. users cannot change their role)
    Smartix.Accounts.editUserSchema.clean(options);
    check(options, Smartix.Accounts.editUserSchema);
    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // If the user exists
    return !!currentUser
        // AND if the user is the only system administrator, you cannot delete
        && (Smartix.Accounts.System.isAdmin(currentUser)
        // OR is the user themselves
        || userId === currentUser);
}

Smartix.Accounts.deleteUser = function (userId, currentUser) {
    if (Smartix.Accounts.canDeleteUser(userId, currentUser)) {
        // Make a copy of the user into a new collection
        // This ensures all records are kept
        // But the user would still be able to create a new account using the same email
        
        var userToBeDeleted = Meteor.users.findOne({
            _id: userId
        });
        
        userToBeDeleted.deletedAt = Date.now();
        
        Smartix.Accounts.DeleteUsersCol.insert(userToBeDeleted, function (err, id) {
            // Remove the user from the `Meteor.users` collection
            Meteor.users.remove({
                _id: userId
            });
        });        
    }
}

Smartix.Accounts.canDeleteUser = function (userId, currentUser) {
    
    check(userId, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // If the user is the only system administrator, you cannot delete
    return (Smartix.Accounts.System.isAdmin(currentUser) && Roles.getUsersInRole('admin', 'system').count() > 0)
        // the user themselves
        || userId === currentUser;
}

Smartix.Accounts.getUserInfo = function (id, namespace, currentUser) {
    
    // Check that the arguments are of the correct type
    check(id, String);
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Retrieve the target user
    var targetUser = Meteor.users.findOne({
        _id: id
    });
    
    var hasPermission = false;
    
    // Pass the permission checks to the corresponding child package
    switch(namespace) {
        case 'system':
            // Check permissions on `smartix:accounts-system`
            hasPermission = Smartix.Accounts.System.canGetUserInfo(id, currentUser);
            break;
        case 'global':
            // Check permission on `smartix:accounts-global`
            hasPermission = Smartix.Accounts.Global.canGetUserInfo(id, currentUser);
            break;
        default:
            // Pass checking permissions to `smartix:accounts-school`
            hasPermission = Smartix.Accounts.School.canGetUserInfo(id, namespace, currentUser);
    }
    
    if(!hasPermission) {
        return false;
        // OPTIONAL: Throw error indicating user does not have permission
    }
    
    return targetUser;
}

Smartix.Accounts.getAllUsersInNamespace = function (namespace, currentUser) {
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    var hasPermission;
    
    // Pass the permission checks to the corresponding child package
    switch(namespace) {
        case 'system':
            // Check permissions on `smartix:accounts-system`
            hasPermission = Smartix.Accounts.System.canGetAllUsers(currentUser);
            break;
        case 'global':
            // Check permission on `smartix:accounts-global`
            hasPermission = Smartix.Accounts.Global.canGetAllUsers(currentUser);
            break;
        default:
            // Pass checking permissions to `smartix:accounts-school`
            hasPermission = Smartix.Accounts.School.canGetAllUsers(namespace, currentUser);
    }
    
    if(hasPermission) {
        var meteorQuery = {};
        
        meteorQuery.schools = namespace;
        var tempRoles = "roles." + namespace + '.0';
        meteorQuery[tempRoles] = {
            $exists: true
        }
        return Meteor.users.find(meteorQuery);
        
        // return Roles.getUsersInRole(['user', 'admin', 'student', 'teacher', 'parent'], namespace);
    } else {
        return false;
    }
}

Smartix.Accounts.updateDob = function (dob, currentUser) {
    
    check(dob, Date);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    if(currentUser) {
        return Meteor.users.update({
            _id: currentUser
        }, {
            $set: {
                dob: dob
            }
        })
    } else {
        return false;
    }
}