Meteor.publish('smartix:distribution-lists/listsBySchoolId', function(namespace) {
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

Meteor.publish('smartix:distribution-lists/distributionListsOfUser', function (userId, namespace) {
    
    // TODO - Check for permissions
    this.unblock();
    check(userId, Match.Maybe(String));
    check(namespace, String);

    userId = userId || this.userId;
    if (userId === this.userId
        || Smartix.Accounts.School.isAdmin(namespace, this.userId)
        || Smartix.Accounts.System.isAdmin(this.userId)) {

        let DistributionLists = Smartix.DistributionLists.getDistributionListsOfUser(userId);
        return Smartix.Groups.Collection.find({ _id: { $in: DistributionLists } });
    }
    else
        this.ready();
})