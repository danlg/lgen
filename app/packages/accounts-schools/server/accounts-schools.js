Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.School = Smartix.Accounts.School || {};

Smartix.Accounts.School.VALID_USER_TYPES = ['student', 'parent', 'teacher', 'admin'];

Smartix.Accounts.School.isMember = function(userId, schoolId) {
    check(userId, String);
    check(schoolId, String);
    
    userId = userId || Meteor.userId();
    
    return Roles.userIsInRole(userId, Smartix.Accounts.School.VALID_USER_TYPES, schoolId);
}

Smartix.Accounts.School.createUser = function (school, options) {
    // Check the arguments provided are of the correct type
    check(school, String);
    check(options, Object);
    
    // Check if the user has permission to
    // create a new user for this school
    // They must either be a school admin
    // Or system admin
    if (!Smartix.Accounts.School.isAdmin(school) && !Smartix.Accounts.System.isAdmin()){
        console.log(NOT_AUTH);
        throw new Meteor.Error("not-auth", NOT_AUTH);
    }
    
    // Check if the roles indicated are valid roles
    if (!options.roles.every(function (role) {
        return Smartix.Accounts.School.VALID_USER_TYPES.indexOf(role) > -1;
    })) {
        console.log(NOT_VALID_ROLE);
        throw new Meteor.Error("not-valid-role", NOT_VALID_ROLE);
    }
    
    
    var newUserId;
    if (options.email) {
        
        // Check if a user with this email already exists
        var existingUser = Meteor.users.findOne({'emails.0.address':options.email})
        
        // If the user already exists
        // add the user to the role for this school
        // and return the existing user
        if (existingUser) {
            // console.log(TRY_ADD_ROLE_TO_EXISTING_USR)
            Roles.addUsersToRoles(existingUser, options.roles, school);
            return existingUser._id;
        } else {
            
            // If the user is new, generate a new user object
            newUserId =  Accounts.createUser({
                email: options.email,
                profile: options.profile,
                username: Smartix.Accounts.helpers.generateUniqueUserName(options.profile.firstName, options.profile.lastName)
            });                                        
        }
    } else {
        newUserId =  Accounts.createUser({
            profile: options.profile,
            username: Smartix.Accounts.helpers.generateUniqueUserName(options.profile.firstName, options.profile.lastName)
        }); 
    }
    
    Roles.addUsersToRoles(newUserId, options.roles, school);
    
    Accounts.sendEnrollmentEmail(newUserId);
    
    return newUserId;
}

Smartix.Accounts.School.canCreateUser = function (namespace, types, currentUser) {
    // Check if the type given is one of the valid types
    check(types, Match.Where(function (val) {
        if(!Array.isArray(types)) {
            return false;
        }
        _.each(val, function (type) {
            if (Smartix.Accounts.School.VALID_USER_TYPES.indexOf(val) < 0) {
                return false;
            }
        });
        return true;
    }));
    
    // Only admin users can create other users
    return Smartix.Accounts.School.isAdmin (namespace, currentUser);
}

Smartix.Accounts.School.canGetUserInfo = function (userId, namespace, currentUser) {
    
    check(userId, String);
    check(namespace, String);    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    currentUser = currentUser || Meteor.userId();
    
    // Return `true` if
    // The user info requested is by the current user
    return userId === currentUser
    // Or if the currently-logged in user is an admin for the school, and the user being requested has approved the school
      || (Smartix.Accounts.School.isAdmin(namespace, currentUser) && Smartix.Accounts.School.userHasApproved(namespace, userId))
    // Or if your are the system administrator  
      || Smartix.Accounts.System.isAdmin(currentUser);
}

Smartix.Accounts.School.canRemoveUser = function (userId, namespace, currentUser) {
    
    check(userId, String);
    check(namespace, String);    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    currentUser = currentUser || Meteor.userId();
    
    // Return `true` if
    // The user info requested is by the current user
    return userId === currentUser
    // Or if the currently-logged in user is an admin for the school
      || Smartix.Accounts.School.isAdmin(namespace, currentUser)
    // Or if your are the system administrator  
      || Smartix.Accounts.System.isAdmin(currentUser);
}

Smartix.Accounts.School.isAdmin = function (namespace, currentUser) {
    
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    currentUser = currentUser || Meteor.userId();
    
    // Return `true` if the user is system administrator
    return Smartix.Accounts.System.isAdmin(currentUser) 
    // Or has the role of `admin` for the namespace
        || (Roles.userIsInRole(currentUser, 'admin', namespace)
            // AND they've approved the school in the form of adding it to the `school` array in their user document
            && Smartix.Accounts.School.userHasApproved(namespace, currentUser))
}

Smartix.Accounts.School.isTeacher = function (namespace, currentUser) {
    
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    currentUser = currentUser || Meteor.userId();
    
    // Return `true` if user has the role of `teacher` for the namespace
    return Roles.userIsInRole(currentUser, 'teacher', namespace)
            // AND they've approved the school in the form of adding it to the `school` array in their user document
            && Smartix.Accounts.School.userHasApproved(namespace, currentUser)
}

Smartix.Accounts.School.userHasApproved = function (namespace, userId) {
    
    check(namespace, String);
    check(userId, String);
    
    // Get the `_id` of the currently-logged in user
    userId = userId || Meteor.userId();
    
    var userDoc = Meteor.users.findOne({
        _id: userId
    });
    
    // If the current user does not exists
    if(!userDoc) {
        return false;
        // OPTIONAL: Throw error indicating user does not exist
        // Or is not logged on
    }
    
    if(!userDoc.schools) {
        return false;
    }
    
    return userDoc.schools.indexOf(namespace) > -1
}

Smartix.Accounts.School.canGetBasicInfoOfAllUsers = function (namespace, currentUser) {
    
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    currentUser = currentUser || Meteor.userId();
    
    // Only school administrators and teachers can get basic info of all users in the namespace
    return Smartix.Accounts.School.isTeacher(namespace, currentUser)
        || Smartix.Accounts.School.isAdmin(namespace, currentUser);
}

Smartix.Accounts.School.canGetAllUsers = function (namespace, currentUser) {
    
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    currentUser = currentUser || Meteor.userId();
    
    // Only school administrators and teachers can get basic info of all users in the namespace
    return Smartix.Accounts.School.isTeacher(namespace, currentUser)
        || Smartix.Accounts.School.isAdmin(namespace, currentUser);
}

hasPermission = Smartix.Accounts.School.canGetUserInfo = function (userId, namespace, currentUser) {
    
    check(userId, String);
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    currentUser = currentUser || Meteor.userId();
    
    // Only school administrators and teachers can get basic info of all users in the namespace
    return Smartix.Accounts.School.isTeacher(namespace, currentUser)
        || Smartix.Accounts.School.isAdmin(namespace, currentUser)
        || userId === currentUser;
}

Smartix.Accounts.School.getNamespaceFromSchoolName = function (schoolName) {
    
    check(schoolName, String);
    
    // Get the `_id` of the school from its username
    var schoolDoc = SmartixSchoolsCol.findOne({
        username: schoolName
    });
    return schoolDoc ? schoolDoc._id : false;
}