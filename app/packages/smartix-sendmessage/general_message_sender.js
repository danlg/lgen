GeneralMessageSender = function(groupId,messageType,messageText,addons,targetUsers,callback){
    
    //e.g each addons :
    //{type:messageType,fileId:messageAttachmentObject._id}
    addons = addons || [];

    console.log(messageType);
    //messageType is "text" or "article". An "article" contains a title in addition to a text payload.
    //both of them can have addon: image, document
    //only text message can have vote and comment
    //we support  only  messageType "text" for now. as "article" is not supported yet.
    if(messageType === 'text') {
        Meteor.call('smartix:messages/createMessage',groupId,messageType,{content:messageText}, addons,true,
          function(err,result){
        });
    }
    //callback is for UI update e.g buttonToggle, autogrow inputbox refresh, clean up inputBox
    callback();
};
