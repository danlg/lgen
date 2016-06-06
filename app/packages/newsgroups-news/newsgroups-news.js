Smartix = Smartix || {};

Smartix.Newsgroup = Smartix.Newsgroup || {};

Smartix.Newsgroup.Messages = Smartix.Newsgroup.Messages || {};

Smartix.Newsgroup.Messages.isAllowedType = function(NewsgroupId, type) {
    return true;
}

Smartix.Newsgroup.Messages.canCreateMessage = function (NewsgroupId, type) {
    check(NewsgroupId, String);
    check(type, String);
    
    // Get the Newsgroup the user is trying to post an announcement for
    var _Newsgroup = Smartix.Groups.Collection.findOne({
        type: 'newsgroup',
        _id: NewsgroupId
    });
    
    if(!_Newsgroup) {
        return false;
        // OPTIONAL: Throw error indicating no such Newsgroup exists
    } 

    // Checks whether the currently logged-in user
    // has permission to post announcements in this Newsgroup
    // If the currently logged-in user is not in the `admins` array
    // Return `false` and optionally throw an error
    if(Array.isArray(_Newsgroup.admin)
    && _Newsgroup.admins.indexOf(Meteor.userId()) < 0) {
        return false;
        // OPTIONAL: Throw error indicating that you have no permission to post an announcement
    }
    
    // Checks that this type of message is allowed for this group
    if(!Smartix.Newsgroup.Messages.isAllowedType(type)) {
        return false;
        // OPTIONAL: Throw error indicating the `type` specified
        // is not permitted for this Newsgroup
    }
    
    return true;
}

Smartix.Newsgroup.Messages.canEditMessage = function (announcementId) {
    
    var _Newsgroup = Smartix.Messages.getGroupFromMessageId(announcementId);
    
    if(!_Newsgroup || _Newsgroup.type !== 'newsgroup') {
        return false;
        // OPTIONAL: Throw error indicating the Newsgroup
        // for which the announcement belongs to no longer exists
    }

    // Checks whether the currently logged-in user
    // has permission to edit announcements in this Newsgroup
    // If the currently logged-in user is not in the `admins` array
    // Return `false` and optionally throw an error
    if(Array.isArray(_Newsgroup.admin)
    && _Newsgroup.admins.indexOf(Meteor.userId()) < 0) {
        return false;
        // OPTIONAL: Throw error indicating that you have
        // no permission to edit the  announcement
    }
    
    return true;
}

Smartix.Newsgroup.Messages.canAttachAddons = function (announcementId, addons) {
    check(announcementId, String);
    check(addons, [Object]);
    
    var isAuthorOfAnnouncement = Smartix.Messages.Collection.findOne({
        _id: announcementId,
        author: Meteor.userId()
    });
    
    var _Newsgroup = Smartix.Messages.getGroupFromMessageId(announcementId);
    
    if(!_Newsgroup || _Newsgroup.type !== 'newsgroup') {
        return false;
        // OPTIONAL: Throw error indicating the Newsgroup
        // for which the announcement belongs to no longer exists
    }
    
    var isGroupAdmin = _Newsgroup.admins.indexOf(Meteor.userId()) > -1;
    
    if(!(isAuthorOfAnnouncement || isNewsgroupAdmin)) {
        return false;
        // OPTIONAL: Throw error saying you must be either
        // the author of the announcement, or
        // the admin of the Newsgroup
    }
    
    var addonTypes = _.map(addons, function (addon, index, collection) {
        return addon.type;
    });
    
    if(addonTypes.length !== _.compact(addonTypes).length) {
        return false;
        // OPTIONAL: Throw error saying some addons do not have the `type` property specified
    }

    // If there are addons with types not allowed for this Newsgroup, return `false`
    //log.info('notAllowedTypes',addonTypes,_Newsgroup.addons);
    var notAllowedTypes = _.difference(addonTypes, _Newsgroup.addons);
    
    if(notAllowedTypes.length > 0){
        return false;
    }else{
        return true;
    }
}