Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.System = Smartix.Accounts.System || {};

Meteor.startup(function() {
    // Create first system admin user when first initializing
    Smartix.Accounts.System.createGlobalSchool();
});

Smartix.Accounts.System.createGlobalSchool = function()
{
    let shortname = 'smartix';
    let schoolOptions = {
        _id: 'global',
        createdAt: new Date(),
        shortname: 'smartix',
        fullname: 'Smartix',
        web: 'www.gosmartix.com',
        email: 'feedback@gosmartix.com',
        active: true,
        preferences: {
            schoolBackgroundColor:'#3E82F7',
            schoolTextColor:'#FFFFFF'
        }
    };
    var globalSchool = SmartixSchoolsCol.findOne({shortname: shortname});
    if(!globalSchool)
    {
        try{
            var globalSchoolId = SmartixSchoolsCol.insert(schoolOptions);
        }catch(err)
        {
            log.error(err);
            throw err;
        }
    }
    Smartix.Accounts.System.createFirstAdmin(globalSchool._id);
};

Smartix.Accounts.System.createFirstAdmin = function(globalId) {
    // If there are no users with the role `admin` for `system`
    if (Roles.getUsersInRole('sysadmin', globalId).count() === 0) {
        // Generate a new user with the username `admin`
        // and return its `_id`
        var id = Accounts.createUser({
            username: 'sysadmin',
            password: 'genie421',
            'profile.firstName': 'System',
            'profile.lastName': 'Administrator'
        });
        
        // Add the newly created user to have the role of system administrator
        //we should get rid school but we get an exception when we do so
        Roles.addUsersToRoles(id, ['sysadmin'] , globalId);
        Roles.addUsersToRoles(id, ['admin'], globalId);
        //Roles.addUsersToRoles(id, ['admin'], 'system');
        // Automatically approve,
        // Exception while invoking method 'smartix:schools/getSchoolName' TypeError: Cannot read property 'username' of undefined
        Meteor.users.update({ _id: id }, 
        { $addToSet: { schools: globalId } });

    }
};