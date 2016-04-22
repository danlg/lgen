Smartix = Smartix || {};

Smartix.Messages = Smartix.Messages || {};

Smartix.Messages.Addons = Smartix.Messages.Addons || {};

Smartix.Messages.Addons.ValidTypes = Smartix.Messages.Addons.ValidTypes || [];

//stub that should be removed by using the subpackages
Smartix.Messages.Addons.ValidTypes.push('documents','images','poll','voice','calendar','comment');

console.log('messages-addons',Smartix.Messages.Addons);

console.log('messages-addons-poll@messages-addons',Smartix.Messages.Addons.Poll.Schema);
//console.log('messages-addons-images@messages-addons',Smartix.Messages.Addons.Images.Schema);
console.log('messages-addons-documents@messages-addons',Smartix.Messages.Addons.Documents.Schema);
console.log('messages-addons-calendar@messages-addons',Smartix.Messages.Addons.Calendar.Schema);
//console.log('messages-addons-comment@messages-addons',Smartix.Messages.Addons.Comment.Schema);
//console.log('messages-addons-voice@messages-addons',Smartix.Messages.Addons.Voice.Schema);

/*
Smartix.Messages.Addons.Schema = new SimpleSchema({
    type: {
        type: String,
        allowedValues: Smartix.Messages.Addons.ValidTypes
    }
    
});*/

Smartix.Messages.Addons.attachAddons = function (messageId, addons) {
    // Checks that the `messageId` is of type `String`
    check(messageId, String);
    
    // Checks that the `addons` is of type `[Object]`
    check(addons, [Object]);
    
     for (var i = 0; i < addons.length; i++) {
        Smartix.Messages.Addons.attachAndReplaceAddon(messageId, addons[i])
    }
}

// Attach a new addon to the message
// If the addon of the same type already exists,
// It does nothing
Smartix.Messages.Addons.attachAddon = function (messageId, addon) {
    addon = Smartix.Messages.Addons.cleanAndValidate(messageId, addon);
    Smartix.Messages.Collection.update({
        _id: messageId,
        "addons.type": {
            $ne: addon.type
        }
    }, {
        $push: {
            addons: addon
        }
    });
}

// Detach an addon from the message
Smartix.Messages.Addons.attachAddon = function (messageId, types) {
    check(messageId, String);
    
    if(Smartix.Messages.Addons.canUserAttachAddon(messageId, types)) {
        Smartix.Messages.Collection.update({
            _id: messageId,
            "addons.type": {
                $ne: addon.type
            }
        }, {
            $pull: {
                addons: {
                    type: {
                        $in: types
                    }
                }
            }
        });
    }
}

// Same as `Smartix.Messages.Addons.attachAddon`
// But will replace the addon if it already exists
Smartix.Messages.Addons.attachAndReplaceAddon = function (messageId, addon) {
    console.log('attachAndReplaceAddon',messageId,addon);
    
    addon = Smartix.Messages.Addons.cleanAndValidate(messageId, addon);
    var updateCount = Smartix.Messages.Collection.update({
             _id: messageId
        }, {
        $pull: {
            addons: { $elemMatch: { type: addon.type}} 
        }
    });
    
    if(updateCount == 0 || updateCount == 1){
            Smartix.Messages.Collection.update({
                _id: messageId
            }, {
                $push: {
                    addons: addon
                }
            });        
    }
}

Smartix.Messages.Addons.cleanAndValidate = function (messageId, addon) {
    
    console.log('cleanAndValidate validtypes:',Smartix.Messages.Addons.ValidTypes);
    
    // Checks that the `messageId` is of type `String`
    check(messageId, String);
    
    // Checks that the type of addon is supported
    check(addon, Match.ObjectIncluding({
        type: Match.Where(function (x) {
            check(x, String);
            return Smartix.Messages.Addons.ValidTypes.indexOf(x) > -1;
        })
    }));
    
    // Clean the addon object
    console.log('clean the addon object', Smartix.Utilities.letterCaseToCapitalCase(addon.type));
    Smartix.Messages.Addons[Smartix.Utilities.letterCaseToCapitalCase(addon.type)].Schema.clean(addon);
    
    // Check the addon against the schema
    // provided by the child packages
    check(addon, Smartix.Messages.Addons[Smartix.Utilities.letterCaseToCapitalCase(addon.type)].Schema);
    
    return addon;
}

// Checks whether the currently-logged in user can attach an add-on of a specified type to a message
Smartix.Messages.Addons.canUserAttachAddon = function (messageId, types) {
    
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
    
    var group = Smartix.Messages.getGroupFromMessageId(messageId);
    
    // Checks if group exists
    if(!group) {
        return false;
        // OPTIONAL: Throw error saying the group specified does not exists
    }
    
    _.each(types, function (type, i, types) {
        if (Smartix.Messages.Addons.ValidTypes.indexOf(type) < 0) {
            return false;
            // OPTIONAL: Throw error saying the type is invalid
        }
    })
    
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
    
    return true;
}