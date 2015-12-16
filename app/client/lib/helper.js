/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

var isAndroid = function() {
  //https://github.com/apache/cordova-plugin-device/blob/master/src/android/Device.java
  //http://stackoverflow.com/questions/32076642/meteor-device-detection-android-or-ios
  return Meteor.isCordova && (device.platform.toLowerCase().indexOf("android") > -1);
};

var isIOS = function() {
  //http://stackoverflow.com/questions/32076642/meteor-device-detection-android-or-ios
  return Meteor.isCordova && (device.platform.toLowerCase().indexOf("ios") > -1);
};

Template.registerHelper('isAndroid', isAndroid);
Template.registerHelper('isIOS', isIOS);

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
      toastr.error("Incorrect Email");
    } else if (password.length < 4) {
      toastr.error("At least 3 characters Password");
    } else {
      Accounts.createUser({
        email: userObj.email,
        password: password,
        profile: userObj.profile
      }, function (err) {
        if (err) {
          toastr.error(err.reason);
          log.error(err);
        } else{
           //if create user is successful, user than needs to choose their role
           Router.go('role');
        }
      });
    }

};


playAudio = function(url, callback) {
  
  // Play the audio file at url
     log.info(callback);
  var my_media = new Media(url,
    // success callback
    function () {
      log.info("playAudio():Audio Success");
      callback();
      log.info("calledback");
    },
    // error callback
    function (err) {
      log.error("playAudio():Audio Error: " + err);
    }
  );
  // Play audio
  my_media.play({
    numberOfLoops: 1
  });
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
          //alert(err.message + ":" + err.reason);
          toastr.error('Sorry. Google Login is not available at the moment because it is unable to connect to the Internet.')
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

