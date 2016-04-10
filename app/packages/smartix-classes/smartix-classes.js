Smartix = Smartix || {};

Smartix.Class = Smartix.Class || {};

Smartix.Class.Schema = new SimpleSchema({
	users: {
		type: [String]
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
	name: {
		type: String,
		optional: true
	},
	addons: {
		type: [String],
		optional: true,
		defaultValue: {}
	},
	url: {
		type: String,
		regEx: /^[a-zA-Z0-9-]{3,}$/
	},
	admins: {
		type: [String],
		minCount: 1
	},
	comments: {
		type: Boolean,
		defaultValue: true
	}
});

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

Smartix.Class.createClass = function (users, namespace, name, url) {

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
	newClass.name = name;
	newClass.url = url;
	newClass.admins = [
		Meteor.userId()
	];

	// Checks the arguments are of the specified type, convert it if not
	Smartix.Class.Schema.clean(options);

	// Checks are done in one go
	check(newClass, Smartix.Class.Schema);

	// Remove duplicates from the `users` array
	newClass.users = _.uniq(newClass.users);
	
	// Checks the `url` is unique for this namespace
	if(Smartix.Groups.Collection.find({
		namespace: newClass.namesapce,
		url: newClass.url
	}).count() > 0) {
		return false;
		// Optional: Throw error saying URL already exists
	};

	return Smartix.Groups.createGroup(newsgroup);
}

Smartix.Newsgroup.editClass = function (classId, options) {

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

	if (options.name) {
		check(options.name, String);
		updateObj.name = options.name;
	}

	if (options.url) {
		check(options.url, Match.Where(function(str){
			check(str, String);

			// Regex checks for alphanumeric string (hyphen allowed)
			// of at least 3 characters long
			var regexp = /^[a-zA-Z0-9-]{3,}$/;
			return regexp.test(str);
		}));

		// Checks the `url` is unique for this namespace
		if(Smartix.Groups.Collection.find({
			namespace: existingClass.namesapce,
			url: updateObj.url
		}).count() > 0) {
			return false;
			// OPTIONAL: Throw error saying URL already exists
		};

		updateObj.url = options.url;
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

	// Remove the newsgroup specified
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

Smartix.Newsgroup.removeUsersToGroup = function (id, users) {
	
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