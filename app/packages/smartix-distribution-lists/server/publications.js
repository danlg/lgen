Meteor.publish({
    'smartix:distribution-lists/listsInNamespace': function (namespace) {
        
        check(namespace, String);
        
        if(!Smartix.DistributionLists.hasPermission(namespace, this.userId)) {
            throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
        }
        
        return Smartix.Groups.Collection.find({
            namespace: namespace,
            type: "distributionList"
        });
    },
    'smartix:distribution-lists/list': function (id) {
        
        check(namespace, String);
        
        if(!Smartix.DistributionLists.hasPermissionForList(id, this.userId)) {
            throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
        }
        
        return Smartix.Groups.Collection.find({
            _id: id,
            type: "distributionList"
        });
    }
});