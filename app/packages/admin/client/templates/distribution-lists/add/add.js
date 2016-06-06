Template.AdminDistributionListsAdd.onCreated(function(){
 
    if (Router
    && Router.current()
    && Router.current().params
    && Router.current().params.school
    ) {
        this.subscribe('smartix:distribution-lists/listsBySchoolName', Router.current().params.school);
    
        var schoolNamespace = Smartix.Accounts.School.getNamespaceFromSchoolName(Router.current().params.school);
        this.subscribe('smartix:accounts/allUsersInNamespace', schoolNamespace);

    } else {
        log.info("Please specify a school to list the classes for");
    }   
    
});


Template.AdminDistributionListsAdd.events({
    'click #addDistributionList-submit': function (event, template) {
        event.preventDefault();
        
        var namespace = Router.current().params.school;
        
        var name = template.$('#addDistributionList-name').eq(0).val();
        var code = "";
        
        // Checks that the values are not empty
        if(!namespace) {
            toastr.error("Application error. Please refresh the page and try again.");
        }
        if(!name) {
            toastr.error("Please ensure the list name is filled in");
        }
        // Allow cases where code is not provided
        // if(!code) {
        //     toastr.error("Please ensure the list code is filled in");
        // }
        
        if(namespace && name) {
            Meteor.call('smartix:distribution-lists/create', [], namespace, name, code,function(err,result){
                
                //result is the new distribution list entry's id
                if (result) {
                    //log.info('distributionId', result);
                    var newDistributionList = Smartix.Groups.Collection.findOne(result);
                    //log.info(newDistributionList);
                    toastr.info('Distribution List '+ newDistributionList.name +' has been created.');
                    
                    Router.go('admin.lists.view', { school: namespace, code: newDistributionList.url });
                } else {
                    var existingDistributionList = Smartix.Groups.Collection.findOne({name: name});
                    if(existingDistributionList){
                        toastr.info('Distribution List already exist. Redirect you to view it.');
                        Router.go('admin.lists.view', { school: namespace, code: existingDistributionList.url });
                    }else{
                        toastr.error('Fail to create distribution list');
                    }

                }
               
            });
        }
    }
});