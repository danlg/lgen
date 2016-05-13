Meteor.publish('smartix:distribution-lists/listsBySchoolName', function(schoolName) {
    
    check(schoolName, String);

    let namespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolName);

    if (!namespace) {
        throw new Meteor.Error("school-not-exist", "The school with code " + schoolName + " does not exist.")
    }

    if (!Smartix.DistributionLists.hasPermission(namespace, this.userId)) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }

    return Smartix.Groups.Collection.find({
        namespace: namespace,
        type: "distributionList"
    });
});

Meteor.publish('smartix:distribution-lists/listsInNamespace', function(namespace) {

    check(namespace, String);

    if (!Smartix.DistributionLists.hasPermission(namespace, this.userId)) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }

    return Smartix.Groups.Collection.find({
        namespace: namespace,
        type: "distributionList"
    });
});

Meteor.publish('smartix:distribution-lists/list', function(id) {

    check(id, String);

    if (!Smartix.DistributionLists.hasPermissionForList(id, this.userId)) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }

    return Smartix.Groups.Collection.find({
        _id: id,
        type: "distributionList"
    });
});

Meteor.publish('smartix:distribution-lists/listByCode', function(code) {

    check(code, String);
    
    let list = Smartix.Groups.Collection.findOne({
        url: code,
        type: "distributionList"
    });

    if (!Smartix.DistributionLists.hasPermissionForList(list._id, this.userId)) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }

    return Smartix.Groups.Collection.find({
        _id: list._id,
        type: "distributionList"
    });
});

Meteor.publish('smartix:distribution-lists/basicInfoOfUsersInList', function(id) {

    check(id, String);
    
    if (!Smartix.DistributionLists.hasPermissionForList(id, this.userId)) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }
    
    let list = Smartix.Groups.Collection.findOne({
        _id: id,
        type: "distributionList"
    });
    
    if(list) {
        return Meteor.users.find({
            _id: list.users
        });
    } else {
        this.ready();
    }
});

Meteor.publish('smartix:distribution-lists/basicInfoOfUsersInListByCode', function(code) {

    check(code, String);
    
    let list = Smartix.Groups.Collection.findOne({
        url: code,
        type: "distributionList"
    });
    
    if (!Smartix.DistributionLists.hasPermissionForList(list._id, this.userId)) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }
    
    if(list) {
        return Meteor.users.find({
            _id: list.users
        });
    } else {
        this.ready();
    }
});

Meteor.publish('smartix:distribution-lists/distributionListsOfUser', function (userId) {
    
    // TODO - Check for permissions
    
    userId = userId || this.userId;
    return Smartix.DistributionLists.getDistributionListsOfUser(userId);
})