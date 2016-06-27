Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.System = Smartix.Accounts.System || {};

Meteor.startup(function() {
    // Create first system admin user when first initializing
    var schoolId = Smartix.Accounts.System.createDefaultSchool();
    Smartix.Accounts.System.createFirstAdmin(schoolId);
});

Smartix.Accounts.System.createDefaultSchool = function()
{
    let shortname = 'smartix';
    var defaultSchool = SmartixSchoolsCol.findOne({shortname: shortname});
    if(!defaultSchool)
    {
        try{
            let schoolOptions = {
                _id: 'global',
                createdAt: new Date(),
                shortname: 'smartix',
                fullname: 'Smartix school',
                web: 'www.gosmartix.com',
                email: 'feedback@gosmartix.com',
                active: true,
                preferences: {
                    schoolBackgroundColor:'#3E82F7',
                    schoolTextColor:'#FFFFFF'
                }
            };
            log.info("Creating first school");
            var schoolId = SmartixSchoolsCol.insert(schoolOptions);
            return schoolId;
        }
        catch(err)
        {
            log.error("CreateDefaultSchool", err);
            throw err;
        }
    }
};

Smartix.Accounts.System.createFirstAdmin = function(schoolId) {
    log.info("Creating first admin");
    // If there are no users with the role `admin` for `system`
    if (Roles.getUsersInRole('sysadmin', schoolId).count() === 0) {
        // Generate a new user with the username `admin`
        // and return its `_id`
        var id = Accounts.createUser({
            username: 'sysadmin',
            password: 'genie421'
        });
        
        // Add the newly created user to have the role of system administrator
        //we should get rid school but we get an exception when we do so
        Roles.addUsersToRoles(id, ['sysadmin'] , schoolId);
        Roles.addUsersToRoles(id, ['admin'], schoolId);
        //Roles.addUsersToRoles(id, ['admin'], 'system');
        // Automatically approve,
        // Exception while invoking method 'smartix:schools/getSchoolName' TypeError: Cannot read property 'username' of undefined
        Meteor.users.update({ _id: id }, 
        { $addToSet: { schools: schoolId } });
        // 'profile.firstName': 'System',
        // 'profile.lastName': 'Administrator'
    }
};