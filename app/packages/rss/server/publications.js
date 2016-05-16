Meteor.publish('feedsForNamespace', function (namespace) {
    check(namespace, String);
    
    let namespacedFeeds = Smartix.Rss.FeedGroupLinks.find({
        namespace: namespace
    }).fetch();
    
    let feedIdArray = _.map(namespacedFeeds, function (feed) {
        return feed.url;
    });
    
    return Smartix.Rss.Feeds.find({
        _id: {
            $in: feedIdArray
        }
    })
    
});

Meteor.publish('feedLinksForNamespace', function (namespace) {
    check(namespace, String);
    
    return Smartix.Rss.FeedGroupLinks.find({
        namespace: namespace
    });
});

Meteor.publish('feedsOfNewsgroup', function (newsgroupId) {
    check(newsgroupId, String);
    return Smartix.Rss.Feeds.find({
        newsgroups: newsgroupId
    })
});

Meteor.publish('feedsOfNewsgroups', function (newsgroupIds) {
    check(newsgroupIds, [String]);
    return Smartix.Rss.Feeds.find({
        newsgroups: {
            $in: newsgroupIds
        }
    })
});

Meteor.publish('newsgroupsOfFeed', function (feedId) {
    check(feedId, String);
    let feedObj = Smartix.Rss.FeedGroupLinks.findOne({
        _id: feedId
    });
    
    return Smartix.Groups.Collection.find({
        _id: feedObj.newsgroups
    });
})


Meteor.publish('newsgroupsOfFeeds', function (feedIds) {
    check(feedIds, [String]);
    let feedObj = Smartix.Rss.FeedGroupLinks.findOne({
        _id: {
            $in: feedIds
        }
    });
    
    return Smartix.Groups.Collection.find({
        _id: feedObj.newsgroups
    });
})