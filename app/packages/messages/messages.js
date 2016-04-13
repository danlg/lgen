Smartix = Smartix || {};

Smartix.Messages = Smartix.Messages || {};

Smartix.Messages.ValidTypes = Smartix.Messages.ValidTypes || [];

Smartix.Messages.Collection = new Mongo.Collection('smartix:messages');

Smartix.Messages.Schema = new SimpleSchema({
	group: {
		type: String
	},
	author: {
		type: String
	},
	type: {
		type: String,
		allowedValues: Smartix.Messages.ValidTypes
	},
    data: {
        type: Object,
        blackbox: true
    },
	hidden: {
		type: Boolean,
		defaultValue: false
	},
	deletedAt: {
		type: Number,
		decimal: false,
		optional: true
	},
	addons: {
		type: [Object],
		defaultValue: [],
        custom: function () {
            if(!Array.isArray(this.value.type)) {
                return "The Add-Ons field should be an array of objects";
            }
            for (var i = 0; i < this.value.length; i++) {
                if(typeof this.value.type[i] !== "string"
                || Smartix.AddOns.ValidTypes.indexOf(this.value.type[i]) < 0) {
                    return "Invalid Add-Ons Object Array";
                }
            }
        }
	},
	versions: {
		type: [String],
		defaultValue: []
	}
});

// Checks whether a type is supported
Smartix.Messages.isValidType = function (type) {
    return Smartix.Messages.ValidTypes.indexOf(type) > -1;
}

// Returns the group object for which the message belongs to
Smartix.Messages.getGroupFromMessageId = function (messageId) {
    
    // Checks that the `messageId` is of the correct type
    check(messageId, String);
    
    // Retrieve the message object
    var message = Smartix.Messages.Collection.findOne({
        _id: messageId
    });
    
    if(!message) {
        return false;
        // OPTIONAL: Throw an error indicating the message does not exists
    }
    
    // Get the group associated with the message
    return Smartix.Groups.Collection.findOne({
        _id: message.group
    });
}

Smartix.Messages.cleanAndValidate = function (message) {
    check(message, Object);
    check(message.type, String);
    
    // Clean the message
    Smartix.Messages[Smartix.Utilities.letterCaseToCapitalCase(message.type)].Schema.clean(message);
    
    // Checks the data provided conforms to the schema for that message type
    check(message, Smartix.Messages[Smartix.Utilities.letterCaseToCapitalCase(message.type)].Schema);
    
    // As a backup in case the child packages
    // Did not implement the schema correctly,
    // Clean the `message` object with the master `Smartix.Messages.Schema`
	Smartix.Messages.Schema.clean(message);

	// Checks that the `message` object conforms to the `Smartix.Messages.Schema`
	check(message, Smartix.Messages.Schema);
}

Smartix.Messages.createMessage = function (groupId, messageType, data, addons) {
    
    check(groupId, String);
    check(messageType, String);
    check(data, Object);
    check(addons, Match.Maybe([Object]));
    
    /* ************************************** */
    /* CHECKS FOR PERMISSION TO POST IN GROUP */
    /* ************************************** */
    
    // Query to the get group
    var group = Smartix.Groups.Collection.findOne({
        _id: groupId
    });
    
    // Checks if group exists
    if(!group) {
        return false;
        // OPTIONAL: Throw error saying the group specified does not exists
    }
    
    // Checks whether the currently logged-in user
    // has permission to create a message for the group
    // The logic behind this would be different for different group types
    if(!Smartix[Smartix.Utilities.letterCaseToCapitalCase(group.type)].Messages.canCreateMessage(groupId, type)) {
        return false;
        // OPTIONAL: Throw error saying you do not have
        // permission to create message for this group
    }
    
    /* ********************************** */
    /* CHECKS THE VALIDITY OF THE MESSAGE */
    /* ********************************** */
    
    // Checks that this type of message is valid
    if(!Smartix.Messages.isValidType(messageType)) {
        return false;
        // OPTIONAL: Throw error indicating the `type` specified is not recognized
    }
    
    // Create an announcement object to house all the data
    var message = {};
    message.group = groupId;
    message.author = Meteor.userId();
    message.type = messageType;
    message.data = data;
    
    Smartix.Messages.cleanAndValidate(message);
    
    /* ****************** */
    /* INSERT THE MESSAGE */
    /* ****************** */

	var newMessage = Smartix.Messages.Collection.insert(message);
    
    if(addons) {
        
        /* ***************************************** */
        /* CHECKS FOR PERMISSION TO ATTACH THE ADDON */
        /* ***************************************** */
        
        if(!Smartix[Smartix.Utilities.letterCaseToCapitalCase(group.type)].Messages.canAttachAddons(groupId, addons)) {
            return false;
            // OPTIONAL: Throw error saying you do not have
            // permission to attach an addon for this group
        }
        
        // Checks that the group allows for this type of addon
        // If the addon type specified is not in
        // the array of allowed addons, return `false`
        if(group.addons.indexOf(addon.type) < 0) {
            return false;
            // OPTIONAL: Throw error indicating the add-on
            // you are trying to attached in not an approved type
        }
        
        /* ******************************************** */
        /* CHECKS THE VALIDITY OF THE ADDONS AND ATTACH */
        /* ******************************************** */
        
        Smartix.Messages.Addons.attachAddons(newMessage._id, addons);
    }
}

