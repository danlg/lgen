Meteor.publish('newsgroups', function(newsgroups) {
    return Smartix.Groups.Collection.find({
        _id: {
            $in: newsgroups
        },
        type: 'newsgroup'
    });
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
        groups = Smartix.Newsgroup.getNewsgroupOfUser(this.userId, schoolDoc);
        return groups;
    } else {
        this.ready();
    }
});


/**
 * Publish Composite Function
 * @return Messages for a particular user (Parent)
 * @return Images for each messageObj (Child)
 * imageIds cotains union of all fileIds for particular message
 */
Meteor.publishComposite('newsForUser', function(limit, query, namespace) {
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
    if (schoolDoc){
        var groups = Smartix.Newsgroup.getNewsgroupOfUser(this.userId, schoolDoc).fetch();
        return { 
            find: function(){
                return Smartix.Messages.Collection.find({
                        group: {$in: lodash.map(groups, '_id')}},
                        {sort: {createdAt: -1},
                        limit: limit
                    }
                );},
            children:[
                {
                    find: function(messageObj){
                        var images = [];
                        images = lodash.filter(messageObj.addons, function(addOns){
                                return addOns.type === 'images'
                            });
                        var imageIds = imageIds || [];
                        imageIds = images.map(function(addOns){
                            return addOns.fileId;
                        });
                        // log.info("ImageIds", imageIds);
                        return Images.find({'_id': {$in: imageIds}});
                    }
                },
                {
                     find: function(messageObj){
                        var documents = [];
                        documents = lodash.filter(messageObj.addons, function(addOns){
                                return addOns.type === 'documents'
                            });
                        var documentIds = documentIds || [];
                        documentIds = documents.map(function(addOns){
                            return addOns.fileId;
                        });
                        return Documents.find({'_id': {$in: documentIds}});
                    }
                }
            ]
        }
    }
    else {
        this.ready();
    }
});

// Returns a cursor of all newsgroups,
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

Meteor.publish('smartix:newsgroups/imagesForNewsUpload', function(schoolName)
{
    return Images.find({
        'metadata.school': schoolName,
        'metadata.category': 'news'
    })
});

Meteor.publish('smartix:newsgroups/documentsForNewsUpload', function(schoolName)
{
    return Documents.find({
        'metadata.school': schoolName,
        'metadata.category': 'news'
    })
});
