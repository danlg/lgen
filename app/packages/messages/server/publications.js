Meteor.publish('smartix:messages/messagesById', function (id) {
  // Check for permission
  this.unblock();
  return Smartix.Messages.Collection.find({ _id: id });
});

Meteor.publish('smartix:messages/groupMessages', function (groupId) {
  //find Groups that is:
  //1. in the current namespace and 
  //2a. either current user is one of the users in the group
  //2b. or     current user is one of the admins in the group
  //log.info('smartix:messages/groupMessages',groupId);
  this.unblock();
  return Smartix.Messages.Collection.find(
    { group: groupId }
  );
});

Meteor.publish('smartix:messages/latestMessageEachGroups', function (groupIds) {
  //find Groups that is:
  //1. in the current namespace and 
  //2a. either current user is one of the users in the group
  //2b. or     current user is one of the admins in the group
  //log.info('smartix:messages/latestMessageEachGroups');
  this.unblock();
  let messageIds = [];
  let tempMessages = [];
  lodash.forEach(groupIds, function(groupId){
    let temp = Smartix.Messages.Collection.findOne(
      {group: groupId}, {sort: {createdAt: -1}}
    )
    tempMessages.push(temp);
  });
  messageIds = lodash.map(tempMessages, '_id');
  return Smartix.Messages.Collection.find(
    {_id: {$in: messageIds}}
  );
});