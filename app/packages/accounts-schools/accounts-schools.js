Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};

Smartix.Accounts.School = Smartix.Accounts.School || {};

Smartix.Accounts.isUserSchoolAdmin = function(namespace, user){
    var userToBeChecked = user || Meteor.userId();
    // return Roles.userIsInRole(userToBeChecked,'admin',namespace);
    
    return true;
    
}

Smartix.Accounts.isUserSchoolTeacherOrAdmin = function(namespace,user){
    
    var userToBeChecked = user || Meteor.userId();
    return Roles.userIsInRole(userToBeChecked,['admin', 'teacher'],namespace);
}

Smartix.Accounts.isUserSchoolAdminForGroup = function(id){

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
	if(!Smartix.Accounts.isUserSchoolAdmin(existingGroup.namespace)) {
		return false;
	}

	return true;
}
Smartix.Accounts.isUserSchoolMember = function(user, school) {
    var userToBeChecked = user || Meteor.userId();
    return Roles.userIsInRole(userToBeChecked, Smartix.Accounts.ValidSchoolRoles, school);
}

Smartix.Accounts.School.createUser = function (school, options) {
    // Check the arguments provided are of the correct type
    check(school, String);
    check(options, Object);
    
    // Check if the user has permission to
    // create a new user for this school
    // They must either be a school admin
    // Or system admin
    if (!Smartix.Accounts.isUserSchoolAdmin(school) && !Smartix.Accounts.isUserSystemAdmin()){
        console.log(NOT_AUTH);
        throw new Meteor.Error("not-auth", NOT_AUTH);
    }
    
    // Check if the roles indicated are valid roles
    if (!options.roles.every(function (role) {
        return Smartix.Accounts.ValidSchoolRoles.indexOf(role) > -1;
    })) {
        console.log(NOT_VALID_ROLE);
        throw new Meteor.Error("not-valid-role", NOT_VALID_ROLE);
    }
    
    
    var newUserId;
    if (options.email) {
        
        // Check if a user with this email already exists
        var existingUser = Meteor.users.findOne({'emails.0.address':options.email})
        
        // If the user already exists
        // add the user to the role for this school
        // and return the existing user
        if (existingUser) {
            // console.log(TRY_ADD_ROLE_TO_EXISTING_USR)
            Roles.addUsersToRoles(existingUser, options.roles, school);
            return existingUser._id;
        } else {
            
            // If the user is new, generate a new user object
            newUserId =  Accounts.createUser({
                email: options.email,
                profile: options.profile,
                username: Smartix.Accounts.helpers.generateUniqueUserName(options.profile.firstName, options.profile.lastName)
            });                                        
        }
    } else {
        newUserId =  Accounts.createUser({
            profile: options.profile,
            username: Smartix.Accounts.helpers.generateUniqueUserName(options.profile.firstName, options.profile.lastName)
        }); 
    }
    
    Roles.addUsersToRoles(newUserId, options.roles, school);
    
    Accounts.sendEnrollmentEmail(newUserId);
    
    return newUserId;
}