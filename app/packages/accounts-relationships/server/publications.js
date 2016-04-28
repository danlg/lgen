// Publish specific user's relationships
Meteor.publish('userRelationships', function(userId) {
    
    check(userId, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(userId === null)) {
        userId = userId || Meteor.userId();
    }
    
    if (userId === this.userId
        || Smartix.Accounts.System.isAdmin(this.userId)) {
        // Return relationships belong to the current user, as a parent or as a child
        return Smartix.Accounts.Relationships.Collection.find({
            $or: [{
                parent: userId
            }, {
                child: userId
            }]
        });
    }
});

// Publish an user's relationships in a namespace
Meteor.publish('userRelationshipsInNamespace', function (userId, namespace) {
    
    check(userId, String);
    check(namespace, String);
    
    if (userId === this.userId
        || Smartix.Accounts.School.isAdmin(namespace, currentUser)
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
                    namespace: namespce
                }
            ]
            
        });
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
    }
});

