Meteor.publish('newsgroups', function (newsgroups) {
    return Smartix.Groups.Collection.find({
        _id: {
            $in: newsgroups
        },
        type: 'newsgroup'
    });
});

Meteor.publish('newsInGroup', function (id,limit,query) {

});

Meteor.publish('newsgroupsForUser', function (limit,query,namespace) {
        //console.log('newsgroupsForUser',limit,query,namespace);
        var schoolDoc = SmartixSchoolsCol.findOne({
            username: namespace
        });
        
        if(!schoolDoc){
            schoolDoc = SmartixSchoolsCol.findOne({
                _id: namespace
            });            
        }
        
        return Smartix.Groups.Collection.find({
            namespace: schoolDoc._id,
            type: 'newsgroup',
            users: this.userId
        });

});

Meteor.publish('newsForUser', function (limit,query,namespace) {
        
        if(!limit){
            limit = 9999;
        }

        var schoolDoc = SmartixSchoolsCol.findOne({
            username: namespace
        });
        
        if(!schoolDoc){
            schoolDoc = SmartixSchoolsCol.findOne({
                _id: namespace
            });            
        }
                
        var groups = Smartix.Groups.Collection.find({
                    namespace: schoolDoc._id,
                    type: 'newsgroup',
                    users: this.userId
        },{fields: {_id: 1}}).fetch();
        
        //console.log('newsForUser',limit,query,namespace,groups);
        
        return Smartix.Messages.Collection.find(
            { group: { $in: lodash.map(groups, '_id') } },
            {sort: {createdAt: -1}, limit: limit}
        );

});

// Returns a cursor of all classes,
Meteor.publish('smartix:newsgroups/allNewsgroupsFromSchoolName', function (schoolName) {
    var schoolDoc = SmartixSchoolsCol.findOne({
        username: schoolName
    });
    if(schoolDoc) {
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
Meteor.publish('smartix:newsgroups/newsgroupByUrl', function (url) {
    return Smartix.Groups.Collection.find({
        url: url,
        type: 'newsgroup'
    });
});
