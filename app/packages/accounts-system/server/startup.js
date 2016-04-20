Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.System = Smartix.Accounts.System || {};

Meteor.startup(function() {
    // Create first system admin user when first initializing
    Smartix.Accounts.System.createFirstAdmin();
});

Smartix.Accounts.System.createFirstAdmin = function() {
    // If there are no users with the role `admin` for `system`
    if (Roles.getUsersInRole('admin','system').count() === 0) {
        // Generate a new user with the username `admin` and password `admin`
        // and return its `_id`
        var id = Accounts.createUser({
            username: 'admin',
            password: 'admin'
        });
        
        // Add the newly created user to have the role of system administrator
        Roles.addUsersToRoles(id, ['admin'], 'system');
        
        // Automatically approve
        Meteor.users.update({
            _id: id
        }, {
            $set: {
                schools: ['system']
            }
        });
    }
};