Meteor.startup(function() {
    // Push new RSS messages to newsgroups every hour (3600000 miliseconds)
    Meteor.setInterval(function () {
        
        console.log("--- PROCESSING RSS TO NEWS ---")
        
        // Get the RSS feed entries that have not been processed
        let unprocessedFeedEntries = Smartix.Rss.FeedEntries.find({
            processed: {$ne: true}
        }).fetch();
        
        // For each of the entries
        _.each(unprocessedFeedEntries, function (feedEntry) {
            
            // Construct the news message object
            data = {};
            data.title = feedEntry.title;
            data.content = feedEntry.description + " Read more at " + feedEntry.link;
            
            // Get the feed_id (url) of the entry
            // Query the `smartix:rss/feed-group-links` collection to find which newsgroups are linked to the RSS
            let feedGrouplinks = Smartix.Rss.FeedGroupLinks.find({
                url: feedEntry.feed_id
            }).fetch();
            
            _.each(feedGrouplinks, function(feedGrouplink) {
                if(feedGrouplink && Array.isArray(feedGrouplink.newsgroups)) {
                    // For each of these newsgroups, push a new messages
                    _.each(feedGrouplink.newsgroups, function (newsgroup) {
                        // Get the first admin for the newsgroup to use as the author
                        let newsgroupObj = Smartix.Groups.Collection.findOne({
                            _id: newsgroup
                        });
                        
                        if(newsgroupObj && Array.isArray(newsgroupObj.admins)) {
                            Smartix.Messages.createMessage(newsgroup, 'article', data, null, true, newsgroupObj.admins[0]);
                        }
                    })
                }
            })
        });
        
        // Get the _id of all the `unprocessedFeedEntries`
        // Set them all to `processed: true`
        let unprocessedFeedEntriesIds = _.map(unprocessedFeedEntries, function (feedEntry) {
            return feedEntry._id;
        });
        
        Smartix.Rss.FeedEntries.update({
            _id: {$in: unprocessedFeedEntriesIds}
        }, {
            $set: {
                processed: true
            }
        }, {
            multi: true
        });
        
    }, Meteor.settings.RSS_PROCESS_INTERVAL);
});