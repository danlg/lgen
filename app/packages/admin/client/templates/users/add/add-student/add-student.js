Template.AdminUsersAddStudent.onCreated(function () {
    
});

Template.AdminUsersAddStudent.onRendered(function(){
    //initialize pickadate in this page
    $('.pickadate').pickadate({
            labelMonthNext: 'Go to the next month',
            labelMonthPrev: 'Go to the previous month',
            labelMonthSelect: 'Pick a month from the dropdown',
            labelYearSelect: 'Pick a year from the dropdown',
            selectMonths: true,
            selectYears: 40,
            editable:true
        }
    );
    
    $("#addStudent-tel").intlTelInput({
        geoIpLookup: function(callback) {
            $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        },
        preferredCountries: ["hk", "us", "gb"]
    });
});

Template.AdminUsersAddStudent.events({
    'click #addRelationship': function (event, template) {
        Blaze.render(Template.AddStudentNewRelationship, template.find('#newRelationships__container'), event.currentTarget);
    },
    'click #addStudent-submit': function(event, template) {
        event.preventDefault();
        
        // Go through each `addUser-newRelationship` block and checks that fields are complete
        $('.addUser-newRelationship').each(function (i, el) {
            var firstName = $(el).find('.addStudent__newRelationship-firstName').eq(0).val();
            var lastName = $(el).find('.addStudent__newRelationship-lastName').eq(0).val();
            var email = $(el).find('.addStudent__newRelationship-email').eq(0).val();
            var tel = $(el).find('.addStudent__newRelationship-phone').eq(0).val();
            var type = $(el).find('.addStudent__newRelationship-type').eq(0).val();
            
            console.log(firstName);
            console.log(lastName);
            console.log(email);
            console.log(tel);
            console.log(type);
            
            if(
                firstName.length < 1
            || lastName.length < 1
            || email.length < 1
            // || tel.length < 1
            || type.length < 1
            ) {
                
            }
        });
        
        
        var newUserObj = {};
        newUserObj.profile = {};

        var email = template.$('#addUser-email').eq(0).val();
        var roles = ['student'];
        let firstName = newUserObj.profile.firstName = template.$('#addUser-firstName').eq(0).val();
        let lastName = newUserObj.profile.lastName = template.$('#addUser-lastName').eq(0).val();
        let username = template.$('#addUser-username').eq(0).val();
	    newUserObj.username = username ?  username : Smartix.Accounts.helpers.generateUniqueUserName(firstName, lastName);

        // If the first name or last name is not filled indexOf
        // Throw an error as they are required fields
        if(!newUserObj.profile.firstName
        || !newUserObj.profile.lastName) {
            toastr.error(TAPi18n.__("requiredFields"));
            return false;
        }

        // If the user is a student, DOB is required
        var dateFieldVal = template.$('#addUser-dob_hidden').eq(0).val();
        if (dateFieldVal === "") {
            toastr.error(TAPi18n.__("admin.users.add.studentDobRequired"));
            return false;
        } else {
            newUserObj.dob = moment(new Date(template.$('#addUser-dob_hidden').eq(0).val())).format('DD-MM-YYYY');
        }

        var password = template.$('#password').eq(0).val();
        if(password.length < 4) {
            toastr.error("Please provide a password with at least 4 characters");
            return;
        } else {
            newUserObj.password = password;
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
            tel: Match.Maybe(String),
            password: Match.Maybe(String),
	        username: Match.Maybe(String)
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
                true, //autoEmailVerified
                function(err, res) {
                    if (!err) {
                        toastr.info(TAPi18n.__("admin.users.add.addSuccess"));
                        
                        // User is created, now we submit each of the parents
                        // Get the parents
                        $('.addStudent__newRelationship-phone').intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);
                    }
                });
        }
    }
})