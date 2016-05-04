Smartix = Smartix || {};

Smartix.DistributionLists = Smartix.DistributionLists || {};

// Permissions for DistributionLists is simple
// Only admins of the school or the system can change DistributionLists
Smartix.DistributionLists.hasPermission = function (namespace, currentUser) {
    if(!Smartix.Accounts.School.isAdmin(namespace, currentUser)) {
		return false;
	}
    return true;
}

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
    if(!Smartix.DistributionLists.hasPermission(distributionList.namespace, currentUser)) {
		return false;
		// Optional: Throw an appropriate error if not
	}
    return true;
}

Smartix.DistributionLists.createDistributionList = function (users, namespace, name, url, currentUser) {
    
    check(users, [String]);
    check(namespace, String);
    check(name, String);
    check(url, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)
	if(!Smartix.DistributionLists.hasPermission(namespace, currentUser)) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
		// return false;
	}

	// Creating distribution list document to be inserted
	var distributionList = {};
	distributionList.users = users;
	distributionList.namespace = namespace;
	distributionList.type = 'distributionList';
	distributionList.name = name;
	distributionList.url = url;
	
    
	// Checks the arguments are of the specified type, convert it if not
	Smartix.DistributionLists.Schema.clean(distributionList);

	// Checks are done in one go
	check(distributionList, Smartix.DistributionLists.Schema);

	// Remove duplicates from the `users` array
	distributionList.users = _.uniq(distributionList.users);

	// Checks the `url` is unique for this namespace
	if(Smartix.Groups.Collection.find({
		namespace: namespace,
		url: distributionList.url
	}).count() > 0){
        // Throw error saying URL already exists
        throw new Meteor.Error('url-already-exists', 'The Distribution list with the code ' + url + ' already exists. Please pick another one.')
		// return -1;
	} else {
	    return Smartix.Groups.createGroup(distributionList);
	}
}

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
    
}

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
}


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
}

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
}