Meteor.methods({
    'smartix:rss/linkRssWithGroups': function (namespace, name, url, selectedNewgroups) {
        return Smartix.Rss.linkRssWithGroups(namespace, name, url, selectedNewgroups, this.userId);
    }
});