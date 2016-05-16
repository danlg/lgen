Template.AdminUsersView.onCreated(function () {
    var self = this;
    var userId = Router.current().params.uid;
    var schoolUsername = Router.current().params.school;
    var schoolId = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolUsername);
    self.subscribe('smartix:accounts/allUsersInNamespace', schoolId );
    self.subscribe('mySchools');
    self.subscribe('userRelationshipsInNamespace', userId,schoolId);
});

Template.AdminUsersView.helpers({
    userData: function () {
        return Meteor.users.findOne({
            _id: Router.current().params.uid
        });
    },
    userEmail: function () {
        log.info(this);
        if(this.emails && Array.isArray(this.emails)) {
            return this.emails[0].address;
        }
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