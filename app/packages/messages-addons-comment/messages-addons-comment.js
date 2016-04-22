Smartix = Smartix || {};

Smartix.Messages = Smartix.Messages || {};

Smartix.Messages.Addons = Smartix.Messages.Addons || {};

Smartix.Messages.Addons.ValidTypes = Smartix.Messages.Addons.ValidTypes || [];

Smartix.Messages.Addons.Comment = {};

Smartix.Messages.Addons.Comment.Type = 'comment';

Smartix.Messages.Addons.ValidTypes.push(Smartix.Messages.Addons.Comment.Type);

Smartix.Messages.Addons.Comment.Schema = new SimpleSchema({
    type:{
        type:String
    },
    comments: {
        type: [Object]
    }
});

Smartix.Messages.Addons.Comment.updateNewComment = function (messageId, CommentObj) {
    // Update the message
    Smartix.Messages.Collection.update({
        _id: messageId
    }, {
        $pull: {
            addons: {
                type: Smartix.Messages.Addons.Comment.Type
            }
        }
    }, function (error, n) {
        if(!error) {
            Smartix.Messages.Collection.update({
                _id: messageId
            }, {
                $push: CommentObj
            });
        }
    });
}
