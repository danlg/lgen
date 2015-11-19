Template.registerHelper('formatTime', function(time) {

    var dateString="";
    if(time){  
     log.info(this);

   
      var fullUnixTime = time;
    
      if (fullUnixTime){
        var trimUnixTime = fullUnixTime.substr(0,10);
        dateString = moment.unix(trimUnixTime).format('h:mm a');
      }       
    }
    return dateString;    
  
});

//how to create a global function in meteor template
//http://stackoverflow.com/questions/29364591/how-to-create-a-global-function-in-meteor-template
//You need to make your function a global identifier to be able to call it across multiple files :


//if user has pending class to join, join and redirect user to the class page.
//else, redirect use to tab classes
routeToTabClassesOrClassDetail = function(){
          
          log.info("routeToTabClassesOrClassDetail");  
          var classToBeJoined = Session.get("search");
          log.info(classToBeJoined);
          if (classToBeJoined) {

            var doc = {classCode: classToBeJoined};
            //help user to join class directly and router go to the class page
            Meteor.call("class/join", doc, function (error, result) {

              log.info(error);
              log.info(result);
              if (error) {
                log.error("error", error);
                Router.go("TabClasses");
              } else {
                Session.set("search","");
                log.info("Redirecting you to the class");
                Router.go("classDetail",{classCode : classToBeJoined});
              }
            });

          } else {
            Router.go("TabClasses");
          }
}

registerNewUser = function(email,firstname,lastname,password){
    
    
    var userObj = {};
    userObj.profile = {};
    userObj.email = email;
    userObj.profile.firstname = firstname;
    userObj.profile.lastname = lastname;
    userObj.profile.role = ""; //role would be chosen by user later
    //userObj.profile.dob = $("#dobInput").val() || "";

    if (!validateEmail(userObj.email)) {
      alert("Incorrect Email");
    } else if (password.length < 4) {
      alert("At least 3 characters Password");
    } else {
      Accounts.createUser({
        email: userObj.email,
        password: password,
        profile: userObj.profile
      }, function (err) {
        if (err) {
          alert(err.reason);
          log.error(err);
        } else{
           
           //if create user is successful, user than needs to choose their role
           Router.go('role');
        
        }
      });

    }
}

registerOrLoginWithGoogle = function(){
     Meteor.loginWithGoogle(
      {
        forceApprovalPrompt: true,
        requestPermissions: ['email'],
        loginStyle: 'popup',
        requestOfflineToken: true
      }
      ,function (err) { // <-- the callback would NOT be called. It only works if loginStyle is popup
                        //see https://github.com/meteor/meteor/blob/devel/packages/accounts-oauth/oauth_client.js Line 16
       
        if (err) {
          // set a session variable to display later if there is a login error
          Session.set('loginError', 'reason: ' + err.reason + ' message: ' + err.message || 'Unknown error');
          alert(err.message + ":" + err.reason);
          log.error('loginWithGoogle err'+ err.reason +" msg="+ err.message);
          var loginServicesConfigured = Accounts.loginServicesConfigured();
          log.info('loginServicesConfigured='+loginServicesConfigured);
        }
        else {
          log.info('loginWithGoogle OK');
          var loginServicesConfigured = Accounts.loginServicesConfigured();
          log.info('loginServicesConfigured='+loginServicesConfigured);

          log.info(Meteor.user())
          
          if (Meteor.user().profile.role !== ""){
            log.info("user has role")
            routeToTabClassesOrClassDetail();
          }
          else{
            //first time user
            log.info("user does not have role")
            Router.go('role');
          }
        }
      });   
}