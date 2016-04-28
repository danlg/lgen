Template.AppLayout.onCreated(function () {

  // Use this.subscribe inside onCreated callback
  if(Session.get('pickedSchoolId') === undefined){
        this.subscribe("notifications");
  }else{
      
      console.log('Template.AppLayout.onCreated',Session.get('pickedSchoolId'));
      this.subscribe("notifications",Session.get('pickedSchoolId'));
  }
 
  // Update total unread badge counter on IOS
  this.autorun(function(){
      var totalUnreadBadgeCount = Smartix.helpers.getTotalUnreadNotificationCount();
      log.info('setTotalUnreadBadgeCount:'+totalUnreadBadgeCount);
      if(Smartix.helpers.isIOS()){
          Push.setBadge(totalUnreadBadgeCount);
      }  
  });
});