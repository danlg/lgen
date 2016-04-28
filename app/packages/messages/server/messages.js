Smartix = Smartix || {};

Smartix.Messages = Smartix.Messages || {};

//console.log('smartix:messages:validTypes@message', Smartix.Messages.ValidTypes);
Smartix.Messages.ValidTypes = Smartix.Messages.ValidTypes || [];

//console.log('message-addons-calendar@message',Smartix.Messages.Addons.Calendar.Schema);

// Checks whether a type is supported
Smartix.Messages.isValidType = function (type) {
    console.log('Smartix.Messages.isValidType',Smartix.Messages.ValidTypes);
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
    
    //console.log('Smartix.Utilities.letterCaseToCapitalCase(message.type)', Smartix.Utilities.letterCaseToCapitalCase(message.type));
    //console.log('Smartix.Messages[Smartix.Utilities.letterCaseToCapitalCase(message.type)]', Smartix.Messages[Smartix.Utilities.letterCaseToCapitalCase(message.type)]);
    
    //console.log('message-beforeclean; ', message);
    // Clean the message
    Smartix.Messages[Smartix.Utilities.letterCaseToCapitalCase(message.type)].Schema.clean(message);
    
    // Checks the data provided conforms to the schema for that message type
    //console.log('message-afterclean: ', message);
    
    var correspondingSchema = Smartix.Messages[Smartix.Utilities.letterCaseToCapitalCase(message.type)].Schema;
    //console.log( correspondingSchema );
    
    var result = check(message, correspondingSchema);
    
    // As a backup in case the child packages
    // Did not implement the schema correctly,
    // Clean the `message` object with the master `Smartix.Messages.Schema`
	Smartix.Messages.Schema.clean(message);

	// Checks that the `message` object conforms to the `Smartix.Messages.Schema`
	check(message, Smartix.Messages.Schema);
}

Smartix.Messages.createMessage = function (groupId, messageType, data, addons, isPush) {
    console.log('Smartix.Messages.createMessage',groupId,messageType,data,addons);
    check(groupId, String);
    check(messageType, String);
    check(data, Object);
    
    //Match.Maybe is only available at meteor 1.3
    //https://github.com/meteor/meteor/issues/3876
    check(addons, Match.OneOf(undefined,null,[Object]));
    
    /* ************************************** */
    /* CHECKS FOR PERMISSION TO POST IN GROUP */
    /* ************************************** */
    
    // Query to the get group
    var group = Smartix.Groups.Collection.findOne({
        _id: groupId
    });
    
    // Checks if group exists
    if(!group) {
        console.log('group not exist');
        return false;
        
        // OPTIONAL: Throw error saying the group specified does not exists
    }
    
    // Checks whether the currently logged-in user
    // has permission to create a message for the group
    // The logic behind this would be different for different group types
    if(!Smartix[Smartix.Utilities.letterCaseToCapitalCase(group.type)].Messages.canCreateMessage(groupId, group.type)) {
        
        console.log('no permission to create message for this group');
        return false;
        // OPTIONAL: Throw error saying you do not have
        // permission to create message for this group
    }
    
    /* ********************************** */
    /* CHECKS THE VALIDITY OF THE MESSAGE */
    /* ********************************** */
    
    // Checks that this type of message is valid
    if(!Smartix.Messages.isValidType(messageType)) {
        console.log('type specified is not recognized');
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
    
    //i.e of an addOn Obj:
    //{type:'documents'}
    //{type:'images'}
    //{type:'poll'}
    //{type:'voice'}
    //{type:'calendar'}
    //{type:'comments'}
    
    //e.g:
    //class's msg allow addons can be all of the above
    //chat's  msg allow addons are files/images and/or voice
    //news's  msg allow addons are files/images and/or voice
    
    console.log('newMessage',newMessage);
    if(addons) {
        
        /* ***************************************** */
        /* CHECKS FOR PERMISSION TO ATTACH THE ADDON */
        /* ***************************************** */
        
        //Group-Type Addons check
        //e.g This is class, so all addons are allowed. We input the newMessage Id , and the addons for the examination
        
        if(!Smartix[Smartix.Utilities.letterCaseToCapitalCase(group.type)].Messages.canAttachAddons(newMessage, addons)) {
            console.log('not in canAttachAddons in this group type', Smartix.Utilities.letterCaseToCapitalCase(group.type));
            return false;
            // OPTIONAL: Throw error saying you do not have
            // permission to attach an addon for this group
        }
        
        //Group-Type Instance Addons check. even  more restricted.
        //e.g This is terence's class, which is more restricted that class admin cannot send msg with documents addons
                
        // Checks that the group allows for this type of addon
        // If the addon type specified is not in
        // the array of allowed addons, return `false` 
        addons.map(function(eachAddOn){
            
            if(group.addons.indexOf(eachAddOn.type) < 0) {
                console.log('not in canAttachAddons in this specific group instance', Smartix.Utilities.letterCaseToCapitalCase(group.type));
                return false;
                // OPTIONAL: Throw error indicating the add-on
                // you are trying to attached in not an approved type
            }
            
        });

        
        /* ******************************************** */
        /* CHECKS THE VALIDITY OF THE ADDONS AND ATTACH */
        /* ******************************************** */
        Smartix.Messages.Addons.attachAddons(newMessage, addons);
    }
    
    if(isPush){
        //2. add notification to notifications collection
        //add notifications to db        
        group.users.map(function(eachTargetUser){
            Notifications.insert({
                eventType:"new"+group.type+"message",
                userId: eachTargetUser,
                hasRead: false,
                groupId: groupId,
                messageCreateTimestamp: message.createdAt,
                messageCreateByUserId: Meteor.userId()
            },function(){
                
                //3. send push notification and in-app notification
                var notificationObj = {
                    from : Smartix.helpers.getFullNameByProfileObj(Meteor.user().profile),
                    title : Smartix.helpers.getFullNameByProfileObj(Meteor.user().profile),
                    text: message.data.content,
                    payload:{
                        type: group.type,
                        groupId: groupId
                    },
                    query:{userId:eachTargetUser},
                    badge: Smartix.helpers.getTotalUnreadNotificationCount(eachTargetUser._id)
                };
                Meteor.call("serverNotification", notificationObj,{
                    groupId: groupId,
                    classCode: group.classCode || ""
                });             
                
            });
        });               
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