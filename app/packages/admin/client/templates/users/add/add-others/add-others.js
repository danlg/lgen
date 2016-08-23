Template.AdminAddOthers.events({

    'click #AdminAddOthers__submit': function(event, template) {
        event.preventDefault();
        var newUserObj = {};
        var notifyuserwithemail = template.$('#notifyuserwithemail').is(":checked");
        newUserObj.profile = {};
        newUserObj.profile.firstName = template.$('#AdminAddOthers__firstName').eq(0).val();
        newUserObj.profile.lastName = template.$('#AdminAddOthers__lastName').eq(0).val();
        // Retrieve email
        let email = template.$('#AdminAddOthers__email').eq(0).val().trim().toLowerCase();
        // Retrieve Telephone Number
        newUserObj.tel = template.$('#AdminAddOthers__tel').intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);
        // Retrieve the username, or generate one
        newUserObj.username = template.$('#AdminAddOthers__username').eq(0).val().trim().toLowerCase();
        // Retrieve Roles
        var roles = template.$('#AdminAddOthers__roles').eq(0).val();
        // Retrieve password
        newUserObj.password = template.$('#AdminAddOthers__password').eq(0).val();

        // CHECKS //
        // If the first name or last name is not filled indexOf Throw an error as they are required fields
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
                toastr.error(TAPi18n.__("EmailFormatNotCorrect"));
                return false;
            }
        } else {
            // Email is not present Check if a password is provided
            // If Notify user is ticked, email must be provided
            if(notifyuserwithemail)
            {
                toastr.error(TAPi18n.__("EmailFormatNotCorrect"));
                return false;
            }
            else if(newUserObj.password.length < 4) {
                toastr.error(TAPi18n.__("Admin.ProvideEmailOrPassword"));
                return false;
            }
        }
        check(roles, [String]);
        check(newUserObj, {
            profile: Object,
            dob: Match.Maybe(String),
            tel: Match.Maybe(String),
            password: Match.Maybe(String),
	        username: Match.Maybe(String)
        });
       
        // Call the Meteor method to create the school user
        Meteor.call('smartix:accounts-schools/createSchoolUser',
            email,
            newUserObj,
            UI._globalHelpers['getCurrentSchoolName'](),
            roles,
            true, //autoEmailVerified,
            //TODO implement flag like import to notify user in UI
            notifyuserwithemail,//do not notify
            function(err, res) {
                if (!err) {
                    // Shows success message
                    toastr.info(TAPi18n.__("Admin.AddSuccess"));
                    // Clear the fields
                    $('.AdminAddOthers__input').val('');
                }
                else {
                    toastr.error(err.reason);
                    log.error(err);
                }
            });
    }
});

Template.AdminAddOthers.onRendered(function () {
    $("#AdminAddOthers__tel").intlTelInput({
        geoIpLookup: function(callback) {
            $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        },
        // Add a couple of countries to the most popular countries (displayed first)
        preferredCountries: ["hk", "us", "gb", "fr", "in"]
    });
});