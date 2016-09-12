Match.Maybe = Match.Maybe || Match.Optional;

Smartix = Smartix || {};

Smartix.Accounts = Smartix.Accounts || {};

Smartix.Accounts.DeleteUsersCol = new Mongo.Collection('smartix:accounts/deletedUsers');

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
 * Use to check permissinon
 * @param namespace
 * @param roles
 * @param currentUser
 * @returns {boolean}
 */
Smartix.Accounts.canCreateUser = function(namespace, roles, currentUser) {
    return Smartix.Accounts.School.canCreateUser(namespace, roles, currentUser);
};

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
Smartix.Accounts.createUser = function(email, userObj, namespace, roles, currentUser, autoEmailVerified, doNotifyEmail) {
    
    // Converts an empty email to undefined
    email = email === "" ? undefined : email;
    
    // Check that the options provided are valid
    Smartix.Accounts.createUserOptionsSchema.clean(userObj);
    check(userObj, Smartix.Accounts.createUserOptionsSchema);

    // Check that the arguments are of the correct type
    check(email, Match.Maybe(Match.Where(function(val) {
        check(val, String);
        return SimpleSchema.RegEx.Email.test(val);
    })));
    check(namespace, String);
    check(roles, [String]);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) { currentUser = currentUser || Meteor.userId(); }
    // Pass the permission checks to the corresponding child package

    if (!Smartix.Accounts.canCreateUser(namespace, roles, currentUser)) {
        // Throw error indicating user does not have permission
        throw new Meteor.Error("permission-denied", "The user does not have permission to create a user in the namespace " + namespace + ".");
    }

    var newUserId;
    
    //log.info('check if user already exists');
    // Checks if user already exists
    if (typeof email === "string" && Accounts.findUserByEmail(email) !== undefined) {
        // Set `newUserId` to the `_id` of the existing user
        newUserId = Accounts.findUserByEmail(email)._id;
        log.warn("Adding role(s) " + roles + " to existing user " + email + " with id " + newUserId);
        // Add the role to the user
        Roles.addUsersToRoles(newUserId, roles, namespace);
        // If the user is a student, create a distribution list based on the student's class
        Smartix.Accounts.createOrAddToDistributionList(newUserId, namespace, userObj.classroom, currentUser);
        // Add the namespace to the user
        Meteor.users.update({ _id: newUserId }, { $addToSet: { schools: namespace } });
        //if (userObj.dob) { Meteor.users.update({_id: newUserId}, {$set: {"dob": userObj.dob} } ); }
        return {
            id: newUserId,
            isNew: false
        }
    }
    else {
        //log.info('try create new user',userObj,email,namespace);
        // Otherwise, if the user does not already exists, create a new user
        newUserId = Smartix.Accounts.createUserImpl(userObj, email, namespace);
        //splendido:accounts-meld to merge account
        //that user logins by google oauth but already have existing acc with password login`
        //https://github.com/danlg/lgen/issues/291
        var registered_emails = [];
        registered_emails.push({ address: email, verified: true });

        var tempPassword = userObj.password; delete userObj.password;//Do not store password in clear in database
        Smartix.Accounts.setPassword(newUserId, tempPassword);// Set the password if provided
        
        var newlyCreatedUserObj = Meteor.users.findOne(newUserId);
        //log.info('source user obj',userObj);            
        // log.info('newly created user obj',newlyCreatedUserObj);        
        //lodash.assign copy missing values from userObj to newlyCreatedUserObj, while existing value (e.g avatarValue which is added during onCreateUser) in newlyCreatedUserObj is kept
        lodash.merge(newlyCreatedUserObj,userObj);
        //log.info('merged user obj',newlyCreatedUserObj);
        Meteor.users.update({ _id: newUserId }, { $set: newlyCreatedUserObj });
        Meteor.users.update({ _id: newUserId }, { $set: { registered_emails: registered_emails } });
        //if user does not have password, send enrollment email to user to setup initial password
        if(!tempPassword){
            if( Smartix.Lib.Server.IsGoogleAccount(email) )
            {
                Smartix.Accounts.notifyByEmail(email, newUserId, autoEmailVerified, !!doNotifyEmail);
            }
            else
            {
                Smartix.Accounts.sendEnrollmentEmail(email, newUserId, !!doNotifyEmail);
            }
        }
        else{
            //If password exists send email with login details. 
            Smartix.Accounts.notifyByEmail(email, newUserId, autoEmailVerified, !!doNotifyEmail);
        }
        // Add the role to the user
        Roles.addUsersToRoles(newUserId, roles, namespace);
        // If the user is a student, create a distribution list based on the student's class
        Smartix.Accounts.createOrAddToDistributionList(newUserId, namespace, userObj.classroom, currentUser);
        return {
            id: newUserId,
            isNew: true
        };
    }
};

