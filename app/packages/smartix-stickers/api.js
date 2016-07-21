Meteor.methods({
    'smartix:stickers/sendNewSticker': function(groupId, stickerArray)
    {
        return lodash.forEach(stickerArray, function(stickerId){
            return Smartix.Stickers.awardNewSticker(groupId, stickerId);
        });
    },

    'smartix:stickers/hasTradableStickers': function(){
        return  Smartix.Stickers.hasTradableStickers(this.userId);
    },

    'smartix:stickers/myStickers': function(currentSchoolId){
        return Smartix.Stickers.myStickers(this.userId, currentSchoolId);
    }

});

Meteor.publish('smartix:stickers/stickersAwardedToMe', function(currentSchoolId){
    var stickerIds = Smartix.Stickers.myStickers(this.userId, currentSchoolId);
    return Stickers.find({_id: {$in: stickerIds}});
})