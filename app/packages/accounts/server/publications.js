// Publish all roles to the client without requiring a subscription
Meteor.publish(null, function (){
    return Meteor.roles.find({})
});

Meteor.publish('smartix:accounts/ownUserData', function () {
    return Meteor.users.find({
        _id: this.userId
    });
});

Meteor.publish('smartix:accounts/basicInfoOfAllUsersInNamespace', function (namespace) {
    
    check(namespace, String);
    
    var hasPermission;
    
    // Pass the permission checks to the corresponding child package
    switch(namespace) {
        case 'system':
            // Check permissions on `smartix:accounts-system`
            hasPermission = Smartix.Accounts.System.canGetBasicInfoOfAllUsers(this.userId);
            break;
        case 'global':
            // Check permission on `smartix:accounts-global`
            hasPermission = Smartix.Accounts.Global.canGetBasicInfoOfAllUsers(this.userId);
            break;
        default:
            // Pass checking permissions to `smartix:accounts-school`
            hasPermission = Smartix.Accounts.School.canGetBasicInfoOfAllUsers(namespace, this.userId);
    }
    
    if(hasPermission) {
        var allUsersInNamespace = Roles.getUsersInRole(['user',
            Smartix.Accounts.School.ADMIN,
            Smartix.Accounts.School.STUDENT,
            Smartix.Accounts.School.PARENT,
            Smartix.Accounts.School.TEACHER], namespace).fetch();
        var allUserIdsInNamespace = _.map(allUsersInNamespace, '_id');
        
        // Remove the current user from the list of id's
        var currentUserIndexInArray = allUserIdsInNamespace.indexOf(this.userId);
        if (currentUserIndexInArray > -1) {
            allUserIdsInNamespace.splice(currentUserIndexInArray, 1);
        }
        
        return Meteor.users.find({
            _id: {
                $in: allUserIdsInNamespace
            },
            schools: namespace
        }, {
            fields: { 
                'profile.firstName': 1,
                'profile.lastName': 1,
                'emails.0.address': 1,
                'roles':1
            }
        });
    } else {
        this.ready();
    }
});

Meteor.publish('smartix:accounts/allUsersInNamespace', function (namespace) {
    var allUsers = Smartix.Accounts.getAllUsersInNamespace(namespace, this.userId);
    if(allUsers) {
        return allUsers;
    } else {
        this.ready();
    }
});


Meteor.publish('smartix:accounts/getUserInNamespace', function (userId, namespace) {
    
    check(userId, Match.Maybe(String));
    check(namespace, String);
    
    var hasPermission;
    
    // Pass the permission checks to the corresponding child package
    switch(namespace) {
        case 'system':
            // Check permissions on `smartix:accounts-system`
            hasPermission = Smartix.Accounts.System.canGetUserInfo(userId, this.userId);
            break;
        case 'global':
            // Check permission on `smartix:accounts-global`
            hasPermission = Smartix.Accounts.Global.canGetUserInfo(userId, this.userId);
            break;
        default:
            // Pass checking permissions to `smartix:accounts-school`
            hasPermission = Smartix.Accounts.School.canGetUserInfo(userId, namespace, this.userId);
    }
    
    if(hasPermission) {
        return Meteor.users.find({
            _id: userId,
            schools: namespace
        });
    } else {
        this.ready();
    }
});