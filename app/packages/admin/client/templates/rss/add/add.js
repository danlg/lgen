Template.AdminRssAdd.onCreated(function () {
    this.subscribe('smartix:newsgroups/allNewsgroupsFromSchoolName',  UI._globalHelpers['getCurrentSchoolName']());
});

Template.AdminRssAdd.helpers({
    'newsgroups':  () => {
        return Smartix.Groups.Collection.find({
            type: 'newsgroup'
        })
    }
});

Template.AdminRssAdd.events({
    'click #addRss-submit': function (event, template) {
        event.preventDefault();
        var name = template.$('#addRss-name').eq(0).val();
        var url = template.$('#addRss-url').eq(0).val();
        var selectedNewsgroups = [];    
        $("#newsgroups :selected").each(function(){
            selectedNewsgroups.push($(this).val()); 
        });
        
        Meteor.call('smartix:rss/linkRssWithGroups'
            , UI._globalHelpers['getCurrentSchoolId']()
            , name
            , url
            , selectedNewsgroups
            , function (err, res) {
            if(err) {
                log.error("smartix:rss/linkRssWithGroups", err);
                toastr.error("smartix:rss/linkRssWithGroups",err.reason);
            } else {
                toastr.info('RSS is linked.');
            }
        })
    }
});