Meteor.publish('smartix:classes-announcements/announcementsById', function (id) {
    
    // Check for permission
  return Smartix.Messages.find({
    _id: id
  });
});