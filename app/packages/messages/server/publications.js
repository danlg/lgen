Meteor.publish('smartix:messages/messagesById', function (id) {
    
    // Check for permission
  return Smartix.Messages.find({
    _id: id
  });
});

Meteor.publish('smartix:messages/groupMessages', function (groupId) {
  
  //find Groups that is:
  //1. in the current namespace and 
  //2a. either current user is one of the users in the group
  //2b. or     current user is one of the admins in the group
  console.log('smartix:messages/groupMessages',groupId);
  
  return Smartix.Messages.Collection.find(
    { group: groupId }
  );
});

Meteor.publish('smartix:messages/latestMessageEachGroups', function (groupIds) {
  
  //find Groups that is:
  //1. in the current namespace and 
  //2a. either current user is one of the users in the group
  //2b. or     current user is one of the admins in the group
  console.log('smartix:messages/latestMessageEachGroups');  
  return Smartix.Messages.Collection.find(
    { group:{$in: groupIds} }
  );
});