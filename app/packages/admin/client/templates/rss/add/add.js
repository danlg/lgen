Template.AdminRssAdd.onCreated(function () {
    if (Router
    && Router.current()
    && Router.current().params
    && Router.current().params.school
    ) {
        this.subscribe('smartix:newsgroups/allNewsgroupsFromSchoolName', Router.current().params.school);
    } else {
        log.info("Please specify a school to list the classes for");
    }
});

Template.AdminRssAdd.helpers({
    'newsgroups': function () {
        return Smartix.Groups.Collection.find({
            type: 'newsgroup'
        })
    }
})

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
            , Smartix.Accounts.School.getNamespaceFromSchoolName(Router.current().params.school)
            , name
            , url
            , selectedNewsgroups
            , function (err, res) {
            if(err) {
                log.info(err);
                toastr.info(err.reason);
            } else {
                toastr.info('RSS is linked.');
            }
        })
    }
})