/**
 * @param userObj
 * @param email
 * @param namespace
 * @returns the createdUserId
 */
Smartix.Accounts.createUserImpl = function(userObj, email, namespace) {
    var newUserOptions = {};
    //if (userObj.username) { newUserOptions.username = userObj.username; }
    if (userObj.username) { newUserOptions.username = userObj.username.toLowerCase(); }
    if (!userObj.username && userObj.profile && userObj.profile.firstName && userObj.profile.lastName) {
        newUserOptions.username = Smartix.Accounts.helpers.generateUniqueUserName(userObj.profile.firstName, userObj.profile.lastName);
    }
    if (!(userObj.username || userObj.profile || userObj.profile.firstName || userObj.profile.lastName)) {
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
        //newUserOptions.email = email;
        newUserOptions.email = email.toLowerCase();
    }
    //log.info("About to create user "+ newUserOptions.email + " " + newUserOptions.username + " for school "+newUserOptions.schools);
    var newUserId;
    try {
        newUserId = Accounts.createUser(newUserOptions);
        log.info('Created successfully newUserId: ', newUserId);
        Meteor.users.update({ _id: newUserId }, { $addToSet: { schools: { $each: [namespace] } } });
    }
    catch (e) {
        log.error("Couldn't create user", e);
    }
    return newUserId;
};

Smartix.Accounts.setPassword = function(newUserId, tmpPassword) {
    if (tmpPassword && tmpPassword !== "") {
        log.info("Setting password for user ", newUserId);
        Accounts.setPassword(newUserId, tmpPassword, { logout: false });
    }
};

/**
 * Verification is actually a notification.
 * @param email
 * @param newUserId
 * @param autoEmailVerified
 * @param doNotifyEmail
 */

Smartix.Accounts.notifyByEmail = function(email, newUserId, autoEmailVerified, doNotifyEmail) {
    if (email) {
        if (autoEmailVerified) {
            var newlyCreatedUser = Meteor.users.findOne(newUserId);
            if (newlyCreatedUser.emails) {
                log.info("Autoverifying email " + email);
                Meteor.users.update({ _id: newUserId }, { $set: { "emails.0.verified": true } });
            }
            else {
                log.warn("Cannot autoverify email set up for ", newUserId, newlyCreatedUser.profile.firstName, " ", newlyCreatedUser.profile.lastName);
            }
        }
        if (doNotifyEmail) {
             Meteor.defer(function(){
                try {
                    //it is a prerequisite to have no verified email adress before sending verification
                    //[App] Notification email is not sent even when selected #568
                    if (Meteor.users.findOne({ _id: newUserId, "emails.0.verified": false }) || autoEmailVerified ) {
                        //For now we do not send the password as it is autologin
                        //In the future, we should send the password as well with autogin email.send
                        // see http://stackoverflow.com/questions/15684634/how-to-generate-new-meteor-login-tokens-server-side-in-order-to-make-a-quick-l
                        // or https://github.com/DispatchMe/meteor-login-token
                        try{
                            Accounts.sendVerificationEmail(newUserId);
                            log.info("Sending verification email to ", email);
                        }
                        catch(err) {
                            //cannot verify if already verify in this case we send enrollment email
                            log.info("Sending sendEnrollmentEmail to ", email);
                            Accounts.sendEnrollmentEmail(newUserId);
                        }
                    }
                    else log.info("No need to send verification email", email);
                } catch (e) {
                    log.error("Cannot send verification email to ", email, e);
                }
             });
        }
        else{
            log.warn("Admin chose not to notify new user by email " + newUserId);
        }
    }
    else if (doNotifyEmail) {
        log.warn("Cannot notify email " + email);
    }
};

/**
 * Reset password
 * @param email
 * @param newUserId
 * @param doNotifyEmail
 */
Smartix.Accounts.sendEnrollmentEmail = function(email, newUserId, doNotifyEmail) {
    if (email) {
        if (doNotifyEmail) {
            try {
                log.info("Sending enrollment email to ", email);
                Meteor.defer(function(){
                  Accounts.sendEnrollmentEmail(newUserId);
                })
            } catch (e) {
                log.error("Cannot send enrollment email to ", email, e);
            }
        }
        else{
            log.warn("sendEnrollmentEmail - Admin chose not to notify new user by email " + newUserId);
        }
    }
    else {
        log.warn("Cannot send enrollment email " + email);
    }
};

Smartix.Accounts.createOrAddToDistributionList = function(roles, namespace, classroom, currentUser) {
    if (classroom) {
        Smartix.DistributionLists.createDistributionList({
            users: [roles],
            namespace: namespace,
            name: classroom,
            expectDuplicates: true,
            upsert: true
        }, currentUser);
    }
};

