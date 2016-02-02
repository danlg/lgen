Meteor.startup(function () {
	if (Meteor.isCordova) {
		window.alert = navigator.notification.alert;
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
                    log.info('you click me');
                    //classCode
                    Router.go('classDetail',{classCode:data.classCode},{query: "toBottom=true"});
                    //$('.class-detail').scrollTop(999999);
            }
        }
    );    
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