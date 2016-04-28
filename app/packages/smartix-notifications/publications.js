/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

Meteor.publish('notifications', function (namespace) {
  //log.info("publish:notificaitons:"+ this.userId);
  
  if(namespace){
  var groupsInNamespace = Smartix.Groups.Collection.find({namespace:namespace},{fields: {_id:1}}).fetch();
  var groupIdsInNamespace = lodash.map(groupsInNamespace,'_id');
  
    return Notifications.find({
      userId: this.userId,
      groupId : { $in : groupIdsInNamespace}
    });          
  }else{
    
    return Notifications.find({
      userId: this.userId
    });    
  }

  

});