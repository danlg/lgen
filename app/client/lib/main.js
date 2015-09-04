Meteor.startup(function () {

	if (Meteor.isCordova) {
		window.alert = navigator.notification.alert;
	}

	Push.addListener('message', function(notification) {
		// Called on every message
		console.log(JSON.stringify(notification));

		if(Router.current().route.getName()!=="TabChat"){
			var badge =  Session.get("chatUnreadNumber");
			badge++;
			Session.set("chatUnreadNumber",badge);
		}else {
			Session.set("chatUnreadNumber",0);
		}





		// function alertDismissed() {
    //   var badge =  Session.get("chatUnreadNumber");
    //   badge++;
    //   Session.set("chatUnreadNumber",badge);
		//
		// }
		// alert(notification.message, alertDismissed, notification.payload.title, "Ok");
	});
});
