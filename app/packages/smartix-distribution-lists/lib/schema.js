Smartix = Smartix || {};

Smartix.Mastergroups = Smartix.Mastergroups || {};

Smartix.Mastergroups.Schema = new SimpleSchema({
	users: {
		type: [String]
	},
	namespace: {
		type: String
	},
	type: {
		type: String,
		autoValue: function () {
			return 'mastergroup'
		}
	},
	name: {
		type: String,
		optional: true
	},
	url: {
		type: String,
		regEx: /^[a-zA-Z0-9-]{3,}$/
	}
});