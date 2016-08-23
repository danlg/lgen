Meteor.methods({
    'smartix:distribution-lists/create': function (users, schoolName, distlistName, url) {
        // log.info('smartix:distribution-lists/create:users', users);
        // log.info('smartix:distribution-lists/create:schoolName', schoolName);
        // log.info('smartix:distribution-lists/create:distlistName', distlistName);
        // log.info('smartix:distribution-lists/create:url', url);
        let schoolId = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolName);
        if(!schoolId) {
            const msg = "The school with code " + schoolName + " does not exist.";
            log.error(msg);
            throw new Meteor.Error("school-not-exist", msg);
        }
        return Smartix.DistributionLists.createDistributionList({
            users: users,
            namespace: schoolId,
            name: distlistName,
            url: url,
            expectDuplicates: false,
            upsert: false
        }, this.userId);
    },
            
    'smartix:distribution-lists/duplicate': function(distlistId, listName){
        return Smartix.DistributionLists.duplicateDistributionList(distlistId, listName, this.userId);    
    },
    
    'smartix:distribution-lists/edit': function (name, options) {
        let distributionList = Smartix.Groups.Collection.findOne({
            url: name
        });
        let id = distributionList._id;
        return Smartix.DistributionLists.editDistributionList(id, options, this.userId);
    },
    'smartix:distribution-lists/remove': function (id) {
        return Smartix.DistributionLists.removeDistributionList(id, this.userId);
    },
    'smartix:distribution-lists/addUsers': function (id, users) {
        return Smartix.DistributionLists.addUsersToList(id, users, this.userId);
    },
    'smartix:distribution-lists/addUsersByListName': function (name, users) {
        let distributionList = Smartix.Groups.Collection.findOne({
            url: name
        });
        if(distributionList) {
            return Smartix.DistributionLists.addUsersToList(distributionList._id, users, this.userId);
        } else {
            throw new Meteor.Error('list-not-found', "Distribution list with the code " + name + " could not be found.");
        }
    },
    'smartix:distribution-lists/removeUsers': function (id, users) {
        return Smartix.DistributionLists.removeUsersFromList(id, users, this.userId);
    },
    'smartix:distribution-lists/removeUsersByListName': function (name, users) {
        let distributionList = Smartix.Groups.Collection.findOne({
            url: name
        });
        if(distributionList) {
            return Smartix.DistributionLists.removeUsersFromList(distributionList._id, users, this.userId);
        } else {
            throw new Meteor.Error('list-not-found', "Distribution list with the code " + name + " could not be found.");
        }
    }
});