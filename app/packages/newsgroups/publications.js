Meteor.publish('newsInGroup', function (id,limit,query) {

});

Meteor.publish('newsgroupsForUser', function (limit,query,namespace) {
        //console.log('newsgroupsForUser',limit,query,namespace);
        return Smartix.Groups.Collection.find({
            namespace: namespace,
            type: 'newsgroup',
            users: this.userId
        });

});

Meteor.publish('newsForUser', function (limit,query,namespace) {
        
        if(!limit){
            limit = 9999;
        }
        
        var groups = Smartix.Groups.Collection.find({
                    namespace: namespace,
                    type: 'newsgroup',
                    users: this.userId
        },{fields: {_id: 1}}).fetch();
        
        //console.log('newsForUser',limit,query,namespace,groups);
        
        return Smartix.Messages.Collection.find(
            { group: { $in: lodash.map(groups, '_id') } },
            {sort: [["createdAt", "desc"]], limit: limit}
        );

});