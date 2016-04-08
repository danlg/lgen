var removeNonExistentUsers = function (users) {
	// Checks `users` is an array of Strings
	check(users, [String]);

	// Checks if all the users exists
	if (users.length === Meteor.users.find({
		_id: {
			$in: users
		}
	}).count()) {
		// If all users exists, return the `users` as-is
		return users;
	} else {
		// if not all users exists, filter the `users` array
		// to include only existing users
		return _.filter(users, function (userId, i, array) {
			return Meteor.users.findOne({_id: userId});
		}
	}
}

Smartix = Smartix || {};

Smartix.Groups = Smartix.Groups || {};

Smartix.Groups.Collection = new new Mongo.Collection("smartix:groups");

Smartix.Groups.createGroup = function (options) {
	// Checks the object contains all required fields
	if(!(options.users && options.namespace && options.type)) {
		return false;
	}
	check(options.users, [String]);
	check(options.namespace, String);
	check(options.type, String);
	if(options.name) {
		check(options.name, String);
	}
	if(options.addons) {
		check(options.addons, [String]);
	}

	// Remove duplicates from the `users` array
	options.users = _.uniq(options.users);

	// Remove duplicates from the `addons` arrays
	// ensuring only one (the first encountered) add-on of each type is included
	options.addons = _.uniqBy(options.addons, 'type');

	// Insert the group object into `smartix:groups` collection
	// and return the newly-generated `_id`
	return Smartix.Groups.Collection.insert(options);
}

Smartix.Groups.editGroup = function (id, options) {

	// Checks the new object properties conforms to the schema
	var updateObj = {};
	if(options.users) {
		check(options.users, [String]);
		updateObj.users = options.users;
	}
	if(options.namespace) {
		check(options.namespace, String);
		updateObj.namespace = options.namespace;
	}
	if(options.type) {
		check(options.type, String);
		updateObj.type = options.type;
	}
	if(options.name) {
		check(options.name, String);
		updateObj.name = options.name;
	}
	if(options.addons) {
		check(options.addons, [String]);
		updateObj.addons = options.addons;
	}

	// Remove duplicates from the `users` array
	updateObj.users = _.uniq(updateObj.users);

	// Remove duplicates from the `addons` arrays
	// ensuring only one (the first encountered) add-on of each type is included
	updateObj.addons = _.uniqBy(updateObj.addons, 'type');

	// Update the group object using `$set`
	Smartix.Groups.Collection.update({
		_id: id
	}, {
		$set: updateObj
	});
}

Smartix.Groups.deleteGroup = function (id) {
	// Checks that `id` is of type String
	check(id, String);

	Smartix.Groups.Collection.remove({
		_id: id
	});
}

Smartix.Groups.addUsersToGroup = function (id, users) {
	// Checks that `id` is of type String
	check(id, String);

	// Checks that `users` is an array of Strings
	check(users, [String]);

	// Remove non-existent users from array
	users = removeNonExistentUsers(users);

	// Push (using `$addToSet`) the new users to the existing `users` array
	Smartix.Groups.Collection.update({
		_id: id
	}, {
		{
			$addToSet: {
				users: {
					$each: users
				}
			}
		}
	});

	// TODO: Remove duplicates from the `users` array
}

Smartix.Groups.removeUsersFromGroup = function (id, users) {
	// Checks that `id` is of type String
	check(id, String);

	// Checks that `users` is an array of Strings
	check(users, [String]);

	// Pull the users from the existing `users` array
	Smartix.Groups.Collection.update({
		_id: id
	}, {
		{
			$pull: {
				users: {
					$in: users
				}
			}
		}
	});
}

Smartix.Groups.isUserInGroup = function (user, group) {
	// Checks that `user` is of type String
	check(user, String);

	// Checks that `group` is of type String
	check(group, String);

	// Returns the group object if it exists
	// Returns `undefined` if it does not exist
	return Smartix.Groups.Collection.findOne({
		_id: group,
		users: user
	});
}