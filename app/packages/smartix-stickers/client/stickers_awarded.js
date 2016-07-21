let schoolId;

Template.StickersAwarded.onCreated(function () {
    schoolId = UI._globalHelpers['getCurrentSchoolId']();
    this.subscribe('smartix:stickers/stickersAwardedToMe', schoolId);
    this.subscribe('usersFromRelationships', Meteor.userId());
})

Template.StickersAwarded.helpers({
    'isParent': function () {
        return (Meteor.user().roles[schoolId].indexOf(Smartix.Accounts.School.PARENT) !== -1);
    },

    'stickerObj': function(stickerId){
        return Stickers.findOne(stickerId);
    },

    'stickers': function(){
        let stickerIdArray = [];
        lodash.forEach(this.stickers, function(sticker)
        {
            if(sticker.count > 0)
            {stickerIdArray.push(sticker)}
        })
        return (stickerIdArray.length > 0) ? stickerIdArray : false;
    },

    'hasStickers': function(studentObj){
        let counter = 0;
        lodash.forEach(studentObj.stickers, function(sticker)
        {
            if(sticker.count > 0)
            {counter ++ }
        })
        return (counter > 0) ? true : false;
    },

    'child': function(){
        // if (currentUser.roles[schoolId].indexOf(Smartix.Accounts.School.PARENT) !== -1)
        // {
            let childArray;
            let relationshipArray = Smartix.Accounts.Relationships.Collection.find({
                parent: Meteor.userId(),
                namespace: schoolId
            }).fetch();
            lodash.forEach(relationshipArray, function(relationship)
            {
                return childArray = lodash.concat(childArray, Meteor.users.findOne(relationship.child));
            })
            lodash.remove(childArray, lodash.isUndefined);
            // log.info(childArray);
            return childArray;
        // }
    },

    'studentProfile': function()
    {
        return Meteor.user();
    }
})