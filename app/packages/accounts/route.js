
SchoolRequired = function(){
    var userGroups = Roles.getGroupsForUser(Meteor.userId())
    
    //if user belongs to more than one group, the user needs to choose the school namespace
    if(userGroups.length > 1 && !Session.get('pickedSchoolId')){
        console.log(Session.get('pickedSchoolId'));
        Router.go('SchoolPick');
    }else if(userGroups.length == 1){
    //if user is only belonged to one group only, set pickedSchoolId automatically
        Session.set('pickedSchoolId',userGroups[0]);
    }else{
    //if user does not belonged to any group, user still uses an old account that needs update
    //assign user role in global group
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