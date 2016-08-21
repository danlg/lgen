Template.AdminUsersView.onCreated(function () {
    var self = this;
    var userId = Router.current().params.uid;
    var schoolUsername = UI._globalHelpers['getCurrentSchoolName']();
    var schoolId = UI._globalHelpers['getCurrentSchoolId']();
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
        //log.info(this);
        if(this.emails && Array.isArray(this.emails)) {
            return this.emails[0].address;
        }
    },
    userRoles: function () {
        // Get the `_id` of the school from its username
        var schoolNamespace = UI._globalHelpers['getCurrentSchoolId']();
        var user = Meteor.users.findOne({ _id: Router.current().params.uid });
        if(user && user.roles[schoolNamespace]) {
            return user.roles[schoolNamespace].toString()
        } else {
            return false;
        }
    },

    userIsChild:function(){
        let schoolNamespace = UI._globalHelpers['getCurrentSchoolId']();
        let user = Meteor.users.findOne({ _id: Router.current().params.uid });
        if(user && user.roles[schoolNamespace]) {
            let isStudent =  ( user.roles[schoolNamespace].indexOf(Smartix.Accounts.School.STUDENT) > -1);
            //log.info("userIsChild="+ isStudent);
            return isStudent;
        }
        return false;
    }
});

var isStudent = () => {
    let schoolNamespace = UI._globalHelpers['getCurrentSchoolId']();
    let user = Meteor.users.findOne({ _id: Router.current().params.uid });
    if(user && user.roles[schoolNamespace]) {
        let isStudent =  ( user.roles[schoolNamespace].indexOf(Smartix.Accounts.School.STUDENT) > -1);
        //log.info("userIsChild="+ isStudent);
        return isStudent;
    }
    return false;
};

var initTelephone = function (template) {
    // Initialize intl-tel-input
    template.$("#AdminUsers__tel").intlTelInput({
        // Enable GEO lookup using ipinfo
        geoIpLookup: function(callback) {
            $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        },
        // Add a couple of countries to the most popular countries (displayed first)
        preferredCountries: ["hk", "us", "gb", "fr", "in"]
    });
};

Template.AdminUsersView.events({
    'click #AdminUsers__dob': function(event, template) {
        event.preventDefault();
        template.$("#AdminUsers__dob").pickadate({
                labelMonthNext: 'Go to the next month',
                labelMonthPrev: 'Go to the previous month',
                labelMonthSelect: 'Pick a month from the dropdown',
                labelYearSelect: 'Pick a year from the dropdown',
                selectMonths: true,
                selectYears: true,
                format: 'dd-mm-yyyy',
                editable:true,
                //should be Today() - 20 Years
                min: new Date(1991,01,01),
                //should be Today() -2 Years
                max: new Date(2015,01,01)
            }
        );
    },

    'click #AdminUsers__tel': function(event, template) {
        initTelephone(template);
    },

    'click #UpdateUser__submit': function(event, template)
    {
        event.preventDefault();
                // Create new object to store user info
        var newUserObj = {};
        newUserObj.profile = {};// Get the first name and last name
        newUserObj.profile.firstName = template.$('#AdminUsers__firstName').eq(0).val();
        newUserObj.profile.lastName = template.$('#AdminUsers__lastName').eq(0).val();

        initTelephone(template);//to parse the telephone and transform object -> string
        
        var dateFieldVal = template.$('#AdminUsers__dob').eq(0).val();
        if (dateFieldVal === ""
            && isStudent ()
            //&& Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.STUDENT, namespace)||
        ) {
            toastr.error(TAPi18n.__("Admin.StudentDobRequired"));
            return false;
        } else {
            newUserObj.dob = moment(new Date(template.$('#AdminUsers__dob').eq(0).val())).format('DD-MM-YYYY');
        }
        if ( isStudent() ) {
            newUserObj.classroom = template.$('#AdminUsers__classroom').eq(0).val();
            newUserObj.grade     = template.$('#AdminUsers__grade').eq(0).val();
            newUserObj.studentId = template.$('#AdminUsers__studentId').eq(0).val();
        }
        // Retrieve the username, or generate one
        newUserObj.username = template.$('#AdminUser__username').eq(0).val();
        newUserObj.tel = template.$('#AdminUsers__tel').intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);
        
        let newEmail = template.$('#AdminUser__email').eq(0).val().trim();
        if ( parseEmail(newEmail)) {
            newUserObj.emails = [];
            newUserObj.emails[0] = { address: newEmail, verified: true};
            newUserObj.registered_emails = [];
            newUserObj.registered_emails[0] = { address: newEmail, verified: true};
        }
        else if (newEmail !== "") {
            log.warn("Didn't parse new email", newEmail);
            return false;
        }
        //else{log.info("email optional", newEmail);}
        //TODO warning - Bug to delete email - cannot be deleted - remains
        if (this.emails && this.emails[0]) {
            log.info("Updating email from ", this.emails[0].address," -> ", newEmail);
        }
        else{
            log.info("Updating email from ", " -> ", newEmail);
        }
        
        // First Name, Last Name and DOB are required.
        // DOB were already checked above
        // If the first name or last name is not filledb throw an error as they are required fields
        if(!newUserObj.profile.firstName
        || !newUserObj.profile.lastName) {
            toastr.error(TAPi18n.__("requiredFields"));
            return false;
        }
        // check(newUserObj, {
        //     profile: Object,
        //     dob: Match.Maybe(String), //only for student
        //     tel: Match.Maybe(String),
        //     password: Match.Maybe(String),
        //     username: Match.Maybe(String)
        // });
        newUserObj.schoolNamespace = UI._globalHelpers['getCurrentSchoolId']();


        //log.info("calling smartix:accounts/editUser", newUserObj);
        // Call the Meteor method to create the school user
        Meteor.call(
            'smartix:accounts/editUser',
            Router.current().params.uid,           
            newUserObj,
            function(err, res) {
                if (!err) {
                    toastr.info(TAPi18n.__("Admin.UpdateSuccess"));
                } else {
                    toastr.info(TAPi18n.__("Admin.UpdateFail"));
                    log.error(err);
                }
            }
        );
    }
});

// If email is not present, password must be set
var parseEmail = (email) => {
    if(email.length > 0) {
        if(Match.test(email, Match.Where(function(val) {
                check(val, String);
                return SimpleSchema.RegEx.Email.test(val);
            })))
        {
            return true;
        }
        else {
            // Email does not pass validation, Remove the email value
            toastr.error(TAPi18n.__("EmailFormatNotCorrect"));
            return false;
        }
    }
};