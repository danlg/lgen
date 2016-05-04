Meteor.methods({
    'smartix:distribution-lists/create': function (users, namespace, name, url) {
        return Smartix.DistributionLists.createDistributionList(users, namespace, name, url, this.userId);
    },
    'smartix:distribution-lists/edit': function (id, options) {
        return Smartix.DistributionLists.editDistributionList(id, options, this.userId);
    },
    'smartix:distribution-lists/remove': function (id) {
        return Smartix.DistributionLists.removeDistributionList(id, this.userId);
    },
    'smartix:distribution-lists/addUsers': function (id, users) {
        return Smartix.DistributionLists.addUsersToList(id, users, this.userId);
    },
    'smartix:distribution-lists/removeUsers': function (id, users) {
        return Smartix.DistributionLists.removeUsersFromGroup(id, users, this.userId);
    }
});