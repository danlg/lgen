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

Smartix.Accounts.School.canCreateUser = function(namespace, types, currentUser) {
    check(namespace, String);
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

Smartix.Accounts.School.importStudentSchema = new SimpleSchema({
    studentId: { type: String, optional: true,
        custom: function() {
            // Checks if email is set, if so, this is optional
        }
    },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, optional: true,
        custom: function() {
            // Checks if studentId is set, if so, this is optional
        }
    },
    grade: { type: String },
    classroom: { type: String },
    gender: { type: String },
    dob: { type: String },
    tel: { type: String, optional: true },
    password: {type: String, optional: true }
});

Smartix.Accounts.School.importStudent = function(namespace, data, currentUser) {
    check(namespace, String);
    check(data, [Smartix.Accounts.School.importStudentSchema]);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    if(!Smartix.Accounts.School.canImportStudents(namespace, currentUser)) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }
    let newUsers = [];
    let errors = [];
    log.info("Importing students for school ", namespace);
    _.each(data, function(user, i, users) {
        try {
            let email = user.email;
            user.profile = {};
            user.profile.firstName = user.firstName;
            user.profile.lastName = user.lastName;

            if (user.dob) {
                user.dob = moment(user.dob, ["DD/MM/YYYY", "DD-MM-YYYY", "DD-MM-YY", "DD/MM/YY"]).toString();
                //stored as a date in mongo db !! why ? plus -1 day with passed date

                // user.dob = new Date(user.dob).toISOString();
            }

            delete user.firstName;
            delete user.lastName;
            delete user.email;
            log.info(i+1, "Attempting to create user ", user.profile.firstName, user.profile.lastName);
            let newUserId = Smartix.Accounts.createUser(email, user, namespace, ['student'], currentUser, true);
            if(typeof newUserId === "string") {
                newUsers.push(newUserId);
            } else {
                errors.push(newUserId);
            }
        } catch(e) {
            errors.push(e);
            log.error("Error",e);
        }
    });
    log.info("Finished importing students for school ", namespace);
    return {
        newUsers: newUsers,
        errors: errors
    }
};

var canIdentifyStudent = function(data) {
    let studentId = data.field('studentId');
    let studentEmail = data.field('studentEmail');
    if(studentId.isSet || studentEmail.isSet) {
        return true;
    } else {
        return "At least one of Student ID or Student Email Address must be specified";
    }
};

var convertStudentObjectToMother = function (student) {
    check(student, Object);
    let motherUserObj = {};
    if(student.motherSalutation) {
        motherUserObj.salutation = student.motherSalutation;
    }
    if(student.motherFirstName) {
        motherUserObj.profile = motherUserObj.profile || {};
        motherUserObj.profile.firstName = student.motherFirstName;
    }
    if(student.motherLastName) {
        motherUserObj.profile = motherUserObj.profile || {};
        motherUserObj.profile.lastName =  student.motherLastName;
    }
    if(student.motherMobile) {
        motherUserObj.tel = motherUserObj.mobile = student.motherMobile;
    }
    if(student.motherEmployer) {
        motherUserObj.employer =  student.motherEmployer;
    }
    if(student.motherNationality) {
        motherUserObj.nationality = student.motherNationality;
    }
    if(student.motherLanguage) {
        motherUserObj.language = student.motherLanguage;
        motherUserObj.lang = Smartix.Utilities.getLanguageCode(student.motherLanguage);
    }
    if(student.motherHomeAddress1) {
        motherUserObj.homeAddress1 = student.motherHomeAddress1;
    }
    if(student.motherHomeAddress2) {
        motherUserObj.homeAddress2 = student.motherHomeAddress2;
    }
    if(student.motherHomeCity) {
        motherUserObj.homeCity = motherUserObj.city = student.motherHomeCity;
    }
    if(student.motherHomeState) {
        motherUserObj.homeState = student.motherHomeState;
    }
    if(student.motherHomePostalCode) {
        motherUserObj.homePostalCode = student.motherHomePostalCode;
    }
    if(student.motherHomeCountry) {
        motherUserObj.homeCountry = student.motherHomeCountry;
    }
    if(student.motherHomePhone) {
        motherUserObj.homePhone = student.motherHomePhone;
    }
    if(student.motherWorkAddress1) {
        motherUserObj.workAddress1 = student.motherWorkAddress1;
    }
    if(student.motherWorkAddress2) {
        motherUserObj.workAddress2 = student.motherWorkAddress2;
    }
    if(student.motherWorkCity) {
        motherUserObj.workCity = student.motherWorkCity;
    }
    if(student.motherWorkState) {
        motherUserObj.workState = student.motherWorkState;
    }
    if(student.motherWorkPostalCode) {
        motherUserObj.workPostalCode = student.motherWorkPostalCode;
    }
    if(student.motherWorkCountry) {
        motherUserObj.workCountry = student.motherWorkCountry;
    }
    if(student.motherWorkPhone) {
        motherUserObj.workPhone = student.motherWorkPhone;
    }
    motherUserObj.gender = 'Female';
    return motherUserObj;
};

