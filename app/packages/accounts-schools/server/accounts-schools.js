Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.School = Smartix.Accounts.School || {};

Smartix.Accounts.School.isMember = function(currentUser, schoolId) {
    check(schoolId, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    return Roles.userIsInRole(currentUser, Smartix.Accounts.School.VALID_USER_TYPES, schoolId);
};

Smartix.Accounts.School.getAllSchoolUsers = function (namespace, currentUser) {
    
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Check if the user has permission for this school
    Smartix.Accounts.School.isAdmin(namespace, currentUser);
    
    // Get the `_id` of the school from its username
    var schoolDoc = SmartixSchoolsCol.findOne({
        _id: namespace
    });
    
    if(schoolDoc) {
        return Meteor.users.find({
            schools: schoolDoc._id
        });
    }
    return false;
};

Smartix.Accounts.School.getAllSchoolStudents = function (namespace, currentUser) {
    
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Check if the user has permission for this school
    Smartix.Accounts.School.isAdmin(namespace, currentUser);
    
    // Get the `_id` of the school from its username
    var schoolDoc = SmartixSchoolsCol.findOne({
        _id: namespace
    });
    
    var queryObj = {};
    if(schoolDoc) {
        queryObj.schools = schoolDoc._id;
        var tempRoles = "roles." + schoolDoc._id + '.0';
        queryObj[tempRoles] = 'student';
        return Meteor.users.find(queryObj);
    }
    
    return false;
};

Smartix.Accounts.School.createParentsSchema = new SimpleSchema({
    studentId: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    tel: {
        type: String,
        optional: true
    },
    type: {
        type: String
    }
});

Smartix.Accounts.School.createParentIndi = function(namespace, parentObj, currentUser, doNotifyEmail) {
    check(namespace, String);
    Smartix.Accounts.School.createParentsSchema.clean(parentObj);
    check(parentObj, Smartix.Accounts.School.createParentsSchema);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    log.info("Smartix.Accounts.School.createParentIndi- doNotifyEmail",  doNotifyEmail);
    log.info("Smartix.Accounts.School.createParentIndi- doNotifyEmail",  !!doNotifyEmail);
    let newUserObj = Smartix.Accounts.createUser(
        parentObj.email
        , {
            profile: {
                firstName: parentObj.firstName,
                lastName: parentObj.lastName
            },
            tel: parentObj.tel
        }
        , namespace
        , ['parent']
        , currentUser
        , true
        , !!doNotifyEmail
    );
    let returnObj = Smartix.Accounts.Relationships.createRelationship({
        parent: newUserObj.id,
        child: parentObj.studentId,
        namespace: namespace,
        name: parentObj.type
    }, currentUser);
};

/*
 Smartix.Accounts.School.createUser is not used
Smartix.Accounts.School.createUser = function(school, options) {
    // Check the arguments provided are of the correct type
    check(school, String);
    check(options, Object);

    // Check if the user has permission to
    // create a new user for this school
    // They must either be a school admin
    // Or system admin
    if (!Smartix.Accounts.School.isAdmin(school) && !Smartix.Accounts.System.isAdmin()) {
        log.info(NOT_AUTH);
        throw new Meteor.Error("not-auth", NOT_AUTH);
    }

    // Check if the roles indicated are valid roles
    if (!options.roles.every(function(role) {
        return Smartix.Accounts.School.VALID_USER_TYPES.indexOf(role) > -1;
    })) {
        log.info(NOT_VALID_ROLE);
        throw new Meteor.Error("not-valid-role", NOT_VALID_ROLE);
    }


    var newUserId;
    if (options.email) {

        // Check if a user with this email already exists
        var existingUser = Meteor.users.findOne({ 'emails.0.address': options.email })

        // If the user already exists
        // add the user to the role for this school
        // and return the existing user
        if (existingUser) {
            // console.log(TRY_ADD_ROLE_TO_EXISTING_USR)
            Roles.addUsersToRoles(existingUser, options.roles, school);
            return existingUser._id;
        } else {

            // If the user is new, generate a new user object
            newUserId = Accounts.createUser({
                email: options.email,
                profile: options.profile,
                username: Smartix.Accounts.helpers.generateUniqueUserName(options.profile.firstName, options.profile.lastName)
            });
        }
    } else {
        newUserId = Accounts.createUser({
            profile: options.profile,
            username: Smartix.Accounts.helpers.generateUniqueUserName(options.profile.firstName, options.profile.lastName)
        });
    }
    Roles.addUsersToRoles(newUserId, options.roles, school);
    Accounts.sendEnrollmentEmail(newUserId);
    return newUserId;
};
*/
Smartix.Accounts.School.canCreateUser = function(namespace, types, currentUser) {
    
    
    check(namespace, String);

    //only if the school has zero user, anonymous can create user account
    if( Meteor.users.find({schools:namespace}).count() == 0){
        return true;
    }
        
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Check if the type given is one of the valid types
    check(types, Match.Where(function(val) {
        if (!Array.isArray(types)) {
            return false;
        }
        _.each(val, function(type) {
            if (Smartix.Accounts.School.VALID_USER_TYPES.indexOf(val) < 0) {
                return false;
            }
        });
        return true;
    }));
    // Only admin users can create other users
    return Smartix.Accounts.School.isAdmin(namespace, currentUser);
};

Smartix.Accounts.School.canGetUserInfo = function(userId, namespace, currentUser) {

    check(userId, Match.Maybe(String));
    check(namespace, String);
    check(currentUser, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Return `true` if
    // The user info requested is by the current user
    return userId === currentUser
        // Or if the currently-logged in user is an admin for the school, and the user being requested has approved the school
        || (Smartix.Accounts.School.isAdmin(namespace, currentUser) && Smartix.Accounts.School.userHasApproved(namespace, userId))
        // Or if your are the system administrator  
        || Smartix.Accounts.System.isAdmin(currentUser);
};

Smartix.Accounts.School.canRemoveUser = function(userId, namespace, currentUser) {

    check(userId, Match.Maybe(String));
    check(namespace, String);
    check(currentUser, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

    // Return `true` if
    // The user info requested is by the current user
    return userId === currentUser
        // Or if the currently-logged in user is an admin for the school
        || Smartix.Accounts.School.isAdmin(namespace, currentUser)
        // Or if your are the system administrator  
        || Smartix.Accounts.System.isAdmin(currentUser);
};

Smartix.Accounts.School.isAdmin = function(namespace, currentUser) {

    check(namespace, String);
    check(currentUser, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

    // Return `true` if the user is system administrator
    return Smartix.Accounts.System.isAdmin(currentUser)
        // Or has the role of `admin` for the namespace
        || (Roles.userIsInRole(currentUser, 'admin', namespace)
            // AND they've approved the school in the form of adding it to the `school` array in their user document
            && Smartix.Accounts.School.userHasApproved(namespace, currentUser))
};

Smartix.Accounts.School.canImportStudents = Smartix.Accounts.School.canImportTeachers = Smartix.Accounts.School.canImportParents = function(namespace, currentUser) {
    
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

    // Only admin users can import users
    return Smartix.Accounts.School.isAdmin(namespace, currentUser);
};

Smartix.Accounts.School.isTeacher = function(namespace, currentUser) {

    check(namespace, String);
    check(currentUser, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

    // Return `true` if user has the role of `teacher` for the namespace
    return Roles.userIsInRole(currentUser, Smartix.Accounts.School.TEACHER , namespace)
            // AND they've approved the school in the form of adding it to the `school` array in their user document
            && Smartix.Accounts.School.userHasApproved(namespace, currentUser)
};

Smartix.Accounts.School.userHasApproved = function(namespace, userId) {

    check(namespace, String);
    check(userId, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    userId = userId || Meteor.userId();

    var userDoc = Meteor.users.findOne({
        _id: userId
    });

    // If the current user does not exists
    if (!userDoc) {
        return false;
        // OPTIONAL: Throw error indicating user does not exist
        // Or is not logged on
    }

    if (!userDoc.schools) {
        return false;
    }

    return userDoc.schools.indexOf(namespace) > -1
};

Smartix.Accounts.School.canGetBasicInfoOfAllUsers = function(namespace, currentUser) {
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    // Only school administrators and teachers can get basic info of all users in the namespace
    return Smartix.Accounts.School.isTeacher(namespace, currentUser)
        || Smartix.Accounts.School.isAdmin(namespace, currentUser);
};

Smartix.Accounts.School.canGetAllUsers = function(namespace, currentUser) {
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    // Only school administrators and teachers can get basic info of all users in the namespace
    return Smartix.Accounts.School.isTeacher(namespace, currentUser)
        || Smartix.Accounts.School.isAdmin(namespace, currentUser);
};

Smartix.Accounts.School.getNamespaceFromSchoolName = function(schoolName) {
    check(schoolName, String);
    // Get the `_id` of the school from its username
    var schoolDoc = SmartixSchoolsCol.findOne({
        username: schoolName
    });
    return schoolDoc ? schoolDoc._id : false;
};

Smartix.Accounts.School.revokeSchool = function(school,users){
    if(!Smartix.Accounts.School.isAdmin(school)
        && !Smartix.Accounts.System.isAdmin()){
        return;
    }
    
    Roles.removeUsersFromRoles(users,['admin','teacher','parent','student'],school);
    
    return Meteor.users.update({
        _id: {$in : users}
    },{
        $pull: {
            schools: school
        },
        
    },{
        multi: true  
    });    
}

Smartix.Accounts.School.deleteSchoolUsers = function(userIds,namespace,currentUser){

    check(userIds, [String]);
    check(namespace, String);
    check(currentUser, String);
        

    userIds.map(function(userId){
        // Retrieve the target user
        var targetUser = Meteor.users.findOne({ _id: userId });
        if(targetUser){
            //if user only belong to current school, deletes the user from users collection
            if(targetUser.schools.length === 1){
                if(targetUser.schools[0] === namespace){
                      log.info('deleteSchoolUsers:delete User:',userId);
                      Smartix.Accounts.deleteSchoolUser(userId); 
                }
            }else{
            //else, removes only the schools array of the user           
                log.info('deleteSchoolUsers:revoke User:',userId);
                Smartix.Accounts.School.revokeSchool(namespace,[userId]);
            }
        }        
    });

}