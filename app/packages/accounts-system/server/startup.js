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
    const rs = Meteor.users.find({'username':'sysadmin'});
    const count = rs.count();
    if (count === 0 ) {
        log.info("Creating first sysadmin");
        var id = Accounts.createUser({
            username: 'sysadmin',
            password: 'genie421'
        });
        // Add the newly created user to have the role of system administrator
        Roles.addUsersToRoles(id, ['sysadmin'] , schoolId);
        Roles.addUsersToRoles(id, ['admin'], schoolId);
        Meteor.users.update({ _id: id },
            { $addToSet: { schools: schoolId } });
        // 'profile.firstName': 'System', //this info is not inserted with Accounts.createUser
        // 'profile.lastName': 'Administrator'
    }
    else {
        log.info("Sysadmin already created");
    }
};