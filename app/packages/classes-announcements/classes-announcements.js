_ = lodash;

// Converts letter-case string to CapitalCase
var letterCaseToCapitalCase = function (string) {
    var camelCased = _.camelCase(string);
    return camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
}

Smartix = Smartix || {};

Smartix.Class = Smartix.Class || {};

Smartix.Class.Announcements = Smartix.Class.Announcements || {};

Smartix.Class.Announcements.isAllowedType = function(classId, type) {
    return true;
}

Smartix.Class.Announcements.createAnnouncement = function (classId, type, data) {
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
    
    // Checks that this type of announcement is valid
    if(!Smartix.Messages.isValidType(type)) {
        return false;
        // OPTIONAL: Throw error indicating the `type` specified is not recognized
    }
    
    // Checks that this type of announcement is allowed for this class
    if(!Smartix.Class.Announcements.isAllowedType(classId, type)) {
        return false;
        // OPTIONAL: Throw error indicating the `type` specified
        // is not permitted for this class
    }
    
    // Create an announcement object to house all the data
    var announcement = {};
    announcement.group = classId;
    announcement.author = Meteor.userId();
    announcement.type = type;
    announcement.data = data;
    
    // Get the schema for the type and use it to clean the `announcement` object
    Smartix.Messages[letterCaseToCapitalCase(type)].Schema.clean(announcement);
    
    // Validate using the same schema to ensure it conforms
    check(announcement, Smartix.Messages[letterCaseToCapitalCase(type)].Schema);
    
    // Pass it onto `Smartix.Messages.createMessage` to insert the announcement
    Smartix.Messages.createMessage(announcement)
}


Smartix.Class.Announcements.editAnnouncement = function (announcementId, data) {
    // Get the existing announcement document
    var oldAnnouncement = Smartix.Messages.Collection.find({
        _id: announcementId
    });
    
    if(!oldAnnouncement) {
        return false;
        // OPTIONAL: Throw an error indicating the announcement does not exists
    }
    
    // Get the class the user is trying to edit an announcement for
    var _class = Smartix.Groups.Collection.findOne({
        type: 'class',
        _id: oldAnnouncement.group
    });
    
    if(!_class) {
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
    
    // Get the schema for the type and use it to clean the `announcement` object
    Smartix.Messages[letterCaseToCapitalCase(oldAnnouncement.type)].Schema.pick(['data']).clean(data);
    
    // Validate using the same schema to ensure it conforms
    check(data, Smartix.Messages[letterCaseToCapitalCase(oldAnnouncement.type)].Schema.pick(['data']));
    
    // Pass it onto `Smartix.Messages.editMessage` to edit the announcement
    Smartix.Messages.editMessage(announcementId, {
        data: data
    });
}