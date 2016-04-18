Smartix = Smartix || {};

Smartix.Chat = Smartix.Chat || {};

Smartix.Chat.Messages = Smartix.Chat.Messages || {};

Smartix.Chat.Messages.isAllowedType = function(chatId, type) {
    return true;
}

Smartix.Chat.Messages.canCreateMessage = function (chatId, type) {
    check(chatId, String);
    check(type, String);
    
    // Get the Chat the user is trying to post an announcement for
    var _chat = Smartix.Groups.Collection.findOne({
        type: 'chat',
        _id: chatId
    });
    
    if(!_chat) {
        return false;
        // OPTIONAL: Throw error indicating no such Chat exists
    } 

    // Checks whether the currently logged-in user
    // has permission to post announcements in this Chat
    // If the currently logged-in user is not in the `admins` array
    // Return `false` and optionally throw an error
    if(Array.isArray(_chat.admin)
    && _chat.admins.indexOf(Meteor.userId()) < 0) {
        return false;
        // OPTIONAL: Throw error indicating that you have no permission to post an announcement
    }
    
    // Checks that this type of message is allowed for this group
    if(!Smartix.Chat.Messages.isAllowedType(type)) {
        return false;
        // OPTIONAL: Throw error indicating the `type` specified
        // is not permitted for this Chat
    }
    
    return true;
}

Smartix.Chat.Messages.canEditMessage = function (announcementId) {
    
    var _chat = Smartix.Messages.getGroupFromMessageId(announcementId);
    
    if(!_chat || _chat.type !== 'Chat') {
        return false;
        // OPTIONAL: Throw error indicating the Chat
        // for which the announcement belongs to no longer exists
    }

    // Checks whether the currently logged-in user
    // has permission to edit announcements in this Chat
    // If the currently logged-in user is not in the `admins` array
    // Return `false` and optionally throw an error
    if(Array.isArray(_chat.admin)
    && _chat.admins.indexOf(Meteor.userId()) < 0) {
        return false;
        // OPTIONAL: Throw error indicating that you have
        // no permission to edit the  announcement
    }
    
    return true;
}

Smartix.Chat.Messages.canAttachAddons = function (announcementId, addons) {
    check(announcementId, String);
    check(addons, [Object]);
    
    var isAuthorOfAnnouncement = Smartix.Messages.Collection.findOne({
        _id: announcementId,
        author: Meteor.userId()
    });
    
    var _chat = Smartix.Messages.getGroupFromMessageId(announcementId);
    
    if(!_chat || _chat.type !== 'Chat') {
        return false;
        // OPTIONAL: Throw error indicating the Chat
        // for which the announcement belongs to no longer exists
    }
    
    var isGroupAdmin = _chat.admins.indexOf(Meteor.userId()) > -1;
    
    if(!(isAuthorOfAnnouncement || isChatAdmin)) {
        return false;
        // OPTIONAL: Throw error saying you must be either
        // the author of the announcement, or
        // the admin of the Chat
    }
    
    var addonTypes = _.map(addons, function (addon, index, collection) {
        return addon.type;
    });
    
    if(addonTypes.length !== _.compat(addonTypes).length) {
        return false;
        // OPTIONAL: Throw error saying some addons do not have the `type` property specified
    }
    
    // If there are addons with types not allowed for this Chat, return `false`
    var notAllowedTypes = _.difference(addonTypes, _chat.addons);
    
    return notAllowedTypes.length > 0;
}