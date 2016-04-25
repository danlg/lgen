Meteor.methods({
   'smartix:messages/createMessage': Smartix.Messages.createMessage,
   'smartix:messages/createNewsMessage':function(url,messageType,data,addons){
       
       var newsgroupDoc = Smartix.Groups.Collection.findOne({url:url}); 
       
       if(!newsgroupDoc){
           return;
       }
         
       return Smartix.Messages.createMessage(newsgroupDoc._id,messageType,data,addons);
         
   }
});