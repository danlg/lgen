_ = lodash;

// Returns a cursor of all classes,
Meteor.publish('smartix:classes/allClasses', function () {
    return Smartix.Groups.Collection.find({
        type: 'class'
    });
});

// Returns a cursor of all classes,
Meteor.publish('smartix:classes/allClassesFromSchoolName', function (schoolName) {
    var schoolDoc = SmartixSchoolsCol.findOne({
        shortname: schoolName
    });
    if(schoolDoc) {
        return Smartix.Groups.Collection.find({
            namespace: schoolDoc._id,
            type: 'class'
        });
    } else {
        this.ready();
    }
    
});

// Returns a cursor of a single class,
// Identified by `_id`
Meteor.publish('smartix:classes/classById', function (id) {
    return Smartix.Groups.Collection.find({
        _id: id,
        type: 'class'
    });
});

// Returns a cursor of a single class,
// Identified by `classCode`
Meteor.publish('smartix:classes/classByClassCode', function (classCode) {
    return Smartix.Groups.Collection.find({
        classCode: classCode,
        type: 'class'
    });
});

// Returns a cursor of all classes where
// the current user is a member or an admin
Meteor.publish('smartix:classes/associatedClasses', function () {
    
    
    return Smartix.Groups.Collection.find({
        type: 'class',
        $or: [{
            users: this.userId
        }, {
            admins: this.userId
        }, {
            distributionLists: {
                $in: Smartix.DistributionLists.getDistributionListsOfUser(this.userId)
            }
        }]
    });
});

// Returns a cursor of all classes where
// the current user is a member
Meteor.publish('joinedClasses', function () {
    return Smartix.Groups.Collection.find({
        type: 'class',
        $or: [{
            users: this.userId
        }, {
            distributionLists: {
                $in: Smartix.DistributionLists.getDistributionListsOfUser(this.userId)
            }
        }]
    });
});

Meteor.publish('smartix:classes/otherClassmates', function(classCode) {

    var group = Smartix.Groups.Collection.findOne({ classCode: classCode });
    if (group) {
        
        let classmates = [];
        
        // Add to `classmates` from the `users` array
        classmates = _.union(classmates, group.users);
        
        // Get all users in distribution lists
        classmates = _.union(classmates, Smartix.DistributionLists.getUsersInDistributionLists(group.distributionLists));
        
        lodash.pull(classmates, this.userId);
        
        return Meteor.users.find({
            _id: {
                $in: classmates
            }
        });
    }

});

// Returns a cursor of all users that have joined ANY one of the current teacher's classes
Meteor.publish('smartix:classes/allUsersWhoHaveJoinedYourClasses', function () {
    // Find all classes where the current user is an admin
    // Limit the fields returned to `users`
    // Fetch as an array
    var classes = Smartix.Groups.Collection.find({
        type: 'class',
        admins: this.userId
    }, {
        fields: {
            users: 1,
            distributionLists: 1
        }
    }).fetch();

    // Extract all the users from the `users` property
    // from all classes into another array  
    var users = _.flatMap(classes, 'users');
    var distList = _.flatMap(classes, 'distributionLists');
    // Extract all the users from the distribtion lists
    users = _.union(users, Smartix.DistributionLists.getUsersInDistributionLists(distList));
    // Remove the current user from the list of users
    users = _.pull(users, this.userId); 
    // Return a cursor of all users in the `users` array
    return Meteor.users.find({
    _id: {
        $in: users
    }
    });
});

// Return a cursor of all admins of classes you have joined
// Meteor.publish('smartix:classes/adminsOfJoinedClasses', Smartix.Class.AdminsOfJoinedClasses); 

// Returns a cursor of all admin users of a class
Meteor.publish('smartix:classes/adminsOfClass', function (classCode) {
    var targetClass = Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: classCode
    });
    if (targetClass) {
        return Meteor.users.find({
            _id: {
                $in: targetClass.admins
            }
        });
    } else {
        //http://stackoverflow.com/questions/25709362/stuck-on-loading-template
        //this.ready() indicates nothing return; you cannot use return "" or return null in such case
        this.ready();
    }
});

Meteor.publish('smartix:classes/distributionListsOfClass', function (classCode) {
    
    let distributionListsOfClass = Smartix.Class.getDistributionListsOfClass(classCode);
    
    if(distributionListsOfClass) {
        return distributionListsOfClass;
    } else {
        this.ready();
    }
})