//This removes all user's roles in a namespace
Smartix.Accounts.removeUser = function(userId, namespace, currentUser) {
    check(userId, Match.Maybe(String));
    check(namespace, String);
    check(currentUser, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

    // Retrieve the target user
    var targetUser = Meteor.users.findOne({ _id: userId });
    var hasPermission  = Smartix.Accounts.School.canRemoveUser(userId, namespace, currentUser);
    if (!hasPermission) {
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

Smartix.Accounts.editUser = function(userId, options, currentUser) {
    if (Smartix.Accounts.canEditUser(userId, options, currentUser)) {
        let existingUserObj = Meteor.users.findOne(userId);
        let merged = lodash.merge(existingUserObj, options);
        //log.info("Smartix.Accounts.editUser", merged);//remove verbose especially with avatarImage
        return Meteor.users.update(
            { _id: userId},
            { $set: merged }
        );
    }
    else {
        log.warn("cannot edit user");
    }
    return false;
};

Smartix.Accounts.canEditUser = function(userId, options, currentUser) {
    check(userId, Match.Maybe(String));
    // Allow only users to change certain fields (e.g. users cannot change their role)
    if(options.schoolNamespace)
    {
        var namespace = options.schoolNamespace;
        delete options.schoolNamespace;
    }
    //Smartix.Accounts.editUserSchema.clean(options);
    //check(options, Smartix.Accounts.editUserSchema);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

    // If the user exists
    return !!currentUser
        // AND if the user is the only system administrator, you cannot delete
        && (Smartix.Accounts.System.isAdmin(currentUser)
            // OR is the user themselves
            || userId === currentUser 
            || Smartix.Accounts.School.isAdmin(namespace, currentUser));
};


Smartix.Accounts.deleteSchoolUser = function(userId){
    var userToBeDeleted = Meteor.users.findOne({ _id: userId });
    userToBeDeleted.deletedAt = Date.now();
    Smartix.Accounts.DeleteUsersCol.insert(userToBeDeleted, function(err, id) {
        // Remove the user from the `Meteor.users` collection
        Meteor.users.remove({ _id: userId });
    });    
}

//This actually delete user from users collection
Smartix.Accounts.deleteUser = function(userId, currentUser) {
    if (Smartix.Accounts.canDeleteUser(userId, currentUser)) {
        // Make a copy of the user into a new collection
        // This ensures all records are kept
        // But the user would still be able to create a new account using the same email
        var userToBeDeleted = Meteor.users.findOne({ _id: userId });
        userToBeDeleted.deletedAt = Date.now();
        Smartix.Accounts.DeleteUsersCol.insert(userToBeDeleted, function(err, id) {
            // Remove the user from the `Meteor.users` collection
            Meteor.users.remove({ _id: userId });
        });
    }
};

Smartix.Accounts.canDeleteUser = function(userId, currentUser) {
    check(userId, Match.Maybe(String));
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    // If the user is the only system administrator, you cannot delete
    return (Smartix.Accounts.System.isAdmin(currentUser) && Roles.getUsersInRole('sysadmin').count() > 0)
        // the user themselves
        || userId === currentUser;
};

Smartix.Accounts.getUserInfo = function(id, namespace, currentUser) {
    // Check that the arguments are of the correct type
    check(id, String);
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    // Retrieve the target user
    var targetUser = Meteor.users.findOne({
        _id: id
    });
    var hasPermission = Smartix.Accounts.School.canGetUserInfo(id, namespace, currentUser);
    if (!hasPermission) {
        return false;
        // OPTIONAL: Throw error indicating user does not have permission
    }
    return targetUser;
};

Smartix.Accounts.getAllUsersInNamespace = function(namespace, currentUser) {
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    var hasPermission = Smartix.Accounts.School.canGetAllUsers(namespace, currentUser);
    if (hasPermission) {
        var meteorQuery = {};
        
        // ES6 SYNTAX
        // See http://stackoverflow.com/questions/19837916/javascript-creating-object-with-dynamic-keys for newer syntax
        return Meteor.users.find({
            schools: namespace,
            ['roles.'+namespace]: {  $exists: true }
        });
        // return Roles.getUsersInRole(['user', 'admin', 'student', 'teacher', 'parent'], namespace);
    } else {
        return false;
    }
};

Smartix.Accounts.updateDob = function(dob, currentUser) {

    check(dob, Match.OneOf(String, Date));
    check(currentUser, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

    if (currentUser) {

        if (typeof dob === "string") {
            dob = moment(dob, ["DD-MM-YYYY", "MM-DD-YYYY", "DD/MM/YYYY", "MM/DD/YYYY"]).format("DD-MM-YYYY");
        } else if (dob instanceof Date) {
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