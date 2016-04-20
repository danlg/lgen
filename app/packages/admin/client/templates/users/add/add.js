Template.AdminUsersAdd.events({
    'click #addUser-submit': function (event, template) {
        event.preventDefault();
        var newUserObj = {};
        newUserObj.profile = {};
        
        var email = template.$('#addUser-email').eq(0).val();
        var roles = template.$('#addUser-roles').eq(0).val();
        newUserObj.profile.firstName = template.$('#addUser-firstName').eq(0).val();
        newUserObj.profile.lastName = template.$('#addUser-lastName').eq(0).val();
        newUserObj.dob = template.$('#addUser-dob').eq(0).val();
        newUserObj.tel = template.$('#addUser-tel').eq(0).val();
        
        check(newUserObj, {
            email: String,
            profile: Object,
            roles: [String]
        });
        
        if (Router
        && Router.current()
        && Router.current().params
        && Router.current().params.school
        ) {
            // Call the Meteor method to create the school user
            Meteor.call('smartix:accounts-schools/createSchoolUser',
                email,
                newUserObj,
                Router.current().params.school,
                roles);
        }
    }
});