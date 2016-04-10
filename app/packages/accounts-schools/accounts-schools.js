Smartix = Smartix || {};
Smartix.accounts = Smartix.accounts || {};

Smartix.accounts.isUserSchoolAdmin = function(namespace,user){
    
    var userToBeChecked = user || Meteor.userId();
    return Roles.userIsInRole(userToBeChecked,'admin',namespace);
}

Smartix.accounts.isUserSchoolAdminForGroup = function(id){

	// Checks that `id` is of type String
	check(id, String);
    
    // Get the existing group in order to get the namespace
	var existingGroup = Smartix.Groups.Collection.findOne({
		_id: id
	});

	// If there is no group with the `id` specified, return `false`
	if(!existingGroup) {
		return false;
	}

	// If the user is not an admin of the school, return `false`
	if(!Smartix.accounts.isUserSchoolAdmin(existingGroup.namespace)) {
		return false;
	}

	return true;
}