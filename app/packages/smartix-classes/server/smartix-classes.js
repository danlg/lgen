Smartix = Smartix || {};

Smartix.Class = Smartix.Class || {};

Smartix.Class.searchForClassWithClassCode = function (classCode) {
    log.info('Checks that `classCode` conforms to the schema before searching',classCode);
    // Checks that `classCode` conforms to the schema before searching
    var classCodePattern = new RegExp(/^[a-zA-Z0-9-]{3,}$/);
    
    if (typeof classCode === "string"
        && classCodePattern.test(classCode)) {
        
        var existGroup = Smartix.Groups.Collection.findOne({
            classCode: classCode
        });
        log.info('existGroup',existGroup);
        // Returns the class object or `undefined`
        return existGroup;
    }
    return false;
};

Smartix.Class.getClassesOfUser = function (id) {
	if(Match.test(id, String)) {
		// Ensures `id` points to an existing user
		id = !!Meteor.users.findOne({_id: id}) ? id : undefined;
	} else {
		// If `id` is not a string, `undefined`,`null` etc.
		// Use the currently-logged in user
		id = Meteor.userId()
	}
	if(id) {
		return Smartix.Groups.Collection.find({
			type: 'class',
			users: id,
			namespace: Smartix.Acccounts.listUserSchools(id)
		});
	}
};

Smartix.Class.isClassAdmin = function (userId, classId) {
    
    userId = userId || Meteor.userId();
    
    var queriedClass = Smartix.Groups.Collection.findOne({
        _id: classId
    });
    
    if(Array.isArray(queriedClass.admins)) {
        
        return queriedClass.admins.indexOf(userId) > -1;
    } else {
        
        // OPTIONAL: Throw error as `queriedClass.admins` should be an array of strings
        return false;    
    }
   
};

Smartix.Class.canCreateClass = function (namespace, currentUser) {
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    var userToBeChecked = currentUser || Meteor.userId();
    return Smartix.Accounts.School.isTeacher(namespace, currentUser)
        || Smartix.Accounts.School.isAdmin(namespace, currentUser)
        || Smartix.Accounts.System.isAdmin(currentUser);
};

Smartix.Class.createClass = function (classObj, currentUser) {

    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
	// Checks that the namespace is either `global`
    // or the currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * Teacher for the school (namespace) specified

	if(classObj.namespace !== 'global'
        && !Smartix.Class.canCreateClass(classObj.namespace, currentUser)) {
			
	 	log.info('no right to create class')
		
  	    return "no-right-create-class" ;		
		//return false;
		// Optional: Throw an appropriate error if not
	}

	// Creating class document to be inserted
	var newClass = {};
	newClass.users = classObj.users;
	newClass.namespace = classObj.namespace;
	newClass.type = 'class';
	newClass.className = classObj.className.trim();
	newClass.classCode = classObj.classCode.trim();
    newClass.ageRestricted = classObj.ageRestricted;
    newClass.anyoneCanChat = classObj.anyoneCanChat;
    newClass.notifyStudents = classObj.notifyStudents;
    newClass.notifyParents = classObj.notifyParents;
    if(classObj.classAvatar){
        newClass.classAvatar = classObj.classAvatar;
    }
    // Make the current user as the admin
	newClass.admins = [currentUser];
    newClass.addons = ['voice','images','calendar','documents','poll','comment'];
    
	// Checks the arguments are of the specified type, convert it if not
	Smartix.Class.Schema.clean(newClass);

	// Checks are done in one go
	check(newClass, Smartix.Class.Schema);

	// Remove duplicates from the `users` array
	newClass.users = _.uniq(newClass.users);
	
	// Checks the `classCode` is unique for this namespace
    let classWithClassCode = Smartix.Groups.Collection.findOne({
		namespace: newClass.namesapce,
		classCode: /^newClass.classCode$/i
	});
	if(classWithClassCode) {
        Smartix.Class.addAdminsToClass(classWithClassCode._id, [currentUser]);
		return false;
		// Optional: Throw error saying classCode already exists
	}
    
    let newClassId = Smartix.Groups.createGroup(newClass);
    
    // Send emails to students if `newClass.notifyStudents` is true
    if(newClass.notifyStudents) {
        _.each(newClass.users, function (student, i, students) {
            Smartix.Class.NotifyStudents(student, newClassId);
        });
    }
    // Send emails to parents if `newClass.notifyParents` is true
    if(newClass.notifyParents) {
        _.each(newClass.users, function (student, i, students) {
            // Get the parents of the student
            let parents = Smartix.Accounts.Relationships.getParentOfStudent(student, namespace);
            
            _.each(parents, function (parent, i) {
                Smartix.Class.NotifyStudents(parent._id, newClassId);
            });
        });
    }
    
	return newClassId;
};