Smartix.Messages.editMessage = function (messageId, newData, newAddons) {
    
    check(messageId, String);
    check(newData, Match.Maybe(Object));
    check(newAddons, Match.Maybe([Object]));
    
    // Get the original message
    var originalMessage = Smartix.Messages.Collection.findOne({
        _id: messageId
    });
    
    // If the original message does not exist
    // Return `false`
    if(!originalMessage) {
        return false;
        // OPTIONAL: Throw an error indicating that the message does not exist
    }
    
    /* ************************************** */
    /* CHECKS FOR PERMISSION TO EDIT IN GROUP */
    /* ************************************** */
    
    var group = Smartix.Messages.getGroupFromMessageId(messageId);
    
    // Checks if group exists
    if(!group) {
        return false;
        // OPTIONAL: Throw error saying the group specified does not exists
    }
    
    // Checks whether the currently logged-in user
    // has permission to edit a message for the group
    // The logic behind this would be different for different group types
    if(!Smartix[Smartix.Utilities.letterCaseToCapitalCase(group.type)].Messages.canEditMessage(groupId)) {
        return false;
        // OPTIONAL: Throw error saying you do not have
        // permission to edit messages for this group
    }
    
    var editedMessage = originalMessage;
    
    /* ******************************* */
    /* CHECKS THE VALIDITY OF NEW DATA */
    /* ******************************* */
    
    if(newData) {
        // Get the schema for the type and use it to clean the `newData` object
        Smartix.Messages[letterCaseToCapitalCase(originalMessage.type)].Schema.pick(['data']).clean(newData);
        
        // Validate using the same schema to ensure it conforms
        check(newData, Smartix.Messages[letterCaseToCapitalCase(originalMessage.type)].Schema.pick(['data']));
        
        /* ***************************** */
        /* CREATE NEW VERSION OF MESSAGE */
        /* ***************************** */  
        
        // overwrite any fields in the original message
        // with the new message
        var newMessage = _.assignIn(originalMessage, {data: newData});
        
        // Remove the `_id` property from the `newMessage`
        delete newMessage._id;
        
        // Adds the `id` of the original message to the `versions` array
        newMessage.versions = newMessage.versions || [];
        newMessage.versions.push(messageId);
        
        Smartix.Messages.cleanAndValidate(newMessage)
        
        // Create a new message
        editedMessage = Smartix.Messages.Collection.insert(newMessage);
    }
    
    
    /* ***************************************** */
    /* CHECKS FOR PERMISSION TO ATTACH THE ADDON */
    /* ***************************************** */
    
    if(newAddons) {
        if(!Smartix[Smartix.Utilities.letterCaseToCapitalCase(group.type)].Messages.canAttachAddons(groupId, addons)) {
            return false;
            // OPTIONAL: Throw error saying you do not have
            // permission to attach an addon for this group
        }
        
        // Checks that the group allows for this type of addon
        // If the addon type specified is not in
        // the array of allowed addons, return `false`
        if(group.addons.indexOf(addon.type) < 0) {
            return false;
            // OPTIONAL: Throw error indicating the add-on
            // you are trying to attached in not an approved type
        }
        
        /* ********************************************************* */
        /* CHECKS THE VALIDITY OF THE NEW ADDONS AND ATTACH/REPLACE  */
        /* ********************************************************* */
        
        Smartix.Messages.Addons.attachAddons(editedMessage._id, newAddons);
    }
}

Smartix.Messages.hideMessage = function (id) {
    
    // Checks that the `id` provided is of type String
    check(id, String);
    
    // Create a new message using `createMessage()`
    Smartix.Messages.Collection.update({
        _id: id
    }, {
        $set: {
            hidden: true
        }
    });
}

Smartix.Messages.deleteMessage = function (id) {
    
    // Checks that the `id` provided is of type String
    check(id, String);
    
    // Create a new message using `createMessage()`
    Smartix.Messages.Collection.update({
        _id: id
    }, {
        $set: {
            deletedAt: Date.now()
        }
    });
}

Smartix.Messages.undeleteMessage = function () {
    
    // Checks that the `id` provided is of type String
    check(id, String);
    
    // Create a new message using `createMessage()`
    Smartix.Messages.Collection.update({
        _id: id
    }, {
        $unset: {
            deletedAt: ""
        }
    });
}