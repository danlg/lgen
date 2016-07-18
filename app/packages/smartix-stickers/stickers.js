Smartix = Smartix || {};

Smartix.Stickers = Smartix.Stickers || {};

Smartix.Stickers.awardNewSticker = function(groupId, stickerArray){
    // log.info("Chat Id", groupId);
    // log.info("Stickers", stickerArray[0]);
    check(groupId, String);
    check(stickerArray, [String]);

    //currently only one sticker is supported per message
    let stickerId = stickerArray[0];
    var group = Smartix.Groups.Collection.findOne({ _id: groupId });
    if(!group) {
        log.error('group not exist');
        return false;
        // OPTIONAL: Throw error saying the group specified does not exists
    }

    schoolId = group.namespace;
    currentUser = Meteor.userId();
    lodash.remove(group.users,
          function(eachUserId){
            return (eachUserId === currentUser);
        });
    var allUsers = lodash.union(allUsers, group.users );
    if(group.distributionLists){
        var allLinkedDistributionLists = Smartix.Groups.Collection.find({_id:{$in: group.distributionLists}}).fetch();
        var allUsersInDistributionLists = lodash.map(allLinkedDistributionLists,'users');
        allUsersInDistributionLists = lodash.flatten(allUsersInDistributionLists);
        allUsers = union(allUsers, allUsersInDistributionLists);
    }
    allUsersObject = Meteor.users.find({_id: {$in: allUsers}}).fetch();
    //Ensures only students in allUsersObjectArray
    lodash.remove(allUsersObject, function(userObj){
        return userObj.roles[schoolId].indexOf(Smartix.Accounts.School.STUDENT) === -1;
    })
    lodash.forEach(allUsersObject, function(userObj){
        let options = {};
        let stickersArray = userObj.stickers;
        let obj = {};
        if (!stickersArray)
            stickersArray = [];
        let existingSticker = lodash.find(stickersArray, {'stickerId': stickerId})  
        if(existingSticker)
        {
            // log.info("Existing Sticker", existingSticker);
            let test = lodash.remove(stickersArray, existingSticker);
            // log.info("Removed", test);
            value = existingSticker.count +1;
            obj = {
                stickerId: existingSticker.stickerId, count: value
            } 
        }  
        else{
            obj = {stickerId: stickerId, count: 1}
        }
        // log.info("Array", stickersArray)
        stickersArray.push(obj);
        options.stickers = stickersArray;
        // log.info(options);
        return Meteor.users.update({
            _id: userObj._id
        }, {
                $set: options
            });
    })
}