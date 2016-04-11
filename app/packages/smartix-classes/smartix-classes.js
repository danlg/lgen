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
		autoValue: function () {
			return 'class'
		}
	},
	className: {
		type: String,
        trim: true,
		optional: true
	},
	addons: {
		type: [String],
		optional: true,
		defaultValue: {}
	},
    classCode: {
        type: String,
        trim: true,
        unique: true,
        regEx: /^[a-zA-Z0-9-]{3,}$/,
        custom: function () {
            var inputClassCode = this.value.trim();
            if (Meteor.isClient && this.isSet && this.isInsert) {
                if(Smartix.Class.searchForClassWithClassCode(inputClassCode)) {
                    // If a class with the classCode already exists
                    // Invalidate Autoform and provides a suggestion
                    AutoForm.getValidationContext("insertClass").resetValidation();
                    AutoForm.getValidationContext("insertClass").addInvalidKeys([{
                        name: "classCode",
                        type: "notUniqueAndSuggestClasscode",
                        value: inputClassCode + "" + Smartix.helpers.getRandomInt(0,99)
                    }]);
                }
            }
        }
    },
	admins: {
		type: [String],
		minCount: 1,
        autoform: {
            omit: true
        }
	},
	comments: {
		type: Boolean,
		defaultValue: true
	},
    ageRestricted: {
        type: Boolean,
        autoform: {
            afFieldInput: {
                type: "boolean-checkbox2"
            }
        }
    },
    createdAt: {
        type: Date,
        autoform: {
            omit: true
        },
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            }
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
        autoform: {
            omit: true
        },
        autoValue: function () {
            return Meteor.userId();
        }
    },
    lastUpdatedAt: {
        type: Date,
        autoform: {
            omit: true
        },
        autoValue: function () {
            return new Date();
        }
    }
});

Smartix.Class.searchForClassWithClassCode = function (classCode) {
    // Checks that `classCode` conforms to the schema before searching
    var classCodePattern = new RegExp(/^[a-zA-Z0-9-]{3,}$/);
    
    if (typeof classCode === "string"
        && classCodePattern.test(classCode)) {
            
        // Returns the class object or `undefined`
        return Smartix.Groups.Collection.findOne({
            classCode: {
                $regex: new RegExp("^" + classCode.trim()+ "$", "i")
            }
        });
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

Smartix.Class.createClass = function (users, namespace, className, classCode) {

	// Checks that the namespace is either `global`
    // or the currently-logged in user is one of the following:
    // * Admin for the school (namespace) specified
    // * Teacher for the school (namespace) specified

	if(namespace !== 'global'
        && !Smartix.Accounts.isUserSchoolTeacherOrAdmin(namespace)) {
		return false;
		// Optional: Throw an appropriate error if not
	}

	// Creating class document to be inserted
	var newClass = {};
	newClass.users = users;
	newClass.namespace = namespace;
	newClass.type = 'class';
	newClass.className = className.trim();
	newClass.classCode = classCode.trim();
    
    // Make the current user as the admin
	newClass.admins = [
		Meteor.userId()
	];

	// Checks the arguments are of the specified type, convert it if not
	Smartix.Class.Schema.clean(options);

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
        || !Smartix.Accounts.isUserSchoolAdmin(namespace)) {
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
		updateObj.users = Smartix.Accounts.removeNonExistentUsers(options.users);
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
		updateObj.admins = Smartix.Accounts.removeNonExistentUsers(updateObj.admins);

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
        || !Smartix.Accounts.isUserSchoolAdmin(namespace)) {
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
        || !Smartix.Accounts.isUserSchoolAdmin(namespace)) {
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
        || !Smartix.Accounts.isUserSchoolAdmin(namespace)) {
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