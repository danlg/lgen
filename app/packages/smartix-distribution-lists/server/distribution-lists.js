Smartix = Smartix || {};

Smartix.DistributionLists = Smartix.DistributionLists || {};

// Permissions for DistributionLists is simple
// Only admins of the school or the system can change DistributionLists
Smartix.DistributionLists.hasPermission = function (namespace, currentUser) {
    return Smartix.Accounts.School.isAdmin(namespace, currentUser);
};

Smartix.DistributionLists.hasPermissionForList = function (id, currentUser) {
    check(id, String);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    let distributionList = Smartix.Groups.Collection.findOne({
        _id: id
    });
    if(!distributionList) {
        throw new Meteor.Error('list-not-found', "The distribution list with id of " + id + " could not be found.");
    }
	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)
    return Smartix.DistributionLists.hasPermission(distributionList.namespace, currentUser);
 	// Optional: Throw an appropriate error if not
};

Smartix.DistributionLists.createDistributionList = function (options, currentUser) {
    check(options, {
        users: [String],
        namespace: String,
        name: String,
        url: Match.Maybe(String),
        expectDuplicates: Boolean,
        upsert: Boolean
    });
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)
	if(!Smartix.DistributionLists.hasPermission(options.namespace, currentUser)) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
		// return false;
	}
    // Checks that a distribution list with the same name have not been created already
    let groupWithSameName = Smartix.Groups.Collection.findOne({
        name: options.name,
        type: "distributionList",
        namespace: options.namespace
    });
    if(groupWithSameName) {
        if(options.expectDuplicates) {
            if(options.upsert) {
                // Adds the users specified to the list
                Smartix.DistributionLists.addUsersToList(groupWithSameName._id, options.users, currentUser);
            }
            return false;
        } else {
            throw new Meteor.Error('list-already-exists', "The distribution list with the name " + options.name + " already exists.")
        }
    }
    // If the URL is not specified, automatically generate one
    if(!options.url) {
        options.url = Smartix.Utilities.stringToLetterCase(options.name);
    }
    // Checks that a distribution list with the same url have not been created already
    let groupWithSameURL = Smartix.Groups.Collection.findOne({
        url: options.url,
        type: "distributionList",
        namespace: options.namespace
    });
    if(groupWithSameURL) {
        if(options.expectDuplicates) {
            if(options.upsert) {
                // Adds the users specified to the list
                Smartix.DistributionLists.addUsersToList(groupWithSameURL._id, options.users, currentUser);
            }
            return false;
        } else {
            throw new Meteor.Error('list-already-exists', "The distribution list with the url " + options.url + " already exists.")
        }
    }

	// Creating distribution list document to be inserted
	var distributionList = {};
	distributionList.users = options.users;
	distributionList.namespace = options.namespace;
	distributionList.type = 'distributionList';
	distributionList.name = options.name;
	distributionList.url = options.url;
    
	// Checks the arguments are of the specified type, convert it if not
	Smartix.DistributionLists.Schema.clean(distributionList);
	// Checks are done in one go
	check(distributionList, Smartix.DistributionLists.Schema);
	// Remove duplicates from the `users` array
	distributionList.users = _.uniq(distributionList.users);
    // Create the distribution list
    return Smartix.Groups.createGroup(distributionList);
};

Smartix.DistributionLists.editDistributionList = function (id, options, currentUser) {
    check(id, String);
    check(options, Object);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    // Checks permission
    if(!Smartix.DistributionLists.hasPermissionForList(id, currentUser)) {
		return false;
		// Optional: Throw an appropriate error if not
	}
    // Only can change name and URL
    let newOptions = {};
    if(options.name) {
        newOptions.name = options.name;
    }
    if(options.url) {
        newOptions.url = options.url;
    }
    return Smartix.Groups.update({
        _id: id
    }, {
        $set: newOptions
    });
};

Smartix.DistributionLists.removeDistributionList = function (id, currentUser) {
	// Checks that `id` is of type String
	check(id, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    // Checks permission
    if(!Smartix.DistributionLists.hasPermissionForList(id, currentUser)) {
		return false;
		// Optional: Throw an appropriate error if not
	}
	// Remove the distribution list specified
	Smartix.Groups.deleteGroup(id);
};

Smartix.DistributionLists.addUsersToList = function (id, users, currentUser) {
	// Checks that `id` is of type String
	check(id, String);
	// Checks that `users` is an array of Strings
	check(users, [String]);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    // Checks permission
    if(!Smartix.DistributionLists.hasPermissionForList(id, currentUser)) {
		return false;
		// Optional: Throw an appropriate error if not
	}
	// Add users to group
	Smartix.Groups.addUsersToGroup(id, users);
};

Smartix.DistributionLists.removeUsersFromList = function (id, users, currentUser) {
	// Checks that `id` is of type String
	check(id, String);
	// Checks that `users` is an array of Strings
	check(users, [String]);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
	// Checks permission
    if(!Smartix.DistributionLists.hasPermissionForList(id, currentUser)) {
		return false;
		// Optional: Throw an appropriate error if not
	}
	// Remove users from group
	Smartix.Groups.removeUsersFromGroup(id, users);
};

Smartix.DistributionLists.getDistributionListsOfUser = function (userId) {
    // Get all distribution lists to which a user belongs to
    let distributionListsOfUser = Smartix.Groups.Collection.find({
        type: 'distributionList',
        users: userId
    }).fetch();
    
    return _.map(distributionListsOfUser, function(list) {
        return list._id;
    })
}

Smartix.DistributionLists.getUsersInDistributionLists = function (distributionLists) {
    return _.uniq(_.reduce(distributionLists, function (users, list) {
        users = _.concat(users, list.users);
    }, []));
}

// Remove non-existent distribution lists from the array
Smartix.DistributionLists.removeNonExistentDistributionLists = function (lists) {
    // Checks `users` is an array of Strings
    check(lists, [String]);

    // Checks if all the lists exists
    if (lists.length === Smartix.Groups.Collection.find({
        type: "distributionList",
        _id: {
            $in: lists
        }
    }).count()) {
        // If all lists exists, return the `users` array as-is
        return lists;
    } else {
        // If not all users exists, filter the `users` array
        // to include only existing users
        return _.filter(lists, function (listId, i, array) {
            // This will return `undefined` if no user is found
            return Smartix.Groups.Collection.findOne({
                type: "distributionList",
                _id: listId
            });
        });
    }
}
