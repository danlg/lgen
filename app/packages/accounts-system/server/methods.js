Meteor.methods({
    'smartix:accounts-system/assignSystemAdmin': function (users){
        if(!Roles.userIsInRole(Meteor.userId(),'admin','system')){
            console.log(NO_PERMISSION_ERROR);
            return;
        }
        Roles.addUsersToRoles(users,['admin'],'system');
    },
    'smartix:accounts-system/unassignSystemAdmin': function (users){
        if(!Roles.userIsInRole(Meteor.userId(),'admin','system')){
            console.log(NO_PERMISSION_ERROR);               
            return;
        }
        Roles.removeUsersToRoles(users, 'admin', 'system');                       
    }
});