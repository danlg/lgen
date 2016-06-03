Meteor.methods({
    'smartix:rss/linkRssWithGroups': function (namespace, name, url, selectedNewsgroups) {
        return Smartix.Rss.linkRssWithGroups(namespace, name, url, selectedNewsgroups, this.userId);
    },
    'smartix:rss/removeFeedByUrl': function (namespace, url) {
        return Smartix.Rss.removeLink(namespace, url);
    }
});