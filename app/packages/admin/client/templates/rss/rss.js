Template.AdminRss.onCreated(function () {
    this.subscribe('newsgroups', ['4zBTyzqPGhXz5ygLm', 'RWKuGahBZBxLajx73', '27E7zacmAoXjCP4Wp']);
});

Template.AdminRss.helpers({
    RSSFeed: function () {
        if(Template.instance().subscriptionsReady()) {
            // Dummy Data
            var rssFeeds = [{
                feedName: "Latest news from Education Bureau",
                url: "http://www.edb.gov.hk/en/whats_new_rss.xml",
                newsgroups: ['4zBTyzqPGhXz5ygLm', '27E7zacmAoXjCP4Wp']
            }, {
                feedName: "Weather Warning Summary",
                url: "http://rss.weather.gov.hk/rss/WeatherWarningSummary.xml",
                newsgroups: ['RWKuGahBZBxLajx73', '27E7zacmAoXjCP4Wp']
            }, {
                feedName: "Current Weather Report",
                url: "http://rss.weather.gov.hk/rss/CurrentWeather.xml",
                newsgroups: ['4zBTyzqPGhXz5ygLm', 'RWKuGahBZBxLajx73', '27E7zacmAoXjCP4Wp']
            }];
            
            return rssFeeds.map(function(feed) {
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