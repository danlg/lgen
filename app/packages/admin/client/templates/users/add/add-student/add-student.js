Template.AdminAddStudent.onCreated(function () {
    this.currentSchool = Router.current().params.school;
})

Template.AdminAddStudent.onRendered(function(){
    // Initialize pickadate in this page
    this.$('.pickadate').pickadate({
            labelMonthNext: 'Go to the next month',
            labelMonthPrev: 'Go to the previous month',
            labelMonthSelect: 'Pick a month from the dropdown',
            labelYearSelect: 'Pick a year from the dropdown',
            selectMonths: true,
            selectYears: 40,
            editable:true
        }
    );
    
    // Initialize intl-tel-input
    this.$("#AdminAddStudent__tel").intlTelInput({
        // Enable GEO lookup using ipinfo
        geoIpLookup: function(callback) {
            $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        },
        // Add Hong Kong, USA and UK to the most popular countries (displayed first)
        preferredCountries: ["hk", "us", "gb"]
    });
});

var checkAllRelationshipsAreValid = function (template) {
    var passesValidation = true;
    // Go through each `addUser-newRelationship` block and checks that fields are complete
    template.$('.AdminAddStudent__newRelationship').each(function (i, el) {
        var firstName = $(el).find('.AddStudentNewRelationship__firstName').eq(0).val();
        var lastName = $(el).find('.AddStudentNewRelationship__lastName').eq(0).val();
        var email = $(el).find('.AddStudentNewRelationship__email').eq(0).val();
        var tel = $(el).find('.AddStudentNewRelationship__phone').eq(0).val();
        var type = $(el).find('.AddStudentNewRelationship__type').eq(0).val();
        
        if(
            firstName.length < 1
        || lastName.length < 1
        || email.length < 1
        // || tel.length < 1
        || type.length < 1
        ) {
            toastr.error("Please ensure all mandatory parent fields are filled in.");
            passesValidation = false;
        }
    });
    return passesValidation;
}

var createParents = function (studentId, template) {
    // Go through each `addUser-newRelationship` block and checks that fields are complete
    template.$('.AdminAddStudent__newRelationship').each(function (i, el) {
        var parentObj = {};
        parentObj.studentId = studentId;
        parentObj.firstName = $(el).find('.AddStudentNewRelationship__firstName').eq(0).val();
        parentObj.lastName = $(el).find('.AddStudentNewRelationship__lastName').eq(0).val();
        parentObj.email = $(el).find('.AddStudentNewRelationship__email').eq(0).val();
        parentObj.tel = $(el).find('.AddStudentNewRelationship__phone').intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);
        parentObj.type = $(el).find('.AddStudentNewRelationship__type').eq(0).val();
        
        Meteor.call('smartix:accounts-schools/createParent', template.currentSchool, parentObj, false);
    });
}

Template.AdminAddStudent.events({
    'click #AdminAddStudent__addRelationship': function (event, template) {
        Blaze.render(Template.AddStudentNewRelationship, template.find('#AdminAddStudent__newRelationshipsContainer'), event.currentTarget);
    },
    'click #AdminAddStudent__submit': function(event, template) {
        event.preventDefault();
        
        let relCheckRes = checkAllRelationshipsAreValid(template);
        
        if(!relCheckRes) {
            return false;
        }
        
        // Create new object to store user info
        var newUserObj = {};
        newUserObj.profile = {};
        
        // Get the first name and last name
        newUserObj.profile.firstName = template.$('#AdminAddStudent__firstName').eq(0).val();
        newUserObj.profile.lastName = template.$('#AdminAddStudent__lastName').eq(0).val();
        
        var dateFieldVal = template.$('#AdminAddStudent__dob').eq(0).val();
        if (dateFieldVal === "") {
            toastr.error(TAPi18n.__("admin.users.add.studentDobRequired"));
            return false;
        } else {
            newUserObj.dob = moment(new Date(template.$('#AdminAddStudent__dob').eq(0).val())).format('DD-MM-YYYY');
        }
        
        // Retrieve Telephone Number
        newUserObj.tel = template.$('#AdminAddStudent__tel').intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);
        
        // Retrieve the username, or generate one
        newUserObj.username = template.$('#AdminAddStudent__username').eq(0).val();
        
        // Retrieve email
        var email = template.$('#AdminAddStudent__email').eq(0).val();
        
        // Retrieve password
        newUserObj.password = template.$('#AdminAddStudent__password').eq(0).val();
        
        ////////////
        // CHECKS //
        ////////////
        
        // First Name, Last Name and DOB are required.
        // DOB were already checked above
        
        // If the first name or last name is not filled
        // Throw an error as they are required fields
        if(!newUserObj.profile.firstName
        || !newUserObj.profile.lastName) {
            toastr.error(TAPi18n.__("requiredFields"));
            return false;
        }
        
        // If email is not present, password must be set
        if(email.length > 0) {
            if(Match.test(email, Match.Where(function(val) {
                check(val, String);
                return SimpleSchema.RegEx.Email.test(val);
            }))) {
                // Email passes validation
                // Password not required
            } else {
                // Email does not pass validation
                // Remove the email value
                toastr.error("Please ensure the email provided is valid");
                return false;
                
            }
        } else {
            
            // Email is not present
            // Check if a password is provided
                
            if(newUserObj.password.length < 4) {
                toastr.error("Please provide an email or a password with at least 4 characters");
                return false;
            }
        }
        
        
        check(newUserObj, {
            profile: Object,
            dob: String,
            tel: Match.Maybe(String),
            password: Match.Maybe(String),
	        username: Match.Maybe(String)
        });
        
        console.log(newUserObj);

        // Call the Meteor method to create the school user
        Meteor.call(
            'smartix:accounts-schools/createSchoolUser',
            email,
            newUserObj,
            Template.instance().currentSchool,
            ['student'], // Roles
            true, // autoEmailVerified
            function(err, res) {
                if (!err) {
                    toastr.info(TAPi18n.__("admin.users.add.addSuccess"));
                    
                    // User is created, now we submit each of the parents
                    // Create the parent objects
                    // It was already validated before, so should not throw an error
                    createParents(res.id, template);
                } else {
                    console.log(err);
                }
            }
        );
    }
})