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
        var schoolNamespace = UI._globalHelpers['getCurrentSchoolId']();
        var user = Meteor.users.findOne({ _id: Router.current().params.uid });
        if(user && user.roles[schoolNamespace]) {
            var isStudent =  ( user.roles[schoolNamespace].indexOf(Smartix.Accounts.School.STUDENT) > -1);
            //log.info("userIsChild="+ isStudent);
            return isStudent;
        }
        return false;
    }
});

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
        // Add Hong Kong, USA and UK to the most popular countries (displayed first)
        preferredCountries: ["hk", "us", "gb"]
    });
};

Template.AdminUsersView.events({
    'click #AdminUsers__dob': function(event, template)
    {
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

    'click #AdminUsers__tel': function(event, template)
    {
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
        if (dateFieldVal === "") {
            toastr.error(TAPi18n.__("Admin.StudentDobRequired"));
            return false;
        } else {
            newUserObj.dob = moment(new Date(template.$('#AdminUsers__dob').eq(0).val())).format('DD-MM-YYYY');
        }
        // Retrieve Telephone Number
        newUserObj.tel = template.$('#AdminUsers__tel').intlTelInput("getNumber", intlTelInputUtils.numberFormat.E164);
        // Retrieve the username, or generate one
        newUserObj.username = template.$('#AdminUser__username').eq(0).val();
        // First Name, Last Name and DOB are required.
        // DOB were already checked above
        // If the first name or last name is not filledb throw an error as they are required fields
        if(!newUserObj.profile.firstName
        || !newUserObj.profile.lastName) {
            toastr.error(TAPi18n.__("requiredFields"));
            return false;
        }
        check(newUserObj, {
            profile: Object,
            dob: String,
            tel: Match.Maybe(String),
            password: Match.Maybe(String),
            username: Match.Maybe(String)
        });
        newUserObj.schoolNamespace = UI._globalHelpers['getCurrentSchoolId']();
        //log.info(newUserObj);
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