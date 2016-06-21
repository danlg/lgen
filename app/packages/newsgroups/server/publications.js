Meteor.publish('newsgroups', function(newsgroups) {
    return Smartix.Groups.Collection.find({
        _id: {
            $in: newsgroups
        },
        type: 'newsgroup'
    });
});

Meteor.publish('newsInGroup', function(id, limit, query) {

});



Meteor.publish('newsgroupsForUser', function(limit, query, namespace) {
    //log.info('newsgroupsForUser',limit,query,namespace);
    var schoolDoc = SmartixSchoolsCol.findOne({
        shortname: namespace
    });

    if (!schoolDoc) {
        schoolDoc = SmartixSchoolsCol.findOne({
            _id: namespace
        });
    }
    
    if(schoolDoc) {
        return Smartix.Groups.Collection.find({
            namespace: schoolDoc._id,
            type: 'newsgroup'
        });
    } else {
        this.ready();
    }
});

Meteor.publish('newsForUser', function(limit, query, namespace) {
    check(limit, Match.Maybe(Number));
    check(namespace, String);
    if (!limit) {
        limit = 9999;
    }
    var schoolDoc = SmartixSchoolsCol.findOne({
        shortname: namespace
    });
    if (!schoolDoc) {
        schoolDoc = SmartixSchoolsCol.findOne({
            _id: namespace
        });
    }
    var distributionListsUserBelong = Smartix.Groups.Collection.find({type: 'distributionList', users: this.userId }).fetch();
    var distributionListsUserBelongIds = lodash.map(distributionListsUserBelong,'_id');
    
    //log.info('distributionListsUserBelongIds',distributionListsUserBelongIds);
    
    var groups = Smartix.Groups.Collection.find({$or:[
            {
                namespace: schoolDoc._id,
                type: 'newsgroup',
                users: this.userId
            },
            {
                namespace: schoolDoc._id,
                type: 'newsgroup',
                distributionLists: {$in : distributionListsUserBelongIds }
            },            
        ]}, {
        fields: {
            _id: 1
        } 
    }).fetch();

    return Smartix.Messages.Collection.find({
            group: {
                $in: lodash.map(groups, '_id')
            }
        }, {
            sort: {
                createdAt: -1
            },
            limit: limit
        }
    );

});

// Returns a cursor of all classes,
Meteor.publish('smartix:newsgroups/allNewsgroupsFromSchoolName', function(schoolName) {
    var schoolDoc = SmartixSchoolsCol.findOne({
        shortname: schoolName
    });
    if (schoolDoc) {
        return Smartix.Groups.Collection.find({
            namespace: schoolDoc._id,
            type: 'newsgroup'
        });
    } else {
        this.ready();
    }

});

// Returns a cursor of a single class,
// Identified by `classCode`
Meteor.publish('smartix:newsgroups/newsgroupByUrl', function(url) {
    return Smartix.Groups.Collection.find({
        url: url,
        type: 'newsgroup'
    });
});
