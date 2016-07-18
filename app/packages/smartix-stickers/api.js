Meteor.methods({
    'smartix:stickers/awardSticker': function(groupId, stickerArray)
    {
        return Smartix.Stickers.awardNewSticker(groupId, stickerArray);
    }
});