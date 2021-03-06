Smartix = Smartix || {};

Smartix.Newsgroup = Smartix.Newsgroup || {};

Smartix.Newsgroup.getNewsgroupOfUser = function (id, school) {
	if(Match.test(id, String)) {
		// Ensures `id` points to an existing user
		id = !!Meteor.users.findOne({_id: id}) ? id : undefined;
	} else {
		// If `id` is not a string, `undefined`,`null` etc.
		// Use the currently-logged in user
		id = this.userId;
	}
	if(id) {
		var distributionListsUserBelong = Smartix.Groups.Collection.find({type: 'distributionList', users: id }).fetch();
        var distributionListsUserBelongIds = lodash.map(distributionListsUserBelong,'_id');
		let find = Smartix.Groups.Collection.find({$or:
			[
				{
					// namespace: school.username,
					type: 'newsgroup',
					users: id
				},
				{
					// namespace: school.username,
					type: 'newsgroup',
					distributionLists: {$in : distributionListsUserBelongIds },
					optOutUsersFromDistributionLists :{  $nin : [id] }
				}
			]}
		);
		//log.info("Smartix.Newsgroup.getNewsgroupOfUser.count",find.count());
		return find;
	}
};

Smartix.Newsgroup.canCreateNewsgroup = function (namespace, currentUser) {
    if(!Smartix.Accounts.School.isAdmin(namespace, currentUser)) {
			return false;
			// Optional: Throw an appropriate error if not
		}
    return true;
};

Smartix.Newsgroup.canEditNewsgroup = Smartix.Newsgroup.canDeleteNewsgroup = Smartix.Newsgroup.canAddUsersToGroup = Smartix.Newsgroup.canRemoveUsersFromGroup = function (newsgroupId, currentUser) {
    
    check(newsgroupId, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    var existingNewsgroup = Smartix.Groups.Collection.findOne({ _id: newsgroupId });
    if(!existingNewsgroup) {
        throw new Meteor.Error('group-not-found', "The group specified could not be found.")
    }
    if(    Smartix.Accounts.isUserSchoolAdminForGroup(newsgroupId, currentUser)
  		  || Smartix.Accounts.School.isAdmin(existingNewsgroup.namespace, currentUser)) {
        return true;
    }
    return false;
};

Smartix.Newsgroup.createNewsgroup = function (distributionLists, users, namespace, name, url, mandatory, currentUser ) {

	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)
	if(!Smartix.Newsgroup.canCreateNewsgroup(namespace, currentUser)) {
		return false;
		// Optional: Throw an appropriate error if not
	}

	// Creating newsgroup document to be inserted
	var newsgroup = {};
	newsgroup.distributionLists = distributionLists;
	newsgroup.optOutUsersFromDistributionLists = [];
	newsgroup.users = users;
	newsgroup.namespace = namespace;
	newsgroup.type = 'newsgroup';
	newsgroup.name = name;
    
    newsgroup.url = url ? url : Smartix.Utilities.generateUniqueURL(newsgroup.name);
    
	newsgroup.mandatory = mandatory;
	newsgroup.admins = [
		Meteor.userId()
	];
	
	//TODO :remove hardcode
	newsgroup.addons = ['images','calendar','documents'];  //hard code for demo only
	
	// Checks the arguments are of the specified type, convert it if not
	Smartix.Newsgroup.Schema.clean(newsgroup);

	// Checks are done in one go
	check(newsgroup, Smartix.Newsgroup.Schema);

	// Remove duplicates from the `users` array
	newsgroup.users = _.uniq(newsgroup.users);

	// Checks the `url` is unique for this namespace
	if(Smartix.Groups.Collection.find({
		namespace: namespace,
		url: newsgroup.url
	}).count() > 0){
		return -1;
		// Optional: Throw error saying URL already exists
	} else {
	    return Smartix.Groups.createGroup(newsgroup);
	}
};

Smartix.Newsgroup.editNewsgroup = function (id, options, currentUser) {

	// Checks that `id` is of type String
	check(id, String);

	// Checks that `options` is an object
	check(options, Object);
	
	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)

	if(!Smartix.Newsgroup.canEditNewsgroup(id, currentUser)) {
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
			namespace: existingNewsgroup.namesapce,
			url: updateObj.url
		}).count() > 0) {
			return false;
			// OPTIONAL: Throw error saying URL already exists
		}
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
};

Smartix.Newsgroup.deleteNewsgroup = function (id, currentUser) {

	// Checks that `id` is of type String
	check(id, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

	// Checks that the currently-logged in user has
	// administrative priviledges for the namespace it specified
	// (i.e. either the admin for the school, or the system admin)
    if(!Smartix.Newsgroup.canDeleteNewsgroup(id, currentUser)) {
		return false;
		// Optional: Throw an appropriate error if not
	}

	// Remove the newsgroup specified
	Smartix.Groups.deleteGroup(id);
};

Smartix.Newsgroup.deleteNewsgroups = function (ids, currentUser) {

	// Checks that `id` is of type String array
	check(ids, [String]);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
	
	ids.map(function(id){
		// Checks that the currently-logged in user has
		// administrative priviledges for the namespace it specified
		// (i.e. either the admin for the school, or the system admin)
		if(!Smartix.Newsgroup.canDeleteNewsgroup(id, currentUser)) {
			return false;
			// Optional: Throw an appropriate error if not
		}		
	})


	// Remove the newsgroups specified
	Smartix.Groups.deleteGroups(ids);
};

Smartix.Newsgroup.addUsersToGroup = function (id, users, currentUser) {

	// Checks that `id` is of type String
	check(id, String);

	// Checks that `users` is an array of Strings
	check(users, [String]);
    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

	// Checks permissions
    if(!Smartix.Newsgroup.canAddUsersToGroup(id, currentUser)) {
		return false;
		// Optional: Throw an appropriate error if not
	}
    
	// Add users to group
	Smartix.Groups.addUsersToGroup(id, users);
};

Smartix.Newsgroup.removeUsersFromGroup = function (id, users, currentUser) {
	
	// Checks that `id` is of type String
	check(id, String);

	// Checks that `users` is an array of Strings
	check(users, [String]);
    
	check(currentUser, Match.Maybe(String));

	// Get the `_id` of the currently-logged in user
	if(!(currentUser === null)) {
			currentUser = currentUser || Meteor.userId();
	}

	// Checks permissions
    if(!Smartix.Newsgroup.canRemoveUsersFromGroup(id, currentUser)) {
		return false;
		// Optional: Throw an appropriate error if not
	}
	// Remove users from group
	Smartix.Groups.removeUsersFromGroup(id, users);
};

Smartix.Newsgroup.addDistributionListToGroup = function(id,distributionListId){
    if(Smartix.Newsgroup.canEditNewsgroup(id,Meteor.userId())){
        
        //log.info('addDistributionListToGroup',id,distributionListId);
        Smartix.Groups.Collection.update({
            _id: id
        }, {
            $addToSet: {
                distributionLists: distributionListId
            }
        });            
        
    }
};

Smartix.Newsgroup.removeDistributionListToGroup = function(id,distributionListId){
    if(Smartix.Newsgroup.canEditNewsgroup(id,Meteor.userId())){

        //log.info('removeDistributionListToGroup',id,distributionListId);        
        Smartix.Groups.Collection.update({
            _id: id
        }, {
            $pull: {
                distributionLists: distributionListId
            }
        });            
        
    }    
};

