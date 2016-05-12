Template.AdminUsersAdd.events({
    'click #addUser-submit': function(event, template) {
        event.preventDefault();
        var newUserObj = {};
        newUserObj.profile = {};

        var email = template.$('#addUser-email').eq(0).val();
        var roles = template.$('#addUser-roles').eq(0).val();
        newUserObj.profile.firstName = template.$('#addUser-firstName').eq(0).val();
        newUserObj.profile.lastName = template.$('#addUser-lastName').eq(0).val();
        
        // If the first name or last name is not filled indexOf
        // Throw an error as they are required fields
        if(!newUserObj.profile.firstName
        || !newUserObj.profile.lastName) {
            toastr.error(TAPi18n.__("requiredFields"));
            return false;
        }

        var dateFieldVal = template.$('#addUser-dob').eq(0).val();

        // If the user is a student
        // DOB is required
        if (roles.indexOf('student') > -1
            && dateFieldVal === "") {
            toastr.error(TAPi18n.__("admin.users.add.studentDobRequired"));
            return false;
        }

        if (dateFieldVal !== "") {
            newUserObj.dob = moment(new Date(template.$('#addUser-dob').eq(0).val())).format('DD-MM-YYYY');
        }

        var telFieldVal = template.$('#addUser-tel').eq(0).val();

        if (telFieldVal !== "") {
            newUserObj.tel = template.$('#addUser-tel').eq(0).val();
        }

        // Check that the arguments are of the correct type
        check(email, Match.Where(function(val) {
            check(val, String);
            return SimpleSchema.RegEx.Email.test(val);
        }));
        check(roles, [String]);
        check(newUserObj, {
            profile: Object,
            dob: Match.Maybe(String),
            tel: Match.Maybe(String)
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
                roles,
                true, function(err, res) {
                    if (!err) {
                        toastr.info(TAPi18n.__("admin.users.add.addSuccess"));
                    }
                });
        }
    }
});