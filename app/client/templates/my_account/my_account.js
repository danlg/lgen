/*****************************************************************************/
/* MyAccount: Event Handlers */
/*****************************************************************************/
Template.MyAccount.events({
});

/*****************************************************************************/
/* MyAccount: Helpers */
/*****************************************************************************/
Template.MyAccount.helpers({
	current: function () {
    	return Meteor.user();
	}
});

/*****************************************************************************/
/* MyAccount: Lifecycle Hooks */
/*****************************************************************************/
Template.MyAccount.created = function () {
};

Template.MyAccount.rendered = function () {
};

Template.MyAccount.destroyed = function () {
};
