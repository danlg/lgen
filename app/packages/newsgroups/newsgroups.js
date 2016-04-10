Smartix = Smartix || {};

Smartix.Newsgroup = Smartix.Newsgroup || {};

Smartix.Newsgroup.Schema = new SimpleSchema({
	users: {
		type: [String]
	},
	namespace: {
		type: String
	},
	type: {
		type: String,
		autoValue: function () {
			return 'newsgroup'
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
		defaultValue: false
	}
});

Smartix.Newsgroup.getNewsGroupOfUser = function (id) {
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
			type: 'newsgroup',
			users: id,
			namespace: Smartix.Acccounts.listUserSchools(id)
		})
	}
}

Smartix.Newsgroup.createNewsgroup = function (users, namespace, name, url) {

	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)

	if(!Smartix.Accounts.isUserSchoolAdmin(namespace)) {
		return false;
		// Optional: Throw an appropriate error if not
	}

	// Creating newsgroup document to be inserted
	var newsgroup = {};
	newsgroup.users = users;
	newsgroup.namespace = namespace;
	newsgroup.type = 'newsgroup';
	newsgroup.name = name;
	newsgroup.url = url;
	newsgroup.admins = [
		Meteor.userId()
	];

	// Checks the arguments are of the specified type, convert it if not
	Smartix.Newsgroup.Schema.clean(options);

	// Checks are done in one go
	check(newsgroup, Smartix.Newsgroup.Schema);

	// Remove duplicates from the `users` array
	newsgroup.users = _.uniq(newsgroup.users);
	
	// Checks the `url` is unique for this namespace
	if(Smartix.Groups.Collection.find({
		namespace: newsgroup.namesapce,
		url: newsgroup.url
	}).count() > 0) {
		return false;
		// Optional: Throw error saying URL already exists
	};

	return Smartix.Groups.createGroup(newsgroup);
}

Smartix.Newsgroup.editNewsgroup = function (id, options) {

	// Checks that `id` is of type String
	check(id, String);

	// Checks that `options` is an object
	check(options, Object);
	
	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)

	if(!Smartix.Accounts.isUserSchoolAdmin(namespace)) {
		return false;
		// Optional: Throw an appropriate error if not
	}

	// Get the existing newsgroup
	var existingNewsgroup = Smartix.Groups.Collection.findOne({
		_id: id
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
			namespace: existingNewsgroup.namesapce,
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

Smartix.Newsgroup.deleteNewsgroup = function (id) {

	// Checks that `id` is of type String
	check(id, String);

	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)
	Smartix.Accounts.isUserSchoolAdminForGroup(id);

	// Remove the newsgroup specified
	Smartix.Groups.deleteGroup(id);
}

Smartix.Newsgroup.addUsersToGroup = function (id, users) {

	// Checks that `id` is of type String
	check(id, String);

	// Checks that `users` is an array of Strings
	check(users, [String]);

	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)
	Smartix.Accounts.isUserSchoolAdminForGroup(id);

	// Add users to group
	Smartix.Groups.addUsersToGroup(id, users);
}

Smartix.Newsgroup.removeUsersToGroup = function (id, users) {
	
	// Checks that `id` is of type String
	check(id, String);

	// Checks that `users` is an array of Strings
	check(users, [String]);

	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)
	Smartix.Accounts.isUserSchoolAdminForGroup(id);

	// Add users to group
	Smartix.Groups.removeUsersFromGroup(id, users);
}