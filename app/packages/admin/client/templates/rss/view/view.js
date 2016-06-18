Template.AdminRss.onCreated(function () {
    var schoolNamespace = UI._globalHelpers['getCurrentSchoolId']();
    this.subscribe('feedsForNamespace', schoolNamespace);
    this.subscribe('feedLinksForNamespace', schoolNamespace);
    this.subscribe('smartix:newsgroups/allNewsgroupsFromSchoolName',  UI._globalHelpers['getCurrentSchoolName']())
});

Template.AdminRss.helpers({
    RSSFeed: function () {
        if(Template.instance().subscriptionsReady()) {
            var feedsForNamespace = Smartix.Rss.FeedGroupLinks.find({
                namespace: UI._globalHelpers['getCurrentSchoolId']()
            }).fetch();
            return feedsForNamespace.map(function(feed) {
                feed.newsgroups = feed.newsgroups.map(function(newsgroup) {
                    var newgroupObj = Smartix.Groups.Collection.findOne({
                        _id: newsgroup,
                        type: 'newsgroup'
                    });
                    return newgroupObj ? newgroupObj.name : null;
                }).join(", ");
                return feed;
            });
        }
    }
});

Template.AdminRss.events({
    'click .AdminRss-remove': function (event, template) {
        //log.info("remove",
        //    Smartix.Accounts.School.getNamespaceFromSchoolName(Router.current().params.school),
        //    event.currentTarget.dataset.url);
        Meteor.call('smartix:rss/removeFeedByUrl'
        , UI._globalHelpers['getCurrentSchoolId']()
        , event.currentTarget.dataset.url);
    }
});