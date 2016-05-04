Template.AdminDistributionListsAdd.events({
    'click #addDistributionList-submit': function (event, template) {
        event.preventDefault();
        
        var namespace = Router.current().params.school;
        
        var name = template.$('#addDistributionList-name').eq(0).val();
        var code = template.$('#addDistributionList-code').eq(0).val();
        
        // Checks that the values are not empty
        if(!namespace) {
            toastr.error("Application error. Please refresh the page and try again.");
        }
        if(!name) {
            toastr.error("Please ensure the list name is filled in");
        }
        if(!code) {
            toastr.error("Please ensure the list code is filled in");
        }
        
        if(namespace && name && code) {
            Meteor.call('smartix:distribution-lists/create', [], namespace, name, code);
        }
    }
});