Smartix = Smartix || {};

Smartix.Class = Smartix.Class || {};

Smartix.Class.Schema = new SimpleSchema({
	users: {
		type: [String],
        defaultValue: []
	},
	namespace: {
		type: String
	},
	type: {
		type: String,
		defaultValue: 'class'
	},
	className: {
		type: String,
        trim: true
	},
	addons: {
		type: [String],
		optional: true,
		defaultValue: []
	},
    classCode: {
        type: String,
        trim: true,
        unique: true,
        regEx: /^[a-zA-Z0-9-]{3,}$/,
        custom: function () {
            var inputClassCode = this.value.trim();
            if (Meteor.isServer && this.isSet ) {
                if(Smartix.Class.searchForClassWithClassCode(inputClassCode)) {
                    // If a class with the classCode already exists
                    // Invalidate Autoform and provides a suggestion
                    console.log('classcode already exist');
                    return 'classcode already exist';
                }
            }
        }
    },
	admins: {
		type: [String],
		minCount: 1
	},
	comments: {
		type: Boolean,
		defaultValue: true
	},
    ageRestricted: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        autoValue: function () {
                return new Date();
        }
    },
    classAvatar:{
        type: String,
        trim: true,
        optional: true
    },
    lastUpdatedBy: {
        type: String,
        optional: false,
        autoValue: function () {
            return Meteor.userId();
        }
    },
    lastUpdatedAt: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    }
});

Smartix.Class.searchForClassWithClassCode = function (classCode) {
    console.log('Checks that `classCode` conforms to the schema before searching',classCode);
    // Checks that `classCode` conforms to the schema before searching
    var classCodePattern = new RegExp(/^[a-zA-Z0-9-]{3,}$/);
    
    if (typeof classCode === "string"
        && classCodePattern.test(classCode)) {
        
        var existGroup = Smartix.Groups.Collection.findOne({
            classCode: classCode
        });
        console.log('existGroup',existGroup);
        // Returns the class object or `undefined`
        return existGroup;
    }
    return false;
}

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
}

Smartix.Class.isClassAdmin = function (userId, classId) {
    
    userId = userId || Meteor.userId();
    
    var queriedClass = Smartix.Groups.Collection.find({
        _id: classId
    });
    
    if(Array.isArray(queriedClass.admins)) {
        return queriedClass.admins.indexOf(userId) > -1;
    } else {
        // OPTIONAL: Throw error as `queriedClass.admins` should be an array of strings
    }
    return false;
}

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
}

Smartix.Class.createClass = function (classObj) {

    console.log('Smartix.Class.createClass',classObj);
    
	// Checks that the namespace is either `global`
    // or the currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * Teacher for the school (namespace) specified

	if(classObj.namespace !== 'global'
        && !Smartix.Class.canCreateClass(classObj.namespace)) {
			
	 	console.log('no right to create class')
		return false;
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
    if(classObj.classAvatar){
        newClass.classAvatar = classObj.classAvatar;
    }
    // Make the current user as the admin
	newClass.admins = [
		Meteor.userId()
	];
    newClass.addons = ['voice','images','calendar','documents','poll','comment'];
    
	// Checks the arguments are of the specified type, convert it if not
	Smartix.Class.Schema.clean(newClass);

	// Checks are done in one go
	check(newClass, Smartix.Class.Schema);

	// Remove duplicates from the `users` array
	newClass.users = _.uniq(newClass.users);
	
	// Checks the `classCode` is unique for this namespace
	if(Smartix.Groups.Collection.find({
		namespace: newClass.namesapce,
		classCode: /^newClass.classCode$/i
	}).count() > 0) {
		return false;
		// Optional: Throw error saying classCode already exists
	};

	return Smartix.Groups.createGroup(newClass);
}

Smartix.Class.editClass = function (classId, options) {

	// Checks that `id` is of type String
	check(classId, String);

	// Checks that `options` is an object
	check(options, Object);
	
	// Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class

	if(Smartix.Class.isClassAdmin(Meteor.userId(), classId)
        || !Smartix.Accounts.School.isAdmin(namespace)) {
		return false;
		// Optional: Throw an appropriate error if not
	}

	// Get the existing class
	var existingClass = Smartix.Groups.Collection.findOne({
		_id: classId
	});

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
		};

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

	// Update the group object using `$set`
	Smartix.Groups.editGroup(id, updateObj);
}

Smartix.Class.deleteClass = function (id) {

	// Checks that `id` is of type String
	check(id, String);

	// Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class

	if(Smartix.Class.isClassAdmin(Meteor.userId(), classId)
        || !Smartix.Accounts.School.isAdmin(namespace)) {
		return false;
		// Optional: Throw an appropriate error if not
	}

	// Remove the class specified
	Smartix.Groups.deleteGroup(id);
}

Smartix.Class.addUsersToClass = function (id, users) {

	// Checks that `id` is of type String
	check(id, String);

	// Checks that `users` is an array of Strings
	check(users, [String]);

	// Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class

	if(Smartix.Class.isClassAdmin(Meteor.userId(), classId)
        || !Smartix.Accounts.School.isAdmin(namespace)) {
		return false;
		// Optional: Throw an appropriate error if not
	}

	// Add users to class
	Smartix.Groups.addUsersToGroup(id, users);
}

Smartix.Class.removeUsersFromClass = function (id, users) {
	
	// Checks that `id` is of type String
	check(id, String);

	// Checks that `users` is an array of Strings
	check(users, [String]);

	// Checks that currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * One of the admins for the class

	if(Smartix.Class.isClassAdmin(Meteor.userId(), classId)
        || !Smartix.Accounts.School.isAdmin(namespace)) {
		return false;
		// Optional: Throw an appropriate error if not
	}

	// Add users to class
	Smartix.Groups.removeUsersFromGroup(id, users);
}




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