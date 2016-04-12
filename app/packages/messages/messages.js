Smartix.Messages.ValidTypes = [];

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

Smartix.Messages.isValidType = function (type) {
    return Smartix.Messages.ValidTypes.indexOf(type) > -1;
}

Smartix.Messages.createMessage = function (message) {
	// Clean the `message` object
	Smartix.Messages.Schema.clean(message);

	// Checks that the `message` object conforms to the schema
	check(message, Smartix.Messages.Schema);

	// Insert the message
	Smartix.Messages.Collection.insert(message);
}

Smartix.Messages.editMessage = function (id, alteredProperties) {
    
    // Checks that the `id` provided is of type String
    check(id, String);
    
    // Checks that the `alteredProperties` argument is an object
    check(alteredProperties, Object);
    
    // Get the original message
    var originalMessage = Smartix.Messages.Collection.findOne({
        _id: id
    });
    
    // If the original message does not exist
    // Return `false`
    if(!originalMessage) {
        return false;
        // OPTIONAL: Throw an error indicating that the message does not exist
    }
    
    // overwrite any fields in the original message
    // with the new message
    var newMessage = _.assignIn(originalMessage, alteredProperties)
    
    // Remove the `_id` property from the `newMessage`
    delete newMessage._id;
    
    // Adds the `id` of the original message to the `versions` array
    newMessage.versions = newMessage.versions || [];
    newMessage.versions.push(id);
    
    // Create a new message using `createMessage()`
    Smartix.Messages.createMessage(newMessage);
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