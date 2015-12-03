Template.registerHelper('iconChooseHelper',function(iconArray){
   var COLUMN = 4;
   log.info(iconArray);
   var output=[];
   if(iconArray){    
       var iconArrayLength = iconArray.length;   
       iconArray.forEach(function(currentValue,index){
         //start a row for every COLUMN items
         if((index+1) % COLUMN == 1){
             output.push( "<div class='row'>" );
         }  
         output.push( "<div class='col'><a data-dismiss='modal'><i title='"+currentValue+"' class='icon e1a-"+currentValue+" e1a-5x emojicon'></i></a></div>" );
         //close a row for every COLUMN items
         if((index+1) % COLUMN == 0){     
             output.push( "</div>" );
         }
         //at the end of the for each loop, fill in empty columns so the last row looks nice
         if((index+1) == iconArrayLength){
             var remainCols = (index+1) % COLUMN;     
             while(remainCols > 0){
                 output.push("<div class='col'></div>");
                 if(remainCols == 1){
                     //close a row for the last item
                     output.push("</div>");
                 }
                 remainCols--;
             }          
         }  
       });    
   }
   return output.join("");  
});

Template.registerHelper('formatTime', function(time) {
    var dateString="";
    if(time){  
      //log.info(this);
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

//if user has pending class to join, join and redirect user to tab classes.
//else, just redirect use to tab classes
routeToTabClasses = function(){
    var classToBeJoined = Session.get("search");
    log.info("routeToTabClasses:searching class:"+ classToBeJoined);
    if (classToBeJoined) {
      var doc = {classCode: classToBeJoined};
      //help user to join class
      Meteor.call("class/join", doc, function (error, result) {
        if (error) {
          log.error("class/join:error", error);
        } else {
          Session.set("search","");
        }
      });
    }
    Router.go("TabClasses");
};

registerNewUser = function(email,firstname,lastname,password){
    var userObj = {};
    userObj.profile = {};
    userObj.email = email;
    userObj.profile.firstname = firstname;
    userObj.profile.lastname = lastname;
    userObj.profile.role = ""; //role would be chosen by user later

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
};

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

         var loginServicesConfigured = Accounts.loginServicesConfigured();
         log.info('loginServicesConfigured='+loginServicesConfigured);
         if (err) {
          // set a session variable to display later if there is a login error
          Session.set('loginError', 'reason: ' + err.reason + ' message: ' + err.message || 'Unknown error');
          alert(err.message + ":" + err.reason);
          log.error('login:google:'+ err.reason +" msg="+ err.message);
        }
        else {
          log.info("login:google:" + Meteor.userId());
          if (Meteor.user().profile.role !== ""){
            log.info("user has role");
            routeToTabClasses();
          }
          else{
            //first time user
            log.info("user does not have role");
            Router.go('role');
          }
        }
      });   
};