Meteor.publish('userPendingApprovedSchools',function(){
   var currentUserId = this.userId;
   return Meteor.users.find({_id: currentUserId},{fields:{schools: 1,pendingSchools:1}});   
});