Smartix.Class.editClass = function (classId, options) {

    log.info('Smartix.Class.editClass',classId,options);
	// Checks that `id` is of type String
	check(classId, String);

	// Checks that `options` is an object
	check(options, Object);
	
	// Get the existing class
	var existingClass = Smartix.Groups.Collection.findOne({
		_id: classId
	});
    
    if(!existingClass){
        return;
    }    
	// Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class

	if(!(Smartix.Class.isClassAdmin(Meteor.userId(), classId)
        && Smartix.Accounts.School.isAdmin(existingClass.namespace))) {
        
        log.info('no right to edit class!')
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
		check(options.classCode, Match.Where(function(str){
			check(str, String);

			// Regex checks for alphanumeric string (hyphen allowed)
			// of at least 3 characters long
			var regexp = /^[a-zA-Z0-9-]{3,}$/;
			return regexp.test(str);
		}));

		// Checks the `classCode` is unique for this namespace
		if(Smartix.Groups.Collection.find({
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
    
    if (options.classAvatar){
        check(options.classAvatar, String);
        updateObj.classAvatar = options.classAvatar;
    }
    
    if(options.ageRestricted){
        check(options.ageRestricted, Boolean);
        updateObj.ageRestricted = options.ageRestricted;
    }

    if(options.anyoneCanChat){
        check(options.anyoneCanChat, Boolean);
        updateObj.anyoneCanChat = options.anyoneCanChat;
    }
        
	// Update the group object using `$set`
    log.info('Smartix.Groups.editGroup@editClass',updateObj)
	Smartix.Groups.editGroup(existingClass._id, updateObj);
};

Smartix.Class.deleteClass = function (id) {

	// Checks that `id` is of type String
	check(id, String);

	// Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class

	if(!(Smartix.Class.isClassAdmin(Meteor.userId(), classId)
        || Smartix.Accounts.School.isAdmin(namespace))) {
		return false;
		// Optional: Throw an appropriate error if not
	}

	// Remove the class specified
	Smartix.Groups.deleteGroup(id);
};

Smartix.Class.addAdminsToClass = function (classId, users) {
    
	// Checks that `id` is of type String
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
    
    if(classObj) {
        if(!(Smartix.Class.isClassAdmin(Meteor.userId(), classId)
            || Smartix.Accounts.School.isAdmin(classObj.namespace))) {
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
}

Smartix.Class.addUsersToClass = function (classId, users) {

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
    
	if(classObj) {
        if(!(Smartix.Class.isClassAdmin(Meteor.userId(), classId)
            || Smartix.Accounts.School.isAdmin(classObj.namespace))) {
            return false;
            // Optional: Throw an appropriate error if not
        }
    } else {
        return false;
    }

	// Add users to class
	Smartix.Groups.addUsersToGroup(classId, users);
    
    /////////////////////////////
    // SEND NOTIFICATION EMAIL //
    /////////////////////////////
    
    if(classObj) {
        // Send emails to students if `newClass.notifyStudents` is true
        if(classObj.notifyStudents) {
            _.each(users, function (student, i, students) {
                Smartix.Class.NotifyStudents(student, classObj._id);
            });
        }
        // Send emails to parents if `newClass.notifyParents` is true
        if(classObj.notifyParents) {
            _.each(users, function (student, i, students) {
                // Get the parents of the student
                let parents = Smartix.Accounts.Relationships.getParentOfStudent(student, classObj.namespace);
                
                _.each(parents, function (parent, i) {
                    Smartix.Class.NotifyStudents(parent._id, classObj._id);
                });
            });
        }
    }
};

Smartix.Class.removeUsersFromClass = function (classId, users, currentUser) {
	
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
    
    // TODO - Optimize this so
    // only if the user is not class admin
    // would we have to fetch the class object
    let classObj = Smartix.Groups.Collection.findOne({
        _id: classId,
        type: "class"
    });

	if(!(Smartix.Class.isClassAdmin(currentUser, classId)
        || Smartix.Accounts.School.isAdmin(classObj.namespace))) {
		return false;
		// Optional: Throw an appropriate error if not
	}

	// Remove users to class
	Smartix.Groups.removeUsersFromGroup(classId, users);
};

Smartix.Class.removeAdminsFromClass = function (classId, admins, currentUser) {
    
	// Checks that `id` is of type String
	check(classId, String);

	// Checks that `users` is an array of Strings
	check(admins, [String]);
    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
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
    
	if(!(Smartix.Class.isClassAdmin(currentUser, classId)
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
}

Smartix.Class.NotifyParents = Smartix.Class.NotifyStudents = function (studentId, classId) {
    
    check(studentId, String);
    check(classId, String);
    
    let student = Meteor.users.findOne({
        _id: studentId
    });
    
    if(!student) {
        return false;
        // throw new Meteor.Error("student-not-found", "Student with ID of " + studentId + " could not be found");
    }
    
    let classObj = Smartix.Groups.Collection.findOne({
        _id: classId,
        type: "class"
    });
    
    if(!classObj) {
        return false;
        // throw new Meteor.Error("class-not-found", "Class with ID of " + classId + " could not be found");
    }

    Email.send({
        subject: "You've been added to a class",
        from: Meteor.settings.FROM_EMAIL,
        //"from_name": Meteor.settings.FROM_NAME,
        to: student.emails[0].address,
        html: Smartix.notifyEmailTemplate(student, classObj)
    })
};

/////////////////////////////////
// OLD CODE TO BE SORTED LATER //
/////////////////////////////////

Smartix.Class.Schema.i18n("schemas.ClassesSchema");

var msgStringError = TAPi18n.__("ClassCodeErrorMessage", {}, lang_tag="en");
//https://github.com/aldeed/meteor-simple-schema#customizing-validation-messages
//custom validation message 
Smartix.Class.Schema.messages({
  regEx: [
    {msg: msgStringError }
    //{msg: "Only lower case (a-z) or digit (0-9) are accepted in class code e.g. math123. But you can set the class name you want"}
    //{msg: "[label] must contain only lower case letter without space"}
    //, {exp: ClassesSchema.RegEx, msg: "[label] must contain only lower case letter exp"}
  ]
});

Smartix.Class.Schema.messages({
    notUniqueAndSuggestClasscode: "[label] " + TAPi18n.__("Class_code_not_available") +  " [value]"
});