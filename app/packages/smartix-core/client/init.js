log = loglevel.createLogger('lg');
log.info("log initialized on client");
log.setLevel("info");
Meteor.startup(function () {
	if (Meteor.isCordova) {
		window.alert = navigator.notification.alert;
	}else{
       //requestPermission for desktop notification
       if ('Notification' in window) {
        Notification.requestPermission(); 
       }
    }
  

  
  Push.addListener('badge', function(notification) {
     // Called when message got a badge
     Push.setBadge(notification.badge);   
  });
      
  //Route to specific view on click of notificaitons
  //https://github.com/raix/push/issues/110
  Push.addListener('startup', function(notification) {
   var payload = notification.payload;   
   //if it is a new chat message
   if(payload.type === 'chat'){
      if(payload.chatRoomId){
         Router.go('ChatRoom',{chatRoomId:payload.chatRoomId},{query: "toBottom=true"});          
      }      
   }
   //if it is a new class annoucement
   if(payload.type === 'class'){
      if(payload.classCode){
        Router.go('classDetail',{classCode:payload.classCode},{query: "toBottom=true"});          
      }             
   }
   
  });


      
  toastr.options = {
    "positionClass": "toast-top-full-width",
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "slideDown",
    "hideMethod": "slideUp"
  }
  
  //use by francocatena:status,using template status_ionic
  Status.setTemplate('ionic');
  
  //when receive a new class message, display a popup, which can be clicked
  //and be redirected to that class
  Streamy.on('newclassmessage', function(data) {
    log.info(data);
    var pathToRouteObj ={
        routeName:'classDetail',
        params: {classCode:data.classCode},
        query: {query: "toBottom=true"},
    }    
    //In Desktop, determine if browser support Notification API
    if('Notification' in window && Notification.permission == 'granted'){
        //if Notification API is supported
        Smartix.helpers.spawnDesktopNotification(data.text,'/img/logo-new.png',data.from,pathToRouteObj);        
    }else{      
        //if both desktop notification are all not available, use toastr
            toastr.info(data.text, data.from,
                    {
                        "closeButton": true,
                        "preventDuplicates": true,
                        onclick: function () {
                            //classCode
                            Router.go('classDetail',{classCode:data.classCode},{query: "toBottom=true"});
                            //$('.class-detail').scrollTop(999999);
                    }
                }
            );
        
    }
      
  }); 

  //when receive a new chat message, display a popup, which can be clicked
  //and be redirected to that chat
  Streamy.on('newchatmessage', function(data) {  
    //determine if browser support Notification API
    var shouldFallback = false;
    var pathToRouteObj ={
        routeName:'ChatRoom',
        params: {chatRoomId:data.chatRoomId},
        query: {query: "toBottom=true"},
    };
    if ('Notification' in window && Notification.permission == 'granted') {
        //if Notification API is supported

        Smartix.helpers.spawnDesktopNotification(data.text,'/img/logo-new.png',data.from,pathToRouteObj);
    } else {
        
        //if both desktop notification, are all not available, use toastr            
            if(Router.current().route.getName() == 'ChatRoom' && Router.current().params.chatRoomId == data.chatRoomId){
                //do nothing. As user its already on that chat.
            }else{
                log.info(data);
                toastr.info(data.text, data.from,
                        {           
                            "closeButton": true,
                            "preventDuplicates": true,
                            onclick: function () {
                                Router.go('ChatRoom',{chatRoomId:data.chatRoomId},{query: "toBottom=true"});
                        }
                    }
                );      
            }             
               
        
    }        

      
  }); 
  

});


AutoForm.setDefaultTemplate('plain');

AutoForm.submitFormById = function(id) {
    $(id).submit();
};

Accounts.onEmailVerificationLink(function(token) {
    Accounts.verifyEmail(token, function(err) {
        err ? toastr.error(err.reason) : Router.go('TabClasses');
    });
});

Accounts.onResetPasswordLink(function(token, done) {
    Session.set('resetPasswordToken', token);
    Router.go('EmailResetPwd');
});


Accounts.onLogin(function(attempt) {

	// Reload user object which was possibly modified
	// by splendido:accounts-emails-field by a previous onLogin callback
	// note: the *attempt* object is cloned for each hook callback
	//       se there's no way to get the modified user object from the
	//       *attempt* one...
	var user = Meteor.users.findOne(attempt.user._id);

	// Checks for possible meld actions to be created
	checkForMelds(user);
    
    
     var currentUser = Meteor.user();
        if(currentUser){
        //if user does not have any apporved School
        if (!currentUser.schools) {
            //and user has exactly one pending school
            if (Object.keys(Meteor.user().roles).length == 1) {
                //automactically approve that school
                console.log('try approve user to the solely pending school');
                Meteor.call('smartix:accounts-schools/approveSchool', Object.keys(Meteor.user().roles)[0]);
            }
        }
     }
});

/*Accounts.onLogin(function() {
    

    var currentUser = Meteor.user();
    //if user does not have any apporved School
    if (!currentUser.schools) {
        //and user has exactly one pending school
        if (Object.keys(Meteor.user().roles).length == 1) {
            //automactically approve that school
            console.log('try approve user to the solely pending school');
            Meteor.call('smartix:accounts-schools/approveSchool', Object.keys(Meteor.user().roles)[0]);
        }
    }

});*/

// Meteor.AppCache.config({
//   chrome: true,
//   firefox: true,
// 	chromium:true,
// 	chromeMobileIOS:true,
// 	mobileSafari:true,
// 	safari:true
// });