Smartix = Smartix || {};

Smartix.Class = Smartix.Class || {};
/**
 * @param classCode
 * @returns Return if classCode already taken or exist
 */
Smartix.Class.searchForClassWithClassCode = function(classCode) {
    //log.info('Checks that `classCode` conforms to the schema before searching', classCode);
    // Checks that `classCode` conforms to the schema before searching
    var classCodePattern = new RegExp(/^[a-zA-Z0-9-]{3,}$/);
    if (typeof classCode === "string"
        && classCodePattern.test(classCode)) {
        let existGroup = Smartix.Groups.Collection.findOne({
            //classCode: /^classCode$/i
            classCode: classCode.toLowerCase()
        });
        //TODO ADD namespace
        //log.info("Smartix.Class.searchForClassWithClassCode 1", classCode, existGroup);
        return !!existGroup;
    }
    //log.info("Smartix.Class.searchForClassWithClassCode 2", classCode, false);
    return false;
};

Smartix.Class.getClassesOfUser = function(id) {
    if (Match.test(id, String)) {
        // Ensures `id` points to an existing user
        id = !!Meteor.users.findOne({ _id: id }) ? id : undefined;
    } else {
        // If `id` is not a string, `undefined`,`null` etc.
        // Use the currently-logged in user
        id = Meteor.userId()
    }
    if (id) {
        return Smartix.Groups.Collection.find({
            type: 'class',
            users: id,
            namespace: Smartix.Acccounts.listUserSchools(id)
        });
    }
};

Smartix.Class.isClassAdmin = function(userId, groupId) {
    userId = userId || Meteor.userId();
    var queriedGroup = Smartix.Groups.Collection.findOne({
        _id: groupId
    });
    if ( queriedGroup.namespace && Smartix.Accounts.School.isAdmin(queriedGroup.namespace) ) {
        return true;
    }
    if (typeof queriedGroup.namespace === 'undefined') {
        log.warn("Smartix.Class.isClassAdmin, queriedGroup.namespace not found for groupId", groupId);
        log.warn("Smartix.Class.isClassAdmin, queriedGroup.namespace", queriedGroup.namespace);
    }
    if (Array.isArray(queriedGroup.admins)) {
        log.info("Smartix.Class.isClassAdmin userid", userId , ", groupId", groupId, ", admins", queriedGroup.admins);
        return queriedGroup.admins.indexOf(userId) > -1;
    } else  {
        // OPTIONAL: Throw error as `queriedClass.admins` should be an array of strings
        return false;
    }
};

