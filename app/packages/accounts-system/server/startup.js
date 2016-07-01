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
    //the _id must be 'global'
    return 'global';
};

Smartix.Accounts.System.createFirstAdmin = function(schoolId) {
    var systemAdmin = Meteor.users.find({'username':'sysadmin'});
    const count = systemAdmin.count();
    if (count === 0 ) {
        log.info("Creating first sysadmin");
        var id = Accounts.createUser({
            username: 'sysadmin',
            password: 'genie421'
        });
        // Add the newly created user to have the role of system administrator
        Roles.addUsersToRoles(id, ['sysadmin'], schoolId);
        Roles.addUsersToRoles(id, ['admin'], schoolId);
        Roles.addUsersToRoles(id, ['sales'], schoolId);
        Meteor.users.update({ _id: id },
            { $addToSet: { schools: schoolId } });
        // 'profile.firstName': 'System', //this info is not inserted with Accounts.createUser
        // 'profile.lastName': 'Administrator'
    }
    else {
        systemAdmin = systemAdmin.fetch();
        var systemAdminId = systemAdmin[0]._id;
        if(!Roles.userIsInRole(systemAdminId, 'sales', schoolId))
        {
            //db.getCollection('users').find({})[0].roles.global
            Roles.addUsersToRoles(systemAdminId, ['sales'], schoolId);
            Meteor.users.update({ _id: systemAdminId }, { $addToSet: { schools: schoolId } });
            log.info("Added sales role to systemAdmin");
        }
        log.info("Sysadmin already created");
    }
};