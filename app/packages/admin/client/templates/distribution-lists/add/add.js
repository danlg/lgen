Template.AdminDistributionListsAdd.onCreated(function(){
    var schoolName = UI._globalHelpers['getCurrentSchoolName']();
    this.subscribe('smartix:distribution-lists/listsBySchoolName', schoolName);

    var schoolId = UI._globalHelpers['getCurrentSchoolId']();
    this.subscribe('smartix:accounts/allUsersInNamespace', schoolId);
});

Template.AdminDistributionListsAdd.events({
    'click #addDistributionList-submit': function (event, template) {
        event.preventDefault();
        var schoolName =  UI._globalHelpers['getCurrentSchoolName']();
        //var schoolId   =  UI._globalHelpers['getCurrentSchoolId']();
        var distlistName = template.$('#addDistributionList-name').eq(0).val();
        var code = "";
        // Checks that the values are not empty
        if(!schoolName) {
            toastr.error("Application error. Please refresh the page and try again.");
        }
        if(!distlistName) {
            toastr.error("Please ensure the list name is filled in");
        }
        if(schoolName && distlistName) {
            Meteor.call('smartix:distribution-lists/create', [], schoolName, distlistName, code,function(err,result){
                //result is the new distribution list entry's id
                if (result) {
                    //log.info('distributionId', result);
                    var newDistributionList = Smartix.Groups.Collection.findOne(result);
                    //log.info(newDistributionList);
                    toastr.info('Distribution List '+ newDistributionList.name +' has been created.');
                    Router.go('admin.lists.view', { school: schoolName, code: newDistributionList.url });
                } else {
                    var existingDistributionList = Smartix.Groups.Collection.findOne({name: name});
                    if(existingDistributionList){
                        toastr.info('Distribution List already exist. Redirect you to view it.');
                        Router.go('admin.lists.view', { school: schoolName, code: existingDistributionList.url });
                    }else{
                        toastr.error('Fail to create distribution list');
                    }
                }
            });
        }
    }
});