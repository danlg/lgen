Smartix = Smartix || {};
Smartix.Rss = Smartix.Rss || {};

Smartix.Rss.linkRssWithGroups = function (namespace, name, url, selectedNewsgroups, currentUser) {
    
    check(url, String);
    check(selectedNewsgroups, [String]);
    
    // Checks that at least one newsgroup in the array exists
    // This is to prevent an RSS feed with no linked groups
    let atLeastOneNewsgroupExists = Smartix.Groups.Collection.findOne({
        type: 'newsgroup',
		_id: {
            $in: selectedNewsgroups
        }
	});
    
    if(!atLeastOneNewsgroupExists) {
        throw new Meteor.Error('non-existent-newsgroup', 'Newsgroups specified not found. Please provide at least one valid newsgroup.');
    }
    
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
};

Smartix.Rss.removeLink = function (namespace, url) {
    // TODO - check permissions
    log.info("Removing RSS", namespace, url);
    Smartix.Rss.FeedGroupLinks.remove({
        namespace: namespace,
        url: url
    });
    //TODO BETTER clean up RSS are still processed even after removed!
    //we do not want to remove RSS in feeds in case the RSS is mapped to multiple newsgroup though
    // Smartix.Rss.Feeds.remove({
    //     _id: url
    // });
};

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