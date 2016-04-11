var createFirstSystemAdmin = function() {
    // Create first system admin user when initializing
    if (Roles.getUsersInRole('admin','system').count() ==0) {
        var id;
        var initialPw = Random.id();
        id = Accounts.createUser({
            username: 'admin',
            password: 'admin'
        });
        //TODO prompt to change password the first time you logon
        Roles.addUsersToRoles(id, ['admin'], 'system');
        //warning not secure !! remove this logging code in prod
        //console.log('system admin has been created: ', "admin" ," ",initialPw);
    }
};

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
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        createFirstSystemAdmin();
    });
}  

Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};

Smartix.Accounts.isUserSystemAdmin = function(user){
    var userToBeChecked = user || Meteor.userId();
    return Roles.userIsInRole(userToBeChecked,'admin','system');
};
