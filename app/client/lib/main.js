Meteor.startup(function () {
	if (Meteor.isCordova) {
		window.alert = navigator.notification.alert;
	}else{
       //requestPermission for desktop notification
       Notification.requestPermission(); 
    }
  
  log = loglevel.createLogger('lg');
  log.info("log initialized on client");
  log.setLevel("info");
  
  //todo add 'startup' listener
	Push.addListener('message', function(notification) {
		// Called on every message
		log.info(JSON.stringify(notification));
		var payload = notification.payload;
    if (payload.type === "chat") {
      if (Router.current().route.getName() !== "TabChat") {
        var badge = Session.get("chatUnreadNumber");
        badge++;
        Session.set("chatUnreadNumber", badge);
      }
      else {
        Session.set("chatUnreadNumber", 0);
      }
    }
  });
  
  toastr.options = {
    "positionClass": "toast-bottom-full-width"
  }
  
  //use by francocatena:status,using template status_ionic
  Status.setTemplate('ionic');
  
  //when receive a new class message, display a popup, which can be clicked
  //and be redirected to that class
  Streamy.on('newclassmessage', function(data) {
    log.info(data);
    toastr.info(data.text, data.from,
            {
                "closeButton": true,
                "preventDuplicates": true,
                timeOut: 0,
                onclick: function () {
                    //classCode
                    Router.go('classDetail',{classCode:data.classCode},{query: "toBottom=true"});
                    //$('.class-detail').scrollTop(999999);
            }
        }
    );    
  }); 

  //when receive a new chat message, display a popup, which can be clicked
  //and be redirected to that chat
  Streamy.on('newchatmessage', function(data) {  
    if(Router.current().route.getName() == 'ChatRoom' && Router.current().params.chatRoomId == data.chatRoomId){
        //do nothing. As user its already on that chat.
    }else{
        log.info(data);
        toastr.info(data.text, data.from,
                {           
                    "closeButton": true,
                    "preventDuplicates": true,
                    timeOut: 0,
                    onclick: function () {
                        Router.go('ChatRoom',{chatRoomId:data.chatRoomId},{query: "toBottom=true"});
                }
            }
        );
        

        
        
    } 
    //desktop notification
    if ('Notification' in window) {
        // API supported
        var pathToRouteObj ={
            routeName:'ChatRoom',
            params: {chatRoomId:data.chatRoomId},
            query: {query: "toBottom=true"},
        }
        spawnDesktopNotification(data.text,'',data.from,pathToRouteObj);
    } else {
        // API not supported
    }        

      
  });   
  

});

AutoForm.setDefaultTemplate('plain');

AutoForm.submitFormById = function (id) {
  $(id).submit();
};

Accounts.onEmailVerificationLink(function (token) {
  Accounts.verifyEmail(token, function (err) {
    err ? toastr.error(err.reason) : Router.go('TabClasses');
  });
});

Accounts.onLogin(function (argument) {
  // analytics.track("Login", {
  //   date: new Date(),
  // });
});

// Meteor.AppCache.config({
//   chrome: true,
//   firefox: true,
// 	chromium:true,
// 	chromeMobileIOS:true,
// 	mobileSafari:true,
// 	safari:true
// });