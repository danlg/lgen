Smartix = Smartix || {};

Smartix.Groups = Smartix.Groups || {};

Smartix.Groups.createGroup = function (options) {
    log.info('Smartix.Groups.createGroup',options);
    
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
    //?? input is string array not object array
    //options.addons = _.uniqBy(options.addons, 'type');
    options.addons = _.uniq(options.addons);
    
	// Insert the group object into `smartix:groups` collection
	// and return the newly-generated `_id`
	return Smartix.Groups.Collection.insert(options);
};

Smartix.Groups.editGroup = function (id, options) {

	// Checks the new object properties conforms to the schema
	if(options.users) {
		check(options.users, [String]);

		// Remove duplicates from the `users` array
		options.users = _.uniq(options.users);
	}
	if(options.namespace) {
		check(options.namespace, String);
	}
	if(options.type) {
		check(options.type, String);
	}
	if(options.name) {
		check(options.name, String);
	}
	if(options.addons) {
		check(options.addons, [String]);

		// Remove duplicates from the `addons` arrays
		// ensuring only one (the first encountered) add-on of each type is included
		options.addons = _.uniqBy(options.addons, 'type');
	}

	// Update the group object using `$set`
	Smartix.Groups.Collection.update({
		_id: id
	}, {
		$set: options
	});
};

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
	users = Smartix.Accounts.Utilities.removeNonExistentUsers(users);

	// Push (using `$addToSet`) the new users to the existing `users` array
	Smartix.Groups.Collection.update({
		_id: id
	}, {
		
			$addToSet: {
				users: {
					$each: users
				}
			}
		
	});

	// TODO: Remove duplicates from the `users` array
}

Smartix.Groups.removeUsersFromGroup = function(id, users) {
    // Checks that `id` is of type String
    check(id, String);

    // Checks that `users` is an array of Strings
    check(users, [String]);

    // Pull the users from the existing `users` array
    Smartix.Groups.Collection.update({
        _id: id
    }, {
        $pullAll: {
            users: users
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

Smartix.Accounts.isUserSchoolAdminForGroup = function(id, currentUser){

	// Checks that `id` is of type String
	check(id, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Get the existing group in order to get the namespace
	var existingGroup = Smartix.Groups.Collection.findOne({
		_id: id
	});

	// If there is no group with the `id` specified, return `false`
	if(!existingGroup) {
		return false;
	}

	// If the user is not an admin of the school, return `false`
	if(!Smartix.Accounts.School.isAdmin(existingGroup.namespace, currentUser)) {
		return false;
	}

	return true;
}