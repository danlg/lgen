Template.AdminRss.onCreated(function () {
    
    if(Router
    && Router.current()
    && Router.current().params.school) {
        var schoolNamespace = Smartix.Accounts.School.getNamespaceFromSchoolName(Router.current().params.school);
        this.subscribe('feedsForNamespace', schoolNamespace);
        this.subscribe('feedLinksForNamespace', schoolNamespace);
        this.subscribe('smartix:newsgroups/allNewsgroupsFromSchoolName', Router.current().params.school)
    }
});

Template.AdminRss.helpers({
    RSSFeed: function () {
        if(Template.instance().subscriptionsReady()) {
            
            var feedsForNamespace = Smartix.Rss.FeedGroupLinks.find({
                namespace: Smartix.Accounts.School.getNamespaceFromSchoolName(Router.current().params.school)
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
        Meteor.call('smartix:rss/removeFeedByUrl'
        , Smartix.Accounts.School.getNamespaceFromSchoolName(Router.current().params.school)
        , event.currentTarget.dataset.url);
    }
})