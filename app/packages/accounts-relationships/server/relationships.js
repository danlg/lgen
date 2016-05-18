Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.Relationships = Smartix.Accounts.Relationships || {};

Smartix.Accounts.Relationships.getRelationship = function (relId, currentUser) {
    
    check(relId, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    var targetRelationship = Smartix.Accounts.Relationships.Collection.findOne(relId);
    if (!targetRelationship) {
        throw new Meteor.Error('relationship-not-found', 'Relationship with the id ' + relId + ' could not be found.');
    }

    if (currentUser === targetRelationship.parent
        || currentUser === targetRelationship.child
        || Smartix.Accounts.System.isAdmin(currentUser)
        || Smartix.Accounts.School.isAdmin(targetRelationship.namespace, currentUser)
    ) {
        return targetRelationship;
    }
};

Smartix.Accounts.Relationships.createRelationship = function(options, currentUser) {

    Smartix.Accounts.Relationships.Schema.clean(options);
    check(options, Smartix.Accounts.Relationships.Schema);
    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }

    if (Smartix.Accounts.System.isAdmin(currentUser)
        || Smartix.Accounts.School.isAdmin(options.namespace, currentUser)
    ) {
        
        if(!Smartix.Accounts.School.isMember(options.parent, options.namespace)) {
            throw new Meteor.Error("parent-not-belong-to-school", "Parent does not belong to school with namespace " + options.namespace);
        }
        
        if(!Smartix.Accounts.School.isMember(options.child, options.namespace)) {
            throw new Meteor.Error("child-not-belong-to-school", "Child does not belong to school with namespace " + options.namespace)
        }

        // if (Smartix.Accounts.Relationships.Collection.findOne({
        //     parent: options.parent,
        //     child: options.child,
        //     namespace: options.namespace
        // })) {
        //     throw new Meteor.Error("existing-parent-child-relationship", "existing parent-child relationship bewteen this two persons");
        // }
        
        
        
        return Smartix.Accounts.Relationships.Collection.upsert({
               parent: options.parent,
               child: options.child,
               namespace: options.namespace
        }, {
            $set: options
        });
        
        // return Smartix.Accounts.Relationships.Collection.insert(options);
        
    } else {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }
};

Smartix.Accounts.Relationships.removeRelationship = function(relId, currentUser) {

    check(relId, String);

    check(currentUser, Match.Maybe(String));

    // Get the `_id` of the currently-logged in user
    if (!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    let targetRelationship = Smartix.Accounts.Relationships.Collection.findOne({
        _id: relId
    });
    
    if (!targetRelationship) {
        throw new Meteor.Error('relationship-not-found', 'Relationship with the id ' + relId + ' could not be found.');
    }

    if (Smartix.Accounts.School.isAdmin(targetRelationship.namespace, currentUser)
        || Smartix.Accounts.System.isAdmin(currentUser)
    ) {
        return Smartix.Accounts.Relationships.Collection.remove(relId);
    } else {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }

}

// Checks whether the (supposed) parent is actually
// The parent for the student, as defined by
// The school with the namespace
Smartix.Accounts.Relationships.isParent = function (studentId, parentId, namespace) {
    
    check(studentId, String);
    check(parentId, String);
    check(namespace, String);
    
    return Smartix.Accounts.Relationships.Collection.findOne({
        parent: parentId,
        child: studentId,
        namespace: namespace
    });
}

Smartix.Accounts.Relationships.getParentOfStudent = function (studentId, namespace) {
    
    check(studentId, String);
    check(namespace, String);
    
    let relevantRelationships = Smartix.Accounts.Relationships.Collection.find({
        child: studentId,
        namespace: namespace
    }).fetch();
    
    return _.map(relevantRelationships, function (val) {
        return val.parent;
    })
}

Smartix.Accounts.Relationships.getChildsOfParent = function (parentId,namespace) {
    
    check(namespace, String);
    return Smartix.Accounts.Relationships.Collection.find({
        parent: parentId,
        namespace: namespace
    }).fetch();
}