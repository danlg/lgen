Meteor.methods({
    
    'smartix:messages-addons-comment/addNewComment': function(messageId, commentText){
        console.log('smartix:messages-addons-comment/addNewComment',messageId,commentText);
        var msgObj = Smartix.Messages.Collection.findOne(messageId);
        
        if(msgObj){

            var commentObjs =lodash.filter(msgObj.addons, function(addon) { return addon.type === 'comment'; });
            
            commentObjs[0].comments.push({
                comment: commentText,
                createdBy: Meteor.userId(),
                createdAt: new Date(),
                isShown:true  
            }); 
            
            Smartix.Messages.Addons.Comment.addNewComment( messageId, commentObjs[0] );
                   
        }
        
        

        
    }
    
    
}) 