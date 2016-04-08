var createFirstSystemAdmin = function() {
    // Create first system admin user when initializing
    if (Roles.getUsersInRole('admin','system').count() ==0) {
    
        var id;
        id = Accounts.createUser({
            username: 'admin',
            password: "admin",
        });
        Roles.addUsersToRoles(id, ['admin'], 'system');
        console.log('system admin has been created: ',id);
    }
}

if (Meteor.isServer) {
    Meteor.methods({
        'smartix:accounts-system/assignSystemAdmin':function(users){
            if(!Roles.userIsInRole(Meteor.userId(),'admin','system')){
                console.log(NO_PERMISSION_ERROR);
                return;
            }
            Roles.addUsersToRoles(users,['admin'],'system');
        },
        'smartix:accounts-system/unassignSystemAdmin':function(users){
            if(!Roles.userIsInRole(Meteor.userId(),'admin','system')){
                console.log(NO_PERMISSION_ERROR);               
                return;
            }
            Roles.removeUsersToRoles(users,'admin','system');                       
        }, 
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        createFirstSystemAdmin();
    });
}  

Smartix = Smartix || {};
Smartix.accounts = Smartix.accounts || {};

Smartix.accounts.isUserSystemAdmin = function(user){
    
    var userToBeChecked = user || Meteor.userId();
    return Roles.userIsInRole(userToBeChecked,'admin','system');
}
