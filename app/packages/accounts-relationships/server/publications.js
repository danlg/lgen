// Publish specific user's relationships
Meteor.publish('userRelationships', function(userId) {
    check(userId, Match.Maybe(String));
    if(!(userId === null)) {
        userId = userId || this.userId;
    }
    if (userId === this.userId
        || Smartix.Accounts.System.isAdmin(this.userId)) {
            return Smartix.Accounts.Relationships.getRelationshipsOfUser(userId);
    }
    this.ready();
});

//Return the cursor of all parents and children in the relationship with currentUser
Meteor.publish('usersFromRelationships', function(userId){
    check(userId, Match.Maybe(String));
    if(!(userId === null)) {
        userId = userId || this.userId;
    }
    let userCursor =  usersFromRelationshipsImpl (userId);
    if ( userCursor ) {
        return userCursor;
    }
    this.ready();
});

/**
 * @param userId
 * @returns the collection/cursor of users with whom the userId has a relationship
 */
var usersFromRelationshipsImpl =  (userId) => {
    if(!(userId === null)) {
        userId = userId || this.userId;
    }
    let userCursor ;
    if (userId === this.userId
        || Smartix.Accounts.System.isAdmin(userId)) {
        let relationshipsArray = Smartix.Accounts.Relationships.getRelationshipsOfUser(userId);
        if(relationshipsArray)  {
            let users = [];
            relationshipsArray = relationshipsArray.fetch();
            lodash.map(relationshipsArray, function(relationship){
                users.push(relationship.child);
                let findParents = Smartix.Accounts.Relationships.Collection.find({ child: relationship.child}).fetch();
                findParents.map(function (parents) {
                    users.push(parents.parent);
                });
            });
            userCursor = Meteor.users.find(
                { _id: {$in: users} }
                //, { limit :5 } //TODO remove me
            );
            return userCursor;
        }
    }
};

/**
 *
 */
Meteor.publish('ALLUsersRelationships', function(userId, schoolId) {
    log.info('publish.ALLUsersRelationships', userId, schoolId);
    check(userId, Match.Maybe(String));
    if(!(userId === null)) { userId = userId || this.userId; }
    //if (Smartix.Accounts.System.isAdmin(this.userId)) {
    if (Smartix.Accounts.School.isAdmin(schoolId, userId)
        || Smartix.Accounts.System.isAdmin(userId)) {
        //let relationshipsArray = Smartix.Accounts.Relationships.getAllRelationshipsForSchool(schoolId);
        let relationshipCursor = Smartix.Accounts.Relationships.getAllRelationshipsForSchool(schoolId);
        //log.info ("ALLUsersRelationships- relationshipsCursor", relationshipCursor.fetch());
        return relationshipCursor;
        // if(relationshipsArray) {
        //     log.info ("ALLUsersRelationships- relationshipsArray", relationshipsArray);
        //     lodash.map()
        //     //var childrenIds = lodash.map(relationRecords,'child');
        //     let userCursor = usersFromRelationshipsImpl(userId);
        //     if (userCursor) {
        //         log.info ("ALLUsersRelationships", userCursor.fetch());
        //         return Meteor.users.find( { _id : {$in: userCursor.fetch()}} );
        //     }
        //     else{
        //         log.info ("ALLUsersRelationships - not found", );
        //     }
        // }
    }
    else{
        log.warn('publish.ALLUsersRelationships.not authorized');
    }
    this.ready();
});

// Publish an user's relationships in a namespace
Meteor.publish('userRelationshipsInNamespace', function (userId, namespace) {
    check(userId, Match.Maybe(String));
    check(namespace, String);
    if (userId === this.userId
        || Smartix.Accounts.School.isAdmin(namespace, this.userId)
        || Smartix.Accounts.System.isAdmin(this.userId)) {
        // Return relationships belong to the current user
        // as a parent or as a child
        // For the namespace specified
        return Smartix.Accounts.Relationships.Collection.find({
            $and: [
                {
                    $or: [{
                        parent: userId
                    }, {
                        child: userId
                    }]
                },
                {
                    namespace: namespace
                }
            ]
        });
    } else {
        this.ready();
    }
});


// Publish all users' relationships in a namespace for admin usage
Meteor.publish('usersRelationshipsInNamespace', function(namespace) {
    
    check(namespace, String);
    
    if (Smartix.Accounts.System.isAdmin(currentUser)
        || Smartix.Accounts.School.isAdmin(namespace, currentUser)
    ) {
        return Smartix.Accounts.Relationships.Collection.find({
            namespace: namespace
        });
    } else {
        this.ready();
    }
});

