Match.Maybe = Match.Maybe || Match.Optional;

Smartix = Smartix || {};

Smartix.Chat = Smartix.Chat || {};

Smartix.Chat.Schema = new SimpleSchema({
	users: {
		type: [String]
	},
	namespace: {
		type: String
	},
	type: {
		type: String,
		defaultValue: 'chat'
	},
	name: {
		type: String,
		optional: true
	},
    chatRoomAvatar:{
        type: String, 
        optional: true
    },    
	addons: {
		type: [String],
		optional: true,
		defaultValue: {}
	},
	admins: {
		type: [String],
		minCount: 1
	},
    createdAt: {
        type: Date,
        autoValue: function () {
                return new Date();
        }
    },
    createdBy: {
        type: String,
        optional: false,
        autoValue: function () {
            return Meteor.userId();
        }
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

Smartix.Chat.getChatOfUser = function (id) {
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
			type: 'chat',
			users: id,
			namespace: Smartix.Acccounts.listUserSchools(id)
		})
	}
}

Smartix.Chat.canCreateChat = function (namespace, currentUser) {
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    currentUser = currentUser || Meteor.userId();
    
    var userToBeChecked = currentUser || Meteor.userId();
    return Smartix.Accounts.School.isTeacher(namespace, currentUser)
        || Smartix.Accounts.School.isAdmin(namespace, currentUser)
        || Smartix.Accounts.System.isAdmin(currentUser);
}

Smartix.Chat.createChat = function (chatObj) {

	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)

	if(chatObj.namespace !== 'global'
        && !Smartix.Chat.canCreateChat(chatObj.namespace)) {
		return false;
		// Optional: Throw an appropriate error if not
	}

	// Creating Chat document to be inserted
	var Chat = {};
	Chat.users = chatObj.users;
	Chat.namespace = chatObj.namespace;
	Chat.type = 'chat';
	Chat.name = chatObj.name;
	Chat.admins = [
		Meteor.userId()
	];
    Chat.addons = ['voice','images','documents'];

	// Checks the arguments are of the specified type, convert it if not
	Smartix.Chat.Schema.clean(Chat);

	// Checks are done in one go
	check(Chat, Smartix.Chat.Schema);

	// Remove duplicates from the `users` array
	Chat.users = _.uniq(Chat.users);
	
	// Checks the `url` is unique for this namespace
	if(Smartix.Groups.Collection.find({
		namespace: Chat.namesapce,
		url: Chat.url
	}).count() > 0) {
		return false;
		// Optional: Throw error saying URL already exists
	};

	return Smartix.Groups.createGroup(Chat);
}

Smartix.Chat.editChat = function (id, options) {

	// Checks that `id` is of type String
	check(id, String);

	// Checks that `options` is an object
	check(options, Object);
	
	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)

	if(!Smartix.Accounts.School.isAdmin(namespace)) {
		return false;
		// Optional: Throw an appropriate error if not
	}

	// Get the existing Chat
	var existingChat = Smartix.Groups.Collection.findOne({
		_id: id
	});

	var updateObj = {};

	if (options.users) {
		check(options.users, [String]);

		// Remove non-existent users
		updateObj.users = Smartix.Accounts.Utilities.removeNonExistentUsers(options.users);
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
			namespace: existingChat.namesapce,
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

Smartix.Chat.deleteChat = function (id) {

	// Checks that `id` is of type String
	check(id, String);

	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)
	Smartix.Accounts.isUserSchoolAdminForGroup(id);

	// Remove the Chat specified
	Smartix.Groups.deleteGroup(id);
}

Smartix.Chat.addUsersToGroup = function (id, users) {

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

Smartix.Chat.removeUsersToGroup = function (id, users) {
	
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