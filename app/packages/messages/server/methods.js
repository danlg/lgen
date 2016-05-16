Meteor.methods({
   'smartix:messages/createMessage': function (groupId,messageType,data,addons,isPush) {
       return Smartix.Messages.createMessage(groupId,messageType,data,addons,isPush, this.userId);
   },
   'smartix:messages/createNewsMessage':function(url,messageType,data,addons,isPush){
       
       var newsgroupDoc = Smartix.Groups.Collection.findOne({url:url}); 
       
       if(!newsgroupDoc){
           return;
       }
         
       return Smartix.Messages.createMessage(newsgroupDoc._id,messageType,data,addons,isPush, this.userId);
         
   }
});