Match.Maybe = Match.Maybe || Match.Optional;

Smartix = Smartix || {};

Smartix.Accounts = Smartix.Accounts || {};

Smartix.Accounts.DeleteUsersCol = new Mongo.Collection('smartix:accounts/deletedUsers');

Smartix.Accounts.listUserSchools = function () {
    var userToBeChecked = user || Meteor.userId();
    return Roles.getGroupsForUser(userToBeChecked);
};

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
    password: { type: String, optional: true },
    studentId: { type: String, optional: true },
    grade: { type: String, optional: true },
    classroom: { type: String, optional: true },
    gender: { type: String, optional: true },
    salutation: { type: String, optional: true },
    mobile: { type: String, optional: true },
    employer: { type: String, optional: true },
    nationality: { type: String, optional: true },
    language: { type: String, optional: true },
    homeAddress1: { type: String, optional: true },
    homeAddress2: { type: String, optional: true },
    homeCity: { type: String, optional: true },
    homeState: { type: String, optional: true },
    homePostalCode: { type: String, optional: true },
    homeCountry: { type: String, optional: true },
    homePhone: { type: String, optional: true },
    workAddress1: { type: String, optional: true },
    workAddress2: { type: String, optional: true },
    workCity: { type: String, optional: true },
    workState: { type: String, optional: true },
    workPostalCode: { type: String, optional: true },
    workCountry: { type: String, optional: true },
    workPhone: { type: String, optional: true }
}]);

/**
 * Creates a Smartix User
 * @param email
 * @param userObj
 * @param namespace
 * @param roles
 * @param currentUser
 * @param autoEmailVerified
 * @param doNotifyEmail
 * @returns {[string, boolean] [0] the newuserid, true is newly created and false if updated.}
 */
Smartix.Accounts.createUser = function (email, userObj, namespace, roles, currentUser, autoEmailVerified, doNotifyEmail) {
    // Check that the options provided are valid
    Smartix.Accounts.createUserOptionsSchema.clean(userObj);
    check(userObj, Smartix.Accounts.createUserOptionsSchema);
    // Check that the arguments are of the correct type
    check(email, Match.Maybe(Match.Where(function (val) {
        check(val, String);
        return SimpleSchema.RegEx.Email.test(val);
    })));
    check(namespace, String);
    check(roles, [String]);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) { currentUser = currentUser || Meteor.userId(); }
    // Pass the permission checks to the corresponding child package
    //
    Smartix.Accounts.checkPermission(roles, currentUser,namespace, Smartix.Accounts.School.canCreateUser, "create");

    var newUserId;
    // Checks if user already exists
    if(typeof email === "string" && Accounts.findUserByEmail(email) !== undefined) {
        // Set `` to the `_id` of the existing user
        newUserId = Accounts.findUserByEmail(email)._id;
        log.warn("Adding role(s) " + roles + " to existing user "+ email  + " with id " + newUserId);
        // Add the role to the user
        Roles.addUsersToRoles(newUserId, roles, namespace);
        // If the user is a student, create a distribution list based on the student's class
        Smartix.Accounts.createOrAddToDistributionList(newUserId, namespace, userObj.classroom, currentUser);
        Meteor.users.update({ _id: newUserId}, {$set: userObj });
        //if (userObj.dob) { Meteor.users.update({_id: newUserId}, {$set: {"dob": userObj.dob} } ); }
        return [ newUserId, false ];
    }
    else {
        // Otherwise, if the user does not already exists, create a new user
        newUserId = Smartix.Accounts.createUserImpl(userObj, email, namespace);
        //splendido:accounts-meld to merge account
        //that user logins by google oauth but already have existing acc with password login`
        //https://github.com/danlg/lgen/issues/291
        var registered_emails = [];
        registered_emails.push({address: email, verified: true});

        var tempPassword = userObj.password; delete userObj.password;//Do not store password in clear in database
        Smartix.Accounts.setPassword(newUserId, tempPassword);// Set the password if provided

        Meteor.users.update({ _id: newUserId}, {$set: userObj });
        Meteor.users.update({ _id: newUserId},  {$set: {registered_emails: registered_emails} } );

        Smartix.Accounts.notifyByEmail(email, newUserId, tempPassword, autoEmailVerified, doNotifyEmail);
        //Smartix.Accounts.sendEnrollmentEmail  (email, newUserId, doNotifyEmail);
        // Add the role to the user
        Roles.addUsersToRoles(newUserId, roles, namespace);
        // If the user is a student, create a distribution list based on the student's class
        Smartix.Accounts.createOrAddToDistributionList(newUserId, namespace, userObj.classroom, currentUser);
        return [newUserId, true ];
    }
};
/**
 * Use to check permissinon create or delete
 * @param roles
 * @param currentUser
 * @param namespace
 * @param functioncheck
 * @param name for error logging purpose "create", "delete", "update"
 * @returns {boolean}
 */
