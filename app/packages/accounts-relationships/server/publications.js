// Publish specific user's relationships
/**
 * Return the user "relationship collection"
 */
Meteor.publish('userRelationships', function(userId) {
    check(userId, Match.Maybe(String));
    if(!(userId === null)) {
        userId = userId || this.userId;
    }
    if (userId === this.userId
        || Smartix.Accounts.System.isAdmin(this.userId)
      //  || Smartix.Accounts.School.isAdmin(schoolId, userId)
    ) {
            return Smartix.Accounts.Relationships.getRelationshipsOfUser(userId);
    }
    this.ready();
});

Meteor.publish('getAllChildren', function(userId, namespace) {
    check(userId, Match.Maybe(String));
    if(!(userId === null)) {
        userId = userId || this.userId;
    }
    if (   userId === this.userId
        || Smartix.Accounts.School.isAdmin(schoolId, userId)
        || Smartix.Accounts.System.isAdmin(userId)
    ) {
        let relationshipCursor = Smartix.Accounts.Relationships.getRelationshipsOfUserByNamespace(userId, namespace);
        let childrenIds = [];
        relationshipCursor.forEach((relationship) => {
            //let parent = Meteor.users.findOne({"_id": relationship.parent});
            let child = Meteor.users.findOne({"_id": relationship.child});
            //defensive coding in case there are some orphan relationship without user
            if (child) {
                childrenIds.push(relationship.child)
            }
        });
        let children = Meteor.users.find({
            _id: { $in: childrenIds }
        });
        //log.info('publish getAllChildren', children.fetch());
        //log.info('publish getAllChildren', children.count());
        return children;
    }
    this.ready();
});

//Return the cursor of all parents and children in the relationship with currentUser

//what is the difference between 'usersFromRelationships' and 'userRelationships' ?
/**
 * Return the "user collection" of his / her relationship
 */

//Return the cursor of "Meteor.users" of all parents and children in the relationship with currentUser
//TODO add namespace
Meteor.publish('usersFromRelationships', function(userId){
    check(userId, Match.Maybe(String));
    if(!(userId === null)) {
        userId = userId || this.userId;
    }
    log.info ("publish usersFromRelationships", userId);
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
    // if (userId === this.userId
    //     we need to enable people to see their relationship. see required for RelatedUsersMobile
    //     || Smartix.Accounts.System.isAdmin(userId))
    // {
        let relationshipsArray = Smartix.Accounts.Relationships.getRelationshipsOfUser(userId);
        if(relationshipsArray)  {
            let users = [];
            relationshipsArray = relationshipsArray.fetch();
            //Roles.getUsersInRole(Smartix.Accounts.School.STUDENT, schoolNamespace)
            //if ()
            lodash.map(relationshipsArray, function(relationship){
                users.push(relationship.child);
                let findParents = Smartix.Accounts.Relationships.Collection.find({ child: relationship.child}).fetch();
                findParents.map(function (parents) {
                    users.push(parents.parent);
                });
            });
            log.info ("usersFromRelationshipsImpl users", users);
            lodash.without (users, userId);
            userCursor = Meteor.users.find(
                { _id: {$in: users} }
                //, { limit :5 } //TODO remove me
            );
            log.info ("usersFromRelationshipsImpl count", userId, userCursor.count());
            log.info ("usersFromRelationshipsImpl", userId, userCursor.fetch());
            return userCursor;
        }
        else log.warn("usersFromRelationshipsImpl empty", userId);
    // }  else log.warn("no access for", userId);
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
        return Smartix.Accounts.Relationships.getRelationshipsOfUserByNamespace (userId, namespace);
    } else {
        this.ready();
    }
});


// Publish all users' relationships in a namespace for admin usage
//WATCH OUT NO FUNCTION OVERLOAD IN JAVASCRIPT ! So different function name is safer !
//   userRelationshipsInNamespace
//vs usersRelationshipsInNamespace (note the extra s) ///anyway not used
// Meteor.publish('usersRelationshipsInNamespace', function(namespace) {
//     check(namespace, String);
//     if (Smartix.Accounts.System.isAdmin(currentUser)
//         || Smartix.Accounts.School.isAdmin(namespace, currentUser)
//     ) {
//         return Smartix.Accounts.Relationships.Collection.find({
//             namespace: namespace
//         });
//     } else {
//         this.ready();
//     }
// });

