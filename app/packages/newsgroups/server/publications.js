Meteor.publish('newsgroups', function(newsgroups) {
    return Smartix.Groups.Collection.find({
        _id: {
            $in: newsgroups
        },
        type: 'newsgroup'
    });
});

Meteor.publish('newsgroupsForUser', function(userId, query, namespace) {
    this.unblock();
    check(userId, Match.Maybe(String));
    check(namespace, String);

    userId = userId || this.userId;
    if (userId === this.userId
        || Smartix.Accounts.School.isAdmin(namespace, this.userId)
        || Smartix.Accounts.System.isAdmin(this.userId)){
                var schoolDoc = SmartixSchoolsCol.findOne({
                    shortname: namespace
                });
                if (!schoolDoc) {
                    schoolDoc = SmartixSchoolsCol.findOne({
                        _id: namespace
                    });
                }
                if(schoolDoc) {
                    groups = Smartix.Newsgroup.getNewsgroupOfUser(userId, schoolDoc);
                    return groups;
                } else {
                    this.ready();
                }
        }
        else
            this.ready();
});


/**
 * Publish Composite Function
 * @return Messages for a particular user (Parent)
 * @return Images for each messageObj (Child)
 * imageIds cotains union of all fileIds for particular message
 */
Meteor.publishComposite('newsForUser', function(limit, query, namespace) {
    this.unblock();
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
        var groups = Smartix.Newsgroup.getNewsgroupOfUser(this.userId, schoolDoc);
        if(groups)
        {
            groups = groups.fetch();
            return { 
                find: function(){
                    let now = new Date();//moment();
                    let offsetEvent =     24 * 3600 * 1000; //24h in milliseconds
                    let expiredEvent = new Date (now.getTime() - offsetEvent);// wait 24h before removing it

                    let offsetNews  = 7 * 24 * 3600 * 1000; //10 days * 24h in milliseconds
                    let expiredNews  = new Date (now.getTime() - offsetNews);// wait 7d  before removing it
                    //log.info("newsForUser:school", namespace);
                    //log.info("newsForUser:userId", this.userId);
                    let find = Smartix.Messages.Collection.find(
                        {
                            $or:[
                                //news without event
                                {
                                    group: {$in: lodash.map(groups, '_id')},
                                    'type' : 'article', //important to get only news ! and not txt messages !
                                    'addons.type' : { $ne:'calendar'},
                                    hidden: false,
                                    deletedAt: { $exists: false },
                                    createdAt: {$gte: expiredNews}
                                },
                                //news WITH calendar event
                                {
                                    group: {$in: lodash.map(groups, '_id')},
                                    'type' : 'article', //important to get only news ! and not txt messages !
                                    'addons.type' : 'calendar',
                                    hidden: false,
                                    deletedAt: { $exists: false },
                                    'addons.endDate': {$gte: expiredEvent}
                                }
                            ]
                        }
                        , {
                            sort: { createdAt: -1}, //for news, sorted by most recent first
                            limit: limit
                        }
                    );
                    //log.info("newsForUser.count",find.count());
                    //log.info("newsForUser.docs",find.fetch());
                    return find;
                },
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
    }
    else {
        this.ready();
    }
});

/**
 * Publish calendar for a given user
 * @return the calendar entries for the user
 */
Meteor.publish('calendarEntriesForUser', function(limit, query, namespace) {
    check(limit, Match.Maybe(Number));
    check(namespace, String);
    // if (!limit) {
    //     limit = 9999;
    // }
    var schoolDoc = SmartixSchoolsCol.findOne({
        shortname: namespace
    });
    if (!schoolDoc) {
        schoolDoc = SmartixSchoolsCol.findOne({
            _id: namespace
        });
    }
    if (schoolDoc){
        var groups = Smartix.Newsgroup.getNewsgroupOfUser(this.userId, schoolDoc);
        if(groups)
        {
            groups = groups.fetch();
            let now = new Date();//moment();
            let offset = 24 * 3600 * 1000; //24h in milliseconds
            let expired = new Date (now.getTime() - offset);// wait 24h before removing it
            //log.info("calendarEntriesForUser:now", now.unix());
            //log.info("calendarEntriesForUser:now", now);
            let calendarMessagesCursor = Smartix.Messages.Collection.find({
                $and:[
                    {
                        $or:[//live calendar entries
                            {
                                'addons.type':'calendar',
                                group: { $in: lodash.map(groups, '_id')},
                                //group: { $in: newsgroupsIds },
                                hidden : false,
                                deletedAt:""
                            },
                            {
                                'addons.type':'calendar',
                                group: { $in: lodash.map(groups, '_id')},
                                hidden: false,
                                deletedAt: { $exists: false }
                            }
                        ]
                    }
                    //moment(calenderEvent[0].endTime).: { $gt : moment()}
                    //TODO add offset
                    // , {//not expired
                    //     //'addons.endDate': { $gte : now.unix() }
                    //     'addons.endDate': { $gte : expired }
                    // }
                ]}
                , { //sort them by ascending order
                    //TODO add fields projection...
                    sort: { 'addons.startDate': 1 } //for calendar event, sorted by chronological order
                }
            // ).fetch();
            );
            //log.info("calendarEntriesForUser:calendarMessages:school", namespace);
            //log.info("calendarEntriesForUser:calendarMessages.count", calendarMessagesCursor.count());
            //log.info("calendarEntriesForUser:calendarMessages", calendarMessagesCursor.fetch());
            return calendarMessagesCursor;
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
    //log.info("smartix:newsgroups/allNewsgroupsFromSchoolName", schoolName, schoolDoc);
    if (schoolDoc) {
        let cursor = Smartix.Groups.Collection.find({
            namespace: schoolDoc._id,
            type: 'newsgroup'
        });
        //log.info("smartix:newsgroups/allNewsgroupsFromSchoolName count", cursor.count());
        //log.info("smartix:newsgroups/allNewsgroupsFromSchoolName detail", cursor.fetch());
        return cursor;
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