Smartix.Accounts.checkPermission =function(roles, currentUser, namespace, functioncheck, name)  {
    var hasPermission = false;
    switch(namespace) {
        case 'system':
            // Check permissions on `smartix:accounts-system`
            hasPermission = functioncheck(roles, currentUser);
            break;
        case 'global':
            // Check permission on `smartix:accounts-global`
            // everyone can create a new account in global namespace
            hasPermission = true;
            break;
        default:
            // Pass checking permissions to `smartix:accounts-school`
            hasPermission = functioncheck(namespace, roles, currentUser);
    }
    if(!hasPermission) {
        // return false;
        // Throw error indicating user does not have permission
        throw new Meteor.Error("permission-denied", "The user does not have permission to " + name +" a user in the namespace " + namespace + ".");
    }
    return true;
};
/**
 * @param userObj
 * @param email
 * @param namespace
 * @returns the createdUserId
 */
Smartix.Accounts.createUserImpl = function (userObj, email, namespace) {
    var newUserOptions = {};
    if ( userObj.username ) { newUserOptions.username = userObj.username; }
    if (!userObj.username && userObj.profile && userObj.profile.firstName && userObj.profile.lastName) {
        newUserOptions.username = Smartix.Accounts.helpers.generateUniqueUserName(userObj.profile.firstName, userObj.profile.lastName);
    }
    if ( ! ( userObj.username || userObj.profile || userObj.profile.firstName || userObj.profile.lastName) ) {
        log.warn("No username nor first name nor last name for user");
    }
    if (userObj.profile) {
        if (userObj.profile.firstName) {
            newUserOptions.profile = newUserOptions.profile || {};
            newUserOptions.profile.firstName = userObj.profile.firstName;
        }
        if (userObj.profile.lastName) {
            newUserOptions.profile = newUserOptions.profile || {};
            newUserOptions.profile.lastName = userObj.profile.lastName;
        }
    }
    if (typeof email === "string") {
        newUserOptions.email = email;
    }
    //log.info("About to create user "+ newUserOptions.email + " " + newUserOptions.username + " for school "+newUserOptions.schools);
    var newUserId;
    try {
        newUserId = Accounts.createUser(newUserOptions);
        log.info('Created successfully newUserId: ', newUserId);
        Meteor.users.update({_id: newUserId}, { $addToSet: {schools: {$each: [namespace] } } });
    }
    catch (e) {
        log.error("Couldn't create user", e);
    }
    return newUserId;
};

Smartix.Accounts.setPassword = function ( newUserId, tmpPassword) {
    if (tmpPassword && tmpPassword !== "") {
        log.info("Setting password for user ",newUserId);
        Accounts.setPassword(newUserId, tmpPassword, {logout: false});
    }
};

/**
 * Verification is actually a notification.
 * @param email
 * @param newUserId
 * @param tmpPassword
 * @param autoEmailVerified
 * @param doNotifyEmail
 */
Smartix.Accounts.notifyByEmail = function (email, newUserId, tmpPassword, autoEmailVerified, doNotifyEmail) {
    if ( email ) {
        if ( autoEmailVerified ) {
            var newlyCreatedUser = Meteor.users.findOne(newUserId);
            if (newlyCreatedUser.emails) {
                log.info("Autoverifying email " + email);
                Meteor.users.update( { _id: newUserId},  {$set: { "emails.0.verified": true} } );
            }
            else {
                log.warn("Cannot autoverify email set up for ", newUserId, newlyCreatedUser.profile.firstName, " ", newlyCreatedUser.profile.lastName);
            }
        }
        if (doNotifyEmail) {
            try {
                //it is a prerequisite to have no verified email adress before sending verification
                if ( Meteor.users.findOne( { _id: newUserId, "emails.0.verified":false} ) ) {
                    log.info("Sending verification email to ", email);
                    //For now we do not send the password as it is autologin
                    //In the future, we should send the password as well with autogin email.send
                    // see http://stackoverflow.com/questions/15684634/how-to-generate-new-meteor-login-tokens-server-side-in-order-to-make-a-quick-l
                    // or https://github.com/DispatchMe/meteor-login-token
                    Accounts.sendVerificationEmail(newUserId);
                }
                else log.info("No need to send verification email", email);
            } catch (e) {
                log.error("Cannot send verification email to ", email, e);
            }
        }
    }
    else {
       log.warn("Cannot do notify email " + email) ;
    }
};

