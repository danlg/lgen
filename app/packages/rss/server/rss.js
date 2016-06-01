Smartix = Smartix || {};
Smartix.Rss = Smartix.Rss || {};

Smartix.Rss.linkRssWithGroups = function (namespace, name, url, selectedNewsgroups, currentUser) {
    
    check(url, String);
    check(selectedNewsgroups, [String]);
    
    // TODO - Checks permissions
    
    // If feed does not exist already
    // Create the feed
    
    if(Smartix.Rss.Feeds.find({
        _id: url
    }).count() < 1) {
        let feed = {
            _id: url,
            category: url,
            link: url,
            refresh_interval: Meteor.settings.RSS_FETCH_INTERVAL
        };
        Feed.createAtomFeed(feed);
        Feed.read();
    }
    
    // Create a link between the feed and the newsgroup
    
    Smartix.Rss.FeedGroupLinks.upsert({
        url: url,
        namespace: namespace
    }, {
        $set: {
            name: name,
            newsgroups: selectedNewsgroups
        }
    });
}

Smartix.Rss.removeLink = function (namespace, url) {
    
    // TODO - check permissions
    
    Smartix.Rss.FeedGroupLinks.remove({
        namespace: namespace,
        url: url
    });
}

Smartix.Rss.getNewsgroupsOfFeed = function (feedId) {
    let feedObj = Smartix.Rss.FeedGroupLinks.findOne({
        _id: feedId
    });
    
    return feedObj.newsgroups;
}

Smartix.Rss.getFeedsForNewsgroup = function (newsgroupId) {
    return Smartix.Rss.Feeds.find({
        newsgroups: newsgroupId
    }).fetch();
}