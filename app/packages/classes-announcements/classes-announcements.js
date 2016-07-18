Smartix = Smartix || {};

Smartix.Class = Smartix.Class || {};

Smartix.Class.Messages = Smartix.Class.Messages || {};

Smartix.Class.Messages.isAllowedType = function(classId, type) {
    return true;
}

Smartix.Class.Messages.canCreateMessage = function (classId, type) {
    check(classId, String);
    check(type, String);
    
    // Get the class the user is trying to post an announcement for
    var _class = Smartix.Groups.Collection.findOne({
        type: 'class',
        _id: classId
    });
    
    if(!_class) {
        return false;
        // OPTIONAL: Throw error indicating no such class exists
    } 

    // Checks whether the currently logged-in user
    // has permission to post announcements in this class
    // If the currently logged-in user is not in the `admins` array
    // Return `false` and optionally throw an error
    if(Array.isArray(_class.admin)
    && _class.admins.indexOf(Meteor.userId()) < 0) {
        return false;
        // OPTIONAL: Throw error indicating that you have no permission to post an announcement
    }
    
    // Checks that this type of message is allowed for this group
    if(!Smartix.Class.Messages.isAllowedType(type)) {
        return false;
        // OPTIONAL: Throw error indicating the `type` specified
        // is not permitted for this class
    }
    
    return true;
}

Smartix.Class.Messages.canEditMessage = function (announcementId) {
    
    var _class = Smartix.Messages.getGroupFromMessageId(announcementId);
    
    if(!_class || _class.type !== 'class') {
        return false;
        // OPTIONAL: Throw error indicating the class
        // for which the announcement belongs to no longer exists
    }

    // Checks whether the currently logged-in user
    // has permission to edit announcements in this class
    // If the currently logged-in user is not in the `admins` array
    // Return `false` and optionally throw an error
    if(Array.isArray(_class.admin)
    && _class.admins.indexOf(Meteor.userId()) < 0) {
        return false;
        // OPTIONAL: Throw error indicating that you have
        // no permission to edit the  announcement
    }
    
    return true;
}

Smartix.Class.Messages.canAttachAddons = function (announcementId, addons) {
    check(announcementId, String);
    check(addons, [Object]);
    
    var isAuthorOfAnnouncement = Smartix.Messages.Collection.findOne({
        _id: announcementId,
        author: Meteor.userId()
    });
    
    var _class = Smartix.Messages.getGroupFromMessageId(announcementId);
    
    if(!_class || _class.type !== 'class') {
        log.info('this group type is not class!')
        return false;
        // OPTIONAL: Throw error indicating the class
        // for which the announcement belongs to no longer exists
    }
    
    var isGroupAdmin = _class.admins.indexOf(Meteor.userId()) > -1;
    
    if(!(isAuthorOfAnnouncement || isClassAdmin)) {
        log.info('you are not author of the announcement or the admin of the class')
        return false;
        // OPTIONAL: Throw error saying you must be either
        // the author of the announcement, or
        // the admin of the class
    }
    
    var addonTypes = _.map(addons, function (addon, index, collection) {
        return addon.type;
    });
    
    if(addonTypes.length !== lodash.compact(addonTypes).length) {
        log.info('addons do not have type property specified');
        return false;
        // OPTIONAL: Throw error saying some addons do not have the `type` property specified
    }
    
    // If there are addons with types not allowed for this class, return `false`
    log.info('notAllowedTypes',addonTypes,_class.addons);
    var notAllowedTypes = _.difference(addonTypes, _class.addons);
    
    var schoolId = _class.namespace
    var userRolesInCurrentNamespace = Meteor.user().roles[schoolId];

   if(notAllowedTypes.length > 0){
        //this is to check if the user is attaching sticker and to ensure tge user is a teacher
        if(_.includes(notAllowedTypes, 'stickers') && userRolesInCurrentNamespace.indexOf(Smartix.Accounts.School.TEACHER)!==-1)
        {
            return true;
        }
        return false;
    }else{
        return true;
    }
}