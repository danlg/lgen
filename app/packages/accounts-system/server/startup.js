Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.System = Smartix.Accounts.System || {};

Meteor.startup(function() {
    // Create first system admin user when first initializing
    Smartix.Accounts.System.createFirstAdmin();
});

Smartix.Accounts.System.createFirstAdmin = function() {
    // If there are no users with the role `admin` for `system`
    if (Roles.getUsersInRole('sysadmin','global').count() === 0) {
        // Generate a new user with the username `admin`
        // and return its `_id`
        var id = Accounts.createUser({
            username: 'sysadmin',
            password: 'genie421'
        });
        
        // Add the newly created user to have the role of system administrator
        //we should get rid school but we get an exception when we do so
        Roles.addUsersToRoles(id, ['sysadmin'] , 'global');
        //Roles.addUsersToRoles(id, ['admin'], 'system');
        // Automatically approve,
        // Exception while invoking method 'smartix:schools/getSchoolName' TypeError: Cannot read property 'username' of undefined
        Meteor.users.update (
            { _id: id},
            { $set: { schools: ['global'] }
        });
    }
};