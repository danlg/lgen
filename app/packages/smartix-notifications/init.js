// Template.AppLayout.onCreated(function () {
//   // Use this.subscribe inside onCreated callback
//   this.subscribe("notifications");

//   // Update total unread badge counter on IOS
//   this.autorun(function(){
//       var totalUnreadBadgeCount = Smartix.helpers.getTotalUnreadNotificationCount(Meteor.userId());
//       //log.info('setTotalUnreadBadgeCount:'+totalUnreadBadgeCount);
//       if(Smartix.helpers.isIOS()){
//           Push.setBadge(totalUnreadBadgeCount);
//       }  
//   });
// });