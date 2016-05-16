Smartix = Smartix || {};
Smartix.Rss = Smartix.Rss || {};

Smartix.Rss.linkRssWithGroups = function (namespace, name, url, selectedNewgroups, currentUser) {
    
    check(url, String);
    check(selectedNewgroups, [String]);
    
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
            refresh_interval: 6000
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
            newsgroups: selectedNewgroups
        }
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