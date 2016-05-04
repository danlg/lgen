Meteor.methods({
    'smartix:distribution-lists/create': function (users, schoolName, name, url) {
        let namespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolName);
        if(!namespace) {
            throw new Meteor.Error("school-not-exist", "The school with code " + schoolName + " does not exist.")
        }
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