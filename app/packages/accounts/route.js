
SchoolRequired = function(){
    var userGroups = Roles.getGroupsForUser(Meteor.userId())
    if(userGroups.length > 1 && !Session.get('pickedSchoolId')){
        console.log(Session.get('pickedSchoolId'));
        Router.go('SchoolPick');
    }
    this.next();
}
Router.onBeforeAction(SchoolRequired, {
  except: ['language', 'Login', 'EmailSignup', 'EmailSignin','EmailForgetPwd','EmailResetPwd', 'role',
   'Testing', 'Test2','ClassInformationForWebUser','ClassSearchInformationForWebUser',
   'TermsOfService','PrivacyPolicy','TourFromHomePage','Perf','LoginSplash']
});

CheckDob = function(){
    var dob = lodash.get(Meteor.user(), "profile.dob") || "";
    var role = lodash.get(Meteor.user(), "profile.role") || "";
    if ( dob === "" && ( lodash.includes( Roles.getRolesForUser( Meteor.userId() ) , 'student' ) ) ){
      Router.go('Dob');
    }
    this.next();    
}

Router.onBeforeAction(CheckDob, {
  only: ['TabClasses','classDetail']
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