var convertStudentObjectToFather = function (student) {
    check(student, Object);
    let fatherUserObj = {};
    if(student.fatherSalutation) {
        fatherUserObj.salutation = student.fatherSalutation;
    }
    if(student.fatherFirstName) {
        fatherUserObj.profile = fatherUserObj.profile || {};
        fatherUserObj.profile.firstName = student.fatherFirstName;
    }
    if(student.fatherLastName) {
        fatherUserObj.profile = fatherUserObj.profile || {};
        fatherUserObj.profile.lastName =  student.fatherLastName;
    }
    if(student.fatherMobile)   { fatherUserObj.tel = fatherUserObj.mobile = student.fatherMobile; }
    if(student.fatherEmployer) { fatherUserObj.employer =  student.fatherEmployer;}
    if(student.fatherNationality) { fatherUserObj.nationality = student.fatherNationality; }

    if(student.fatherLanguage) {
        fatherUserObj.language = student.fatherLanguage;
        fatherUserObj.lang = Smartix.Utilities.getLanguageCode(student.fatherLanguage);
    }
    if(student.fatherHomeAddress1) {
        fatherUserObj.homeAddress1 = student.fatherHomeAddress1;
    }
    if(student.fatherHomeAddress2) {
        fatherUserObj.homeAddress2 = student.fatherHomeAddress2;
    }
    if(student.fatherHomeCity) {
        fatherUserObj.homeCity =  student.fatherHomeCity;
        fatherUserObj.city =  student.fatherHomeCity;
    }
    if(student.fatherHomeState) {
        fatherUserObj.homeState = student.fatherHomeState;
    }
    if(student.fatherHomePostalCode) {
        fatherUserObj.homePostalCode = student.fatherHomePostalCode;
    }
    if(student.fatherHomeCountry) {
        fatherUserObj.homeCountry = student.fatherHomeCountry;
    }
    if(student.fatherHomePhone) {
        fatherUserObj.homePhone = student.fatherHomePhone;
    }
    if(student.fatherWorkAddress1) {
        fatherUserObj.workAddress1 = student.fatherWorkAddress1;
    }
    if(student.fatherWorkAddress2) {
        fatherUserObj.workAddress2 = student.fatherWorkAddress2;
    }
    if(student.fatherWorkCity) {
        fatherUserObj.workCity = student.fatherWorkCity;
    }
    if(student.fatherWorkState) {
        fatherUserObj.workState = student.fatherWorkState;
    }
    if(student.fatherWorkPostalCode) {
        fatherUserObj.workPostalCode = student.fatherWorkPostalCode;
    }
    if(student.fatherWorkCountry) {
        fatherUserObj.workCountry = student.fatherWorkCountry;
    }
    if(student.fatherWorkPhone) {
        fatherUserObj.workPhone = student.fatherWorkPhone;
    }
    fatherUserObj.gender = 'Male';
    return fatherUserObj;
};


