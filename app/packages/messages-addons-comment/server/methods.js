Meteor.methods({
    
    'smartix:messages-addons-comment/addNewComment': function(messageId, commentText, schoolId){
        log.info('smartix:messages-addons-comment/addNewComment',messageId,commentText, schoolId);
        var msgObj = Smartix.Messages.Collection.findOne(messageId);
        if(msgObj){
            let commentObjs =lodash.filter(msgObj.addons, function(addon) { return addon.type === 'comment'; });
            commentObjs[0].comments.push({
                comment: commentText,
                createdBy: Meteor.userId(),
                createdAt: new Date(),
                isShown:true  
            });
            Smartix.Messages.Addons.Comment.addNewComment( messageId, commentObjs[0], schoolId );
        }
    }
});