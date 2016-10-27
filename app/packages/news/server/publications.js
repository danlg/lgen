Meteor.publish('allSchoolNews', function(schoolId) {
    let cursor = Smartix.Groups.Collection.find({
        namespace: schoolId,
        type: 'newsgroup'
    }).fetch();
    let newsgroupIds = lodash.map(cursor, '_id');
	log.info("allSchoolNews", newsgroupIds);
    return Smartix.Messages.Collection.find({
         $or: [
                {group: {$in: newsgroupIds}},
                {groups: {$in: newsgroupIds}}
            ],
        type: 'article'
    }, {
            sort: {
                "createdAt": -1 
            }
        });
});
