Meteor.startup(function() {

    feedReader();

});

function feedReader() {

    var collections = {
        feeds: Smartix.Rss.Feeds,
        feed_entries: Smartix.Rss.FeedEntries
    }

    Feed.collections(collections);

    // invoke feedReader to get real-time reactive social stream
    Feed.read();
}