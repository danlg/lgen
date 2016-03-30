Template.MasterLayout.onCreated(function () {
  


  // Use this.subscribe inside onCreated callback
  this.subscribe("notifications");
  
  //update total unread badge counter on IOS
  this.autorun(function(){
      var totalUnreadBadgeCount = getTotalUnreadNotificationCount();
      log.info('setTotalUnreadBadgeCount:'+totalUnreadBadgeCount);
      if(isIOS){
          Push.setBadge(totalUnreadBadgeCount);
      }  
  });
  
});