/**
 * Reset password
 * @param email
 * @param newUserId
 * @param doNotifyEmail
 */
Smartix.Accounts.sendEnrollmentEmail = function (email, newUserId, doNotifyEmail) {
    if ( email ) {
        if (doNotifyEmail) {
            try {
                log.info("Sending enrollment email to ", email);
                Accounts.sendEnrollmentEmail(newUserId);
            } catch (e) {
                log.error("Cannot send enrollment email to ", email, e);
            }
        }
    }
    else {
        log.warn("Cannot send enrollment email " + email) ;
    }
};

Smartix.Accounts.createOrAddToDistributionList = function (roles, namespace, classroom, currentUser) {
    if(classroom) {
        Smartix.DistributionLists.createDistributionList({
            users: [roles],
            namespace: namespace,
            name: classroom,
            expectDuplicates: true,
            upsert: true
        }, currentUser);
    }
};

Smartix.Accounts.removeUser = function (userId, namespace, currentUser) {
    check(userId, Match.Maybe(String));
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Retrieve the target user
    var targetUser = Meteor.users.findOne( {_id: userId });
    var hasPermission = false;
    //TODO user new function checkPermission to factor the code
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
    Roles.removeUsersFromRoles(userId, ['user',
            Smartix.Accounts.School.ADMIN,
            Smartix.Accounts.School.STUDENT,
            Smartix.Accounts.School.PARENT,
            Smartix.Accounts.School.TEACHER
        ], namespace);
    return true;
};

Smartix.Accounts.editUserSchema = Smartix.Accounts.Schema.pick([
    'username',
    'profile.firstName',
    'profile.lastName',
    'dob',
    'city',
    'lang',
    'tel',
    'profile.avatarValue'
]);

Smartix.Accounts.editUser = function (userId, options, currentUser) {
    log.info('Smartix.Accounts.editUser',options);
    if (Smartix.Accounts.canEditUser(userId, options, currentUser)) {
        log.info('Smartix.Accounts.editUser:canEditUser',options);
        return Meteor.users.update({
            _id: userId
        }, {
            $set: options
        })
    }
    return false;
};

Smartix.Accounts.canEditUser = function (userId, options, currentUser) {
    
    check(userId, Match.Maybe(String));
    
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
};

Smartix.Accounts.deleteUser = function (userId, currentUser) {
    if (Smartix.Accounts.canDeleteUser(userId, currentUser)) {
        // Make a copy of the user into a new collection
        // This ensures all records are kept
        // But the user would still be able to create a new account using the same email
        var userToBeDeleted = Meteor.users.findOne({_id: userId });
        userToBeDeleted.deletedAt = Date.now();
        Smartix.Accounts.DeleteUsersCol.insert(userToBeDeleted, function (err, id) {
            // Remove the user from the `Meteor.users` collection
            Meteor.users.remove({ _id: userId });
        });        
    }
};

Smartix.Accounts.canDeleteUser = function (userId, currentUser) {
    check(userId, Match.Maybe(String));
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    // If the user is the only system administrator, you cannot delete
    return (Smartix.Accounts.System.isAdmin(currentUser) && Roles.getUsersInRole('admin', 'system').count() > 0)
        // the user themselves
        || userId === currentUser;
};

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
        var tempRoles = "roles." + namespace ;
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
    
    check(dob, Match.OneOf(String, Date));
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    if(currentUser) {
        
        if(typeof dob === "string") {
            dob = moment(dob, ["DD-MM-YYYY", "MM-DD-YYYY", "DD/MM/YYYY", "MM/DD/YYYY"]).format("DD-MM-YYYY");
        } else if(dob instanceof Date) {
            dob = moment(dob).format("DD-MM-YYYY");
        } else {
            return false;
        }
        
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