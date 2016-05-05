Smartix = Smartix || {};

Smartix.Class = Smartix.Class || {};

Smartix.Class.Schema = new SimpleSchema({
	users: {
		type: [String],
        defaultValue: []
	},
	namespace: {
		type: String
	},
	type: {
		type: String,
		defaultValue: 'class'
	},
	className: {
		type: String,
        trim: true
	},
	addons: {
		type: [String],
		optional: true,
		defaultValue: []
	},
    classCode: {
        type: String,
        trim: true,
        unique: true,
        regEx: /^[a-zA-Z0-9-]{3,}$/,
        custom: function () {
            var inputClassCode = this.value.trim();
            if (Meteor.isServer && this.isSet ) {
                if(Smartix.Class.searchForClassWithClassCode(inputClassCode)) {
                    // If a class with the classCode already exists
                    // Invalidate Autoform and provides a suggestion
                    log.info('classcode already exist');
                    return 'classcode already exist';
                }
            }
        }
    },
	admins: {
		type: [String],
		minCount: 1
	},
	comments: {
		type: Boolean,
		defaultValue: true
	},
    ageRestricted: {
        type: Boolean,
		defaultValue: true
    },
    anyoneCanChat:{
        type: Boolean,
		defaultValue: true
    },
    createdAt: {
        type: Date,
        autoValue: function () {
                return new Date();
        }
    },
    classAvatar:{
        type: String,
        trim: true,
        optional: true
    },
    lastUpdatedBy: {
        type: String,
        optional: false,
        autoValue: function () {
            return Meteor.userId();
        }
    },
    lastUpdatedAt: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    }
});