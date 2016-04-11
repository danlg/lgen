Meteor.publish('smartix:messages/messagesById', function (id) {
    
    // Check for permission
  return Smartix.Messages.find({
    _id: id
  });
});