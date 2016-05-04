Smartix = Smartix || {};

Smartix.DistributionLists = Smartix.DistributionLists || {};

Smartix.DistributionLists.Schema = new SimpleSchema({
	users: {
		type: [String]
	},
	namespace: {
		type: String
	},
	type: {
		type: String,
		autoValue: function () {
			return 'distributionList'
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