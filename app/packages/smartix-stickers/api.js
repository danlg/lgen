Meteor.methods({
    'smartix:stickers/awardSticker': function(groupId, stickerArray)
    {
        return lodash.forEach(stickerArray, function(stickerId){
            return Smartix.Stickers.awardNewSticker(groupId, stickerId);
        });
    }
});

Meteor.publish('smartix:stickers/stickersAwardedToMe', function(currentSchoolId){
    let userObj = Meteor.users.findOne(this.userId);
    //case student 
    let stickersAwarded = [];
    if( userObj.roles[currentSchoolId].indexOf(Smartix.Accounts.School.STUDENT) > -1){
        stickersAwarded = lodash.concat(stickersAwarded, userObj.stickers);
    }
    else if( userObj.roles[currentSchoolId].indexOf(Smartix.Accounts.School.PARENT) > -1){
        var relationRecords = Smartix.Accounts.Relationships.getChildsOfParent(this.userId,currentSchoolId);
        lodash.forEach(relationRecords, function(relationship){
            let childObj = Meteor.users.findOne(relationship.child);
            return stickersAwarded = lodash.concat(stickersAwarded, childObj.stickers);
        })
    }
    // log.info("Stickers Awarded", stickersAwarded);
    let stickerIds = lodash.map(stickersAwarded, 'stickerId');
    // log.info("Sticker Ids", stickerIds);
    return Stickers.find({_id: {$in: stickerIds}});
})