Smartix.Class.canCreateClass = function(namespace, currentUser) {
    check(namespace, String);
    check(currentUser, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

    var userToBeChecked = currentUser || Meteor.userId();
    return Smartix.Accounts.School.isTeacher(namespace, currentUser)
        || Smartix.Accounts.School.isAdmin(namespace, currentUser)
        || Smartix.Accounts.System.isAdmin(currentUser);
};

Smartix.Class.createClass = function(classObj, currentUser) {
    //check class code unique
    let classCode = classObj.classCode.trim();
    if (Smartix.Class.searchForClassWithClassCode(classCode) ) {
        log.error("cannot create class, class code already exist", classCode);
        throw new Meteor.Error("class-code-already-exist", classCode );
    }
    else{
        log.info("Creating class with classCode", classCode);//, classObj);
    }
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    // Checks that the namespace is either `global` or the currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * Teacher for the school (namespace) specified
    if (classObj.namespace !== 'global'
        && !Smartix.Class.canCreateClass(classObj.namespace, currentUser)) {
        log.warn('no right to create class from'+ currentUser);
        return "no-right-create-class";
        //return false; // Optional: Throw an appropriate error if not
    }
    // Creating class document to be inserted
    var newClass = {};
    newClass.users = classObj.users;
    newClass.namespace = classObj.namespace;
    newClass.type = 'class';
    newClass.className = classObj.className.trim();
    newClass.classCode = classObj.classCode.toLowerCase().trim();
    
    newClass.ageRestricted = classObj.ageRestricted;
    // newClass.anyoneCanChat = classObj.anyoneCanChat;
    newClass.notifyStudents = classObj.notifyStudents;
    newClass.notifyParents = classObj.notifyParents;
    if (classObj.classAvatar) {
        newClass.classAvatar = classObj.classAvatar;
    }
    else
    {
        newClass.classAvatar= 'green_apple';
    }
    // Make the current user as the admin
    newClass.admins = [currentUser];
    newClass.addons = ['voice', 'images', 'calendar', 'documents', 'poll', 'comment'];
    // If a distribution list is specified
    if (Array.isArray(classObj.distributionLists)) {
        // If `copyMode` is set to `copy
        // Copy the users in those lists to the users array
        if (classObj.copyMode === "copy") {
            let distributionListsToCopy = Smartix.Groups.Collection.find({
                _id: { $in: classObj.distributionLists },
                namespace: classObj.namespace,
                type: "distributionList"
            }).fetch();
            let usersToCopy = _.reduce(distributionListsToCopy, function(users, list) {
                users = _.concat(users, list.users);
                return users;
            }, []);
            newClass.users = _.union(newClass.users, usersToCopy);
        } else {
            newClass.distributionLists = classObj.distributionLists;
        }
    }
    
    
    // Remove duplicates from the `users` array
    newClass.users = _.uniq(newClass.users);
    
    // Checks if classCode Already exists
    let existingClass = Smartix.Class.searchForClassWithClassCode(newClass.classCode);
    if(existingClass) {
        // If there is an existing class
        // Add the admins to the class
        Smartix.Class.addAdminsToClass(existingClass._id, newClass.admins, currentUser);
        return false;
        // Optional: Throw error saying classCode already exists
    } else {
        // Checks the arguments are of the specified type, convert it if not
        Smartix.Class.Schema.clean(newClass);
        // Checks are done in one go
        try{
            check(newClass, Smartix.Class.Schema);
        }
        catch(e) {
            throw new Meteor.Error("class-code-syntax", "invalid class code syntax");
        }

        let newClassId = Smartix.Groups.createGroup(newClass);
        // Send emails to students if `newClass.notifyStudents` is true
        if (newClass.notifyStudents) {
            _.each(newClass.users, function(student, i, students) {
            //    Smartix.Class.NotifyStudents(student, newClassId);
            });
        }
        // Send emails to parents if `newClass.notifyParents` is true
        if (newClass.notifyParents) {
            let parentUsersArray = [];
            _.each(newClass.users, function(student, i, students) {
                // Get the parents of the student
                let parents = Smartix.Accounts.Relationships.getParentOfStudent(student, namespace);
                parentUsersArray.push(parents);
                _.each(parents, function(parent, i) {
                //    Smartix.Class.NotifyStudents(parent, newClassId);
                });
            });
            // Add each parent to the class
            Smartix.Groups.addUsersToGroup(newClassId, _.uniq(_.flattenDeep(parentUsersArray)));
        }
        log.info("Created successfully class", newClassId);
        return newClassId;
    }
};

Smartix.Class.canEditClass = function (classId, currentUser) {
    check(classId, String);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    var existingClass = Smartix.Groups.Collection.findOne({
        _id: classId
    });
    return (Smartix.Class.isClassAdmin(currentUser, classId)
        || Smartix.Accounts.School.isAdmin(existingClass.namespace, currentUser));
};

Smartix.Class.editClass = function(classId, options, currentUser) {
    log.info('Smartix.Class.editClass', classId, options);
    // Checks that `id` is of type String
    check(classId, String);
    // Checks that `options` is an object
    check(options, Object);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    // Get the existing class
    var existingClass = Smartix.Groups.Collection.findOne({
        _id: classId
    });
    if (!existingClass) {
        return;
    }
    // Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class

    if (!Smartix.Class.canEditClass(classId, currentUser)) {
        log.warn('no right to edit class from'+ currentUser);
        return false;
        // Optional: Throw an appropriate error if not
    }
    var updateObj = {};
    if (options.users) {
        check(options.users, [String]);
        // Remove non-existent users
        updateObj.users = Smartix.Accounts.Utilities.removeNonExistentUsers(options.users);
    }
    if (options.className) {
        check(options.className, String);
        updateObj.className = options.className;
    }
    if (options.classCode) {
        check(options.classCode, Match.Where(function(str) {
            check(str, String);
            // Regex checks for alphanumeric string (hyphen allowed)
            // of at least 3 characters long
            var regexp = /^[a-zA-Z0-9-]{3,}$/;
            return regexp.test(str);
        }));
        // Checks the `classCode` is unique for this namespace
        if (Smartix.Groups.Collection.find({
            namespace: existingClass.namesapce,
            classCode: updateObj.classCode
        }).count() > 0) {
            return false;
            // OPTIONAL: Throw error saying classCode already exists
        }
        updateObj.classCode = options.classCode;
    }
    if (options.admins) {
        check(options.admins, [String]);
        updateObj.admins = options.admins;
        // Remove duplicates from the `admins` array
        updateObj.admins = _.uniq(updateObj.admins);
        // Remove non-existent users
        updateObj.admins = Smartix.Accounts.Utilities.removeNonExistentUsers(updateObj.admins);
        // Checks to see if there is at least one valid user
        if (updateObj.admins.length < 1) {
            return false;
            // OPTIONAL: Throw an error indicating no valid admin user
        }
    }
    if (options.comments) {
        check(options.comments, Boolean);
        updateObj.comments = options.comments;
    }
    if (options.classAvatar) {
        check(options.classAvatar, String);
        updateObj.classAvatar = options.classAvatar;
    }
    if (options.ageRestricted) {
        check(options.ageRestricted, Boolean);
        updateObj.ageRestricted = options.ageRestricted;
    }
    // if (options.anyoneCanChat) {
    //     check(options.anyoneCanChat, Boolean);
    //     updateObj.anyoneCanChat = options.anyoneCanChat;
    // }
    // Update the group object using `$set`
    log.info('Smartix.Groups.editGroup@editClass', updateObj)
    Smartix.Groups.editGroup(existingClass._id, updateObj);
};

Smartix.Class.deleteClass = function(id) {

    // Checks that `id` is of type String
    check(ids, String);

    // Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class

    if (!(Smartix.Class.isClassAdmin(Meteor.userId(), classId)
        || Smartix.Accounts.School.isAdmin(namespace))) {
        return false;
        // Optional: Throw an appropriate error if not
    }

    // Remove the class specified
    Smartix.Groups.deleteGroup(id);
};

Smartix.Class.deleteClasses = function(ids) {
    // Checks that `ids` is of type String Array
    check(ids, [String]);
    // Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class
    ids.map(function(eachClassId){
        var existGroup = Smartix.Groups.Collection.findOne({
            _id: eachClassId
        });
        if(!existGroup){
            log.warn('Class to be deleted does not exist', eachClassId);
            return false;
        }
        if (!(Smartix.Class.isClassAdmin(Meteor.userId(), eachClassId)
            || Smartix.Accounts.School.isAdmin(existGroup.namespace))) {
            log.warn('No permission to operate on some of the groups')
            return false;
            // Optional: Throw an appropriate error if not
        }        
    });
    // Remove the class specified
    Smartix.Groups.deleteGroups(ids);
};

Smartix.Class.addAdminsToClass = function(classId, users, currentUser) {
    // Checks that `id` is of type String
    check(classId, String);
    // Checks that `users` is an array of Strings
    check(users, [String]);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class
    let classObj = Smartix.Groups.Collection.findOne({
        _id: classId,
        type: "class"
    });

    if (classObj) {
        if (!Smartix.Class.canEditClass(classId, currentUser)) {
            return false;
            // Optional: Throw an appropriate error if not
        }
    } else {
        return false;
    }

    users = Smartix.Accounts.Utilities.removeNonExistentUsers(users);
    // Push (using `$addToSet`) the new users to the existing `users` array
    Smartix.Groups.Collection.update({
        _id: classId
    }, {
        $addToSet: {
            admins: {
                $each: users
            }
        }
    });
};

Smartix.Class.addListsToClass = function(classId, lists) {
    // Checks that `classId` is of type String
    check(classId, String);
    // Checks that `lists` is an array of Strings
    check(lists, [String]);
    // Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class
    let classObj = Smartix.Groups.Collection.findOne({
        _id: classId,
        type: "class"
    });

    if (classObj) {
        if (!(
            Smartix.Class.isClassAdmin(Meteor.userId(), classId)
            || Smartix.Accounts.School.isAdmin(classObj.namespace)
            || Smartix.Accounts.School.isMember(Meteor.userId(), classObj.namespace)
            || classObj.namespace === 'global'
        )) {
            return false;
            // Optional: Throw an appropriate error if not
        }
    } else {
        return false;
    }

    // Add users to class
    Smartix.Groups.addDistributionListsToGroup(classId, lists);
    // SEND NOTIFICATION EMAIL //
    if (classObj) {
        let usersInDistributionLists;
        if(classObj.notifyStudents || classObj.notifyParents) {
            // Get the users in the distribution list
            usersInDistributionLists = Smartix.DistributionLists.getUsersInDistributionLists(lists);
            // Remove the ones who are already in the class
            
            usersInDistributionLists = _.uniq(_.pullAll(usersInDistributionLists, classObj.users));
        }
        
        // Send emails to students if `newClass.notifyStudents` is true
        if (classObj.notifyStudents) {
            _.each(usersInDistributionLists, function(student, i, students) {
                //Smartix.Class.NotifyStudents(student, classObj._id);
            });
        }
        // Send emails to parents if `newClass.notifyParents` is true
        if (classObj.notifyParents) {
            _.each(usersInDistributionLists, function(student, i, students) {
                // Get the parents of the student
                let parents = Smartix.Accounts.Relationships.getParentOfStudent(student, classObj.namespace);
                _.each(parents, function(parent, i) {
                    //Smartix.Class.NotifyStudents(parent, classObj._id);
                });
            });
        }
    }
};

Smartix.Class.addUsersToClass = function(classId, users) {
    // Checks that `classId` is of type String
    check(classId, String);
    // Checks that `users` is an array of Strings
    check(users, [String]);

    // Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class
    let classObj = Smartix.Groups.Collection.findOne({
        _id: classId,
        type: "class"
    });
    if (classObj) {
        if (!(
            Smartix.Class.isClassAdmin(Meteor.userId(), classId)
            || Smartix.Accounts.School.isAdmin(classObj.namespace)
            || Smartix.Accounts.School.isMember(Meteor.userId(), classObj.namespace)
            || classObj.namespace === 'global'
        )) {
            return false;
            // Optional: Throw an appropriate error if not
        }
    } else {
        return false;
    }

    // Add users to class
    Smartix.Groups.addUsersToGroup(classId, users);

    // SEND NOTIFICATION EMAIL //
    if (classObj) {
        // Send emails to students if `newClass.notifyStudents` is true
        if (classObj.notifyStudents) {
            _.each(users, function(student, i, students) {
                //Smartix.Class.NotifyStudents(student, classObj._id);
            });
        }
        // Send emails to parents if `newClass.notifyParents` is true
        if (classObj.notifyParents) {
            _.each(users, function(student, i, students) {
                // Get the parents of the student
                let parents = Smartix.Accounts.Relationships.getParentOfStudent(student, classObj.namespace);

                _.each(parents, function(parent, i) {
                    //Smartix.Class.NotifyParents(parent, classObj._id);
                });
            });
        }
    }
};

Smartix.Class.removeUsersFromClass = function(classId, users, currentUser) {

    // Checks that `id` is of type String
    check(classId, String);

    // Checks that `users` is an array of Strings
    check(users, [String]);

    check(currentUser, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

    // Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class
    // TODO - Optimize this so
    // only if the user is not class admin
    // would we have to fetch the class object
    let classObj = Smartix.Groups.Collection.findOne({
        _id: classId,
        type: "class"
    });
    if (!(Smartix.Class.isClassAdmin(currentUser, classId)
        || Smartix.Accounts.School.isAdmin(classObj.namespace))) {
        return false;
        // Optional: Throw an appropriate error if not
    }
    // Remove users to class
    Smartix.Groups.removeUsersFromGroup(classId, users);
};

Smartix.Class.removeAdminsFromClass = function(classId, admins, currentUser) {

    // Checks that `id` is of type String
    check(classId, String);

    // Checks that `users` is an array of Strings
    check(admins, [String]);

    check(currentUser, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    // Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class

    // TODO - Optimize this so
    // only if the user is not class admin
    // would we have to fetch the class objec
    let classObj = Smartix.Groups.Collection.findOne({
        _id: classId,
        type: "class"
    });

    if (!(Smartix.Class.isClassAdmin(currentUser, classId)
        || Smartix.Accounts.School.isAdmin(classObj.namespace))) {
        return false;
        // Optional: Throw an appropriate error if not
    }

    Smartix.Groups.Collection.update({
        _id: classId
    }, {
            $pullAll: {
                admins: admins
            }
        });
};

Smartix.Class.removeListsFromClass = function(classId, lists, currentUser) {

    // Checks that `id` is of type String
    check(classId, String);

    // Checks that `users` is an array of Strings
    check(lists, [String]);

    check(currentUser, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class

    // TODO - Optimize this so
    // only if the user is not class admin
    // would we have to fetch the class object
    let classObj = Smartix.Groups.Collection.findOne({
        _id: classId,
        type: "class"
    });

    if (!(Smartix.Class.isClassAdmin(currentUser, classId)
        || Smartix.Accounts.School.isAdmin(classObj.namespace))) {
        return false;
        // Optional: Throw an appropriate error if not
    }
    
    Smartix.Groups.removeDistributionListsFromGroup(classId, lists);
};

Smartix.Class.NotifyParents = Smartix.Class.NotifyStudents = function(userId, classId) {

    check(userId, String);
    check(classId, String);

    let user = Meteor.users.findOne({
        _id: userId
    });

    if (!user) {
        return false;
        // throw new Meteor.Error("student-not-found", "Student with ID of " + studentId + " could not be found");
    }

    let classObj = Smartix.Groups.Collection.findOne({
        _id: classId,
        type: "class"
    });

    if (!classObj) {
        return false;
        // throw new Meteor.Error("class-not-found", "Class with ID of " + classId + " could not be found");
    }
    //TODO: async send not to block main thread?
    Email.send({
        subject: "You've been added to a class",
        from: Meteor.settings.FROM_EMAIL,
        //"from_name": Meteor.settings.FROM_NAME,
        to: user.emails[0].address,
        html: Smartix.notifyEmailTemplate(user, classObj)
    })
};

Smartix.Class.getDistributionListsOfClass = function (classCode) {
    
    // TODO - Checks for permission
    
    let targetClass = Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: classCode
    });
    if (targetClass) {
        return Smartix.Groups.Collection.find({
            type: 'distributionList',
            _id: {
                $in: targetClass.distributionLists
            }
        });
    } else {
        return false;
    }
};

/////////////////////////////////
// OLD CODE TO BE SORTED LATER //
/////////////////////////////////

Smartix.Class.Schema.i18n("schemas.ClassesSchema");
//toremove
var msgStringError = TAPi18n.__("ClassCodeErrorMessage", {}, lang_tag = "en");
//https://github.com/aldeed/meteor-simple-schema#customizing-validation-messages
//custom validation message 
Smartix.Class.Schema.messages({
    regEx: [
        { msg: msgStringError }
        //{msg: "Only lower case (a-z) or digit (0-9) are accepted in class code e.g. math123. But you can set the class name you want"}
        //{msg: "[label] must contain only lower case letter without space"}
        //, {exp: ClassesSchema.RegEx, msg: "[label] must contain only lower case letter exp"}
    ]
});

Smartix.Class.Schema.messages({
    notUniqueAndSuggestClasscode: "[label] " + TAPi18n.__("Class_code_not_available") + " [value]"
});

Smartix.Class.AdminsOfJoinedClasses = function (userId, schoolName) {
    var joinedClasses;
    if(schoolName){
        var schoolDoc = SmartixSchoolsCol.findOne({
            shortname: schoolName
        });
        // if(schoolName === 'smartix'){
        //         joinedClasses = Smartix.Groups.Collection.find({
        //             type: 'class',
        //             $or: [{
        //                 users: userId
        //             }, {
        //                 distributionLists: {
        //                     $in: Smartix.DistributionLists.getDistributionListsOfUser(userId)
        //                 }
        //             }],
        //             namespace: 'global'
        //         }).fetch();
        // } else {
            joinedClasses = Smartix.Groups.Collection.find({
                $or: [{
                    users: userId
                }, {
                    distributionLists: {
                        $in: Smartix.DistributionLists.getDistributionListsOfUser(userId)
                    }
                }],
                type: 'class',
                namespace: schoolDoc._id
            }).fetch();
        // }         
    } else {
        joinedClasses = Smartix.Groups.Collection.find({
            type: 'class',
            $or: [{
                users: userId
            }, {
                distributionLists: {
                    $in: Smartix.DistributionLists.getDistributionListsOfUser(userId)
                }
            }]
        }).fetch();        
    }
    
    // Extract all the users from the `users` property
    // from all classes into another array  
    var admins = _.flatMap(joinedClasses, 'admins');
    // Returns a cursor of all users in the `admins` array
    return Meteor.users.find({ 
        _id: {
            $in: admins 
        }
    }).fetch();
};