Smartix = Smartix || {};
Smartix.Rss = Smartix.Rss || {};

Smartix.Rss.Feeds = new Meteor.Collection("feeds");
Smartix.Rss.FeedEntries = new Meteor.Collection("feed_entries");

Smartix.Rss.FeedGroupLinks = new Meteor.Collection('smartix:rss/feed-group-links');

Smartix.Rss.FeedGroupLinksSchema = new SimpleSchema({
    'name': {
        type: String
    },
    'url': {
        type: String
    },
    'newsgroups': {
        type: [String]
    },
    'namespace': {
        type: String
    }
});