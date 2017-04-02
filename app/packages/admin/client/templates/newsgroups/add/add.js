Template.AdminNewsgroupsAdd.events({
    'click #addNewsgroup-submit': function (event, template) {
        event.preventDefault();
        var newNewsgroup = {};
        newNewsgroup.users = [];
        newNewsgroup.type = 'newsgroup';
        newNewsgroup.className = template.$('#addNewsgroup-name').eq(0).val();
        //newNewsgroup.url generated server side
        //newNewsgroup.url = template.$('#addNewsgroup-code').eq(0).val();
        newNewsgroup.mandatory = template.$('#newsgroupMandatory').is(":checked");
        //log.info("newNewsgroup.mandatory", newNewsgroup.mandatory);
        // If the checkbox is selected,
        // Make newsgroupMandatory `true`, otherwise `false`
        var selectedDistributionLists = [];    
        $("#distribution-list :selected").each(function(){
            selectedDistributionLists.push($(this).val()); 
        });
        //log.info('selectedDistributionLists',selectedDistributionLists);
        //log.info('newNewsgroupObj',newNewsgroup);
        Meteor.call('smartix:newsgroups/createNewsgroup',
            UI._globalHelpers['getCurrentSchoolName'](),
            newNewsgroup, selectedDistributionLists,
            function(err,result){
                if(err){
                    log.info("smartix:newsgroups/createNewsgroup", err);
                    toastr.error("smartix:newsgroups/createNewsgroup", err.reason);
                }else{
                    toastr.info(TAPi18n.__("Admin.NewsgroupCreated"));
                }
        });
    }
});

Template.AdminNewsgroupsAdd.helpers({
    'distributionListItems': function () {
        return Smartix.Groups.Collection.find({
            type: "distributionList"
        });
    }
});

Template.AdminNewsgroupsAdd.onCreated(function () {
    this.subscribe('smartix:distribution-lists/listsBySchoolId',  UI._globalHelpers['getCurrentSchoolId']());
});