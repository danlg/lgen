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
    if (userId === this.userId
        || Smartix.Accounts.System.isAdmin(this.userId)) {
        let relationshipsArray = Smartix.Accounts.Relationships.getRelationshipsOfUser(userId);
        if(relationshipsArray)
        {
            let users = [];
            relationshipsArray = relationshipsArray.fetch();            
            lodash.map(relationshipsArray, function(relationship){
                users.push(relationship.child);
                let findParents = Smartix.Accounts.Relationships.Collection.find({ child: relationship.child}).fetch();
                findParents.map(function (parents) {
                    users.push(parents.parent);
                });
            });
            return Meteor.users.find(
                {_id: {$in: users}}
            );
        }
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

