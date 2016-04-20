_ = lodash;

SchoolRequired = function() {
    if(Meteor.isClient) {
        var userGroups = Roles.getGroupsForUser(Meteor.userId())
        
        // If user belongs to more than one group,
        // the user needs to choose the school namespace
        if (userGroups.length > 1
            && !Session.get('pickedSchoolId')) {
            Router.go('SchoolPick');
        } else if (userGroups.length == 1) {
            // If user is only belonged to one group only, set pickedSchoolId automatically
            Session.set('pickedSchoolId', userGroups[0]);
        } else {
            // if user does not belonged to any group, user still uses an old account that needs update
            // assign user role in global group
        }
    }
    this.next();
}

Router.onBeforeAction(SchoolRequired, {
  except: ['language', 'Login', 'EmailSignup', 'EmailSignin','EmailForgetPwd','EmailResetPwd', 'role',
   'Testing', 'Test2','ClassInformationForWebUser','ClassSearchInformationForWebUser',
   'TermsOfService','PrivacyPolicy','TourFromHomePage','Perf','LoginSplash']
});

Roles.ifUserHasRoleInAnyGroup = function (userId, role) {
    
    check(userId, String);
    check(role, String);
    
    var userObj = Meteor.users.findOne({
        _id: userId
    });
    
    if(!userId) {
        return false;
        // OPTIONAL: Throw error indicating the user does not exists
    }
    
    if(!userObj.roles) {
        return false;
    }
    
    var userHasRole = false;
    
    _.each(userObj.roles, function (roles, group) {
        if(!Array.isArray(group)) {
            throw new Error('Roles are formatted incorrectly');
        }
        if(roles.indexOf(role) > -1) {
            userHasRole = true;
        }
    });
    
    return userHasRole;
}

CheckDob = function(){
    var userObj = Meteor.user();
    var dob = userObj.dob;
    var role = _.get(userObj, "profile.role", "");
    if (!!dob
        && Roles.ifUserHasRoleInAnyGroup(userObj._id , 'student')) {
      Router.go('Dob');
    }
    this.next();
}

Router.onBeforeAction(CheckDob, {
  only: ['TabClasses', 'classDetail']
});

Router.route('/email-reset-password', {
  name: "EmailResetPwd"
});

Router.route('/email-forget-password', {
  name: "EmailForgetPwd"
});

Router.route('/login', {
  name: "EmailSignin"
});
Router.route('/signup', {
  name: "EmailSignup"
});

Router.route('Dob');

Router.route('EmailVerification');

Router.route('/splash',{
    name: "LoginSplash"
})

Router.route('SchoolPick');

Router.route('/myaccount',{
    name:"MyAccount"
});