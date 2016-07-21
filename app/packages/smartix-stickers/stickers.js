Smartix = Smartix || {};

Smartix.Stickers = Smartix.Stickers || {};


Smartix.Stickers.removeSticker = function (userId, groupId, sticker) {
    let userObj = Meteor.users.findOne(userId);
    let group = Smartix.Groups.Collection.findOne({ _id: groupId });
    if (!group) {
        log.error('group not exist');
        return false;
    }
    let currentSchoolId = group.namespace;
    if (userObj) {
        if (userObj.roles[currentSchoolId].indexOf(Smartix.Accounts.School.STUDENT) === -1) {
            return;
        }
        else {
            let options = {};
            let presentStickerArray = userObj.stickers;
            let obj = {};
            let existingSticker = lodash.find(presentStickerArray, { 'stickerId': sticker })
            if (existingSticker) {
                lodash.remove(presentStickerArray, existingSticker);
                value = existingSticker.count - 1;
                obj = {
                    stickerId: existingSticker.stickerId, count: value
                }
            }
            else {
                return;
            }
            presentStickerArray.push(obj);
            options.stickers = presentStickerArray;
            return Meteor.users.update({
                _id: userObj._id
            }, {
                    $set: options
                });
        }
    }
    else{
        return;
    }
}

Smartix.Stickers.awardNewSticker = function (groupId, stickerId) {
    // log.info("Chat Id", groupId);
    check(groupId, String);
    check(stickerId, String);

    var group = Smartix.Groups.Collection.findOne({ _id: groupId });
    if (!group) {
        log.error('group not exist');
        return false;
        // OPTIONAL: Throw error saying the group specified does not exists
    }

    schoolId = group.namespace;
    currentUser = Meteor.userId();
    lodash.remove(group.users,
        function (eachUserId) {
            return (eachUserId === currentUser);
        });
    var allUsers = lodash.union(allUsers, group.users);
    if (group.distributionLists) {
        var allLinkedDistributionLists = Smartix.Groups.Collection.find({ _id: { $in: group.distributionLists } }).fetch();
        var allUsersInDistributionLists = lodash.map(allLinkedDistributionLists, 'users');
        allUsersInDistributionLists = lodash.flatten(allUsersInDistributionLists);
        allUsers = lodash.union(allUsers, allUsersInDistributionLists);
    }
    allUsersObject = Meteor.users.find({ _id: { $in: allUsers } }).fetch();
    //Ensures only students in allUsersObjectArray
    lodash.remove(allUsersObject, function (userObj) {
        return userObj.roles[schoolId].indexOf(Smartix.Accounts.School.STUDENT) === -1;
    })
    lodash.forEach(allUsersObject, function (userObj) {
        let options = {};
        let stickersArray = userObj.stickers;
        let obj = {};
        if (!stickersArray)
            stickersArray = [];
        let existingSticker = lodash.find(stickersArray, { 'stickerId': stickerId })
        if (existingSticker) {
            // log.info("Existing Sticker", existingSticker);
            let test = lodash.remove(stickersArray, existingSticker);
            // log.info("Removed", test);
            value = existingSticker.count + 1;
            obj = {
                stickerId: existingSticker.stickerId, count: value
            }
        }
        else {
            obj = { stickerId: stickerId, count: 1 }
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
    if (allUsersObject.length > 0) {
        Smartix.Stickers.removeSticker(currentUser, groupId, stickerId);
    }
}

Smartix.Stickers.hasTradableStickers = function (studentId) {
    // log.info(studentId);
    studentObj = Meteor.users.findOne(studentId);
    stickerArray = studentObj.stickers;
    var hasTradableStickers = false;
    if (stickerArray) {
        lodash.forEach(stickerArray, function (sticker) {
            stickerObj = Stickers.findOne(sticker.stickerId);
            if (stickerObj.metadata.tradable === true)
                return hasTradableStickers = true;
        })
    }

    return hasTradableStickers;
}


Smartix.Stickers.myStickers = function (userId, currentSchoolId) {

    let userObj = Meteor.users.findOne(userId);
    //case student 
    let stickersAwarded = [];
    if (userObj.roles[currentSchoolId].indexOf(Smartix.Accounts.School.STUDENT) > -1) {
        // log.info("Finding stickers for student");
        lodash.forEach(userObj.stickers, function(sticker)
        {
            if(sticker.count > 0)
            return stickersAwarded = lodash.concat(stickersAwarded, sticker);
        })
    }
    else if (userObj.roles[currentSchoolId].indexOf(Smartix.Accounts.School.PARENT) > -1) {
        // log.info("Finding stickers for parent");
        var relationRecords = Smartix.Accounts.Relationships.getChildsOfParent(userId, currentSchoolId);
        lodash.forEach(relationRecords, function (relationship) {
            let childObj = Meteor.users.findOne(relationship.child);
            lodash.forEach(childObj.stickers, function(sticker)
            {
                if(sticker.count > 0)
                return stickersAwarded = lodash.concat(stickersAwarded, sticker);
            })
        })
    }
    // log.info("Stickers Awarded", stickersAwarded);
    let stickerIds = lodash.map(stickersAwarded, 'stickerId');
    // log.info("Sticker Ids", stickerIds);
    return stickerIds;
}