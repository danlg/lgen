Smartix = Smartix || {};

Smartix.Newsgroup = Smartix.Newsgroup || {};

Smartix.Newsgroup.Schema = new SimpleSchema({
	users: {
		type: [String]
	},
	namespace: {
		type: String
	},
	type: {
		type: String,
		autoValue: function () {
			return 'newsgroup'
		}
	},
	name: {
		type: String,
		optional: true
	},
	addons: {
		type: [String],
		optional: true,
		defaultValue: {}
	},
	url: {
		type: String,
		regEx: /^[a-zA-Z0-9-]{3,}$/
	},
	admins: {
		type: [String],
		minCount: 1
	},
	comments: {
		type: Boolean,
		defaultValue: false
	}
});