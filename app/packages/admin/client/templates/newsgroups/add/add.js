Template.AdminNewsgroupsAdd.events({
    'click #addNewsgroup-submit': function (event, template) {
        event.preventDefault();
        
        var newNewsgroup = {};
        newNewsgroup.users = [];
        newNewsgroup.type = 'newsgroup';
        newNewsgroup.className = template.$('#addNewsgroup-name').eq(0).val();
        newNewsgroup.url = template.$('#addNewsgroup-code').eq(0).val();

        newNewsgroup.mandatory = template.$('#newsgroupMandatory').is(":checked");
        log.info("newNewsgroup.mandatory", newNewsgroup.mandatory);


        // If the checkbox is selected,
        // Make newsgroupMandatory `true`, otherwise `false`

        
        log.info('newNewsgroupObj',newNewsgroup);
        
        Meteor.call('smartix:newsgroups/createNewsgroup', Router.current().params.school, newNewsgroup,function(err,result){
            
            if(err){
                log.info(err);
                toastr.info(err.reason);
            }else{
                toastr.info('Newsgroup is created. Default to all school users');
            }
        });
    }
});