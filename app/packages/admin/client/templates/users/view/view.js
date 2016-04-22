Template.AdminUsersView.onCreated(function () {
    var self = this;
    var schoolUsername = Router.current().params.school;
    self.subscribe('schoolInfo', schoolUsername, function () {
        self.subscribe('smartix:accounts/getUserInNamespace', schoolUsername, Router.current().params.uid);
    });
    self.subscribe('mySchools');
});

Template.AdminUsersView.helpers({
    userData: function () {
        return Meteor.users.findOne({
            _id: Router.current().params.uid
        });
    },
    userEmail: function () {
        console.log(this);
        return this.emails[0].address;
    },
    userRoles: function () {
        // Get the `_id` of the school from its username
        var schoolDoc = SmartixSchoolsCol.findOne({
            username: Router.current().params.school
        });
        
        var schoolNamespace = Smartix.Accounts.School.getNamespaceFromSchoolName(Router.current().params.school);
        
        // return Meteor.users.findOne({
        //     _id: Router.current().params.uid
        // }, {
        //     fields: roles
        // }).roles[schoolDoc._id].toString();
        
        var user = Meteor.users.findOne({
            _id: Router.current().params.uid
        });
        
        if(user && user.roles[schoolNamespace]) {
            return user.roles[schoolNamespace].toString()
        } else {
            return false;
        }
    }

});