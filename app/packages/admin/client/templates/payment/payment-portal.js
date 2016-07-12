import chargebee from 'chargebee';

Template.AdminPayment.onCreated(function()
{
    var self = this;
    self.planNumberOfStudents = new ReactiveVar('');
    self.subscribe('smartix:accounts/basicInfoOfAllUsersInNamespace', UI._globalHelpers['getCurrentSchoolId'](), function()
    {
        self.planNumberOfStudents.set(numberOfStudents());
    });
    self.selectedPlan = new ReactiveVar(premiumPlanDetails);
    self.planUnitPrice = new ReactiveVar(3);

});

Template.AdminPayment.onRendered(function()
{

});

Template.AdminPayment.events({
    'click #upgrade': function(events, template)
    {
        events.preventDefault();
        let subscriptionOptions = {};
        let schoolId = UI._globalHelpers['getCurrentSchoolId']();
        let e = document.getElementById('plan-options');
        subscriptionOptions.planOptions = e.options[e.selectedIndex].value;
        subscriptionOptions.numberOfStudents = template.$('#numberOfStudents').eq(0).val();
        subscriptionOptions.schoolId = schoolId;
        subscriptionOptions.userId = Meteor.userId();
        // log.info("Selected Options", subscriptionOptions);
        
        /**need to ensure no iFrame is already loaded*/
        var iframeContainer = document.getElementById('checkout-info');
        while (iframeContainer.firstChild) {
            iframeContainer.removeChild(iframeContainer.firstChild);
        }
        // successRedirectCall('m5xwgUdstmyaWkFLE8ow8sClJ7fozfmB');

        Meteor.call('createNewSubscription', subscriptionOptions, function(error, result)
        {
            if(error)
            {
                toastr.error("Sorry there was a problem handling your request at this time.");
                log.error(error);
            }
            else{
                var hostedPage = result.hosted_page;
                hostedPage.site_name = 'smartix-test';
                subscribeHandler(hostedPage);
            }
        });

    },

    'keyup #numberOfStudents': function(event, template)
    {
        let students= template.$('#numberOfStudents').eq(0).val();
        template.planNumberOfStudents.set(students);
    }, 

    'change #plan-options': function(event, template)
    {
        event.preventDefault();
        let select = document.getElementById('plan-options');
        let selectedPlanOption = select.options[select.selectedIndex].value;
        switch (selectedPlanOption)
        {
            case 'premium':
            {
                log.info("Premium Selected");
                template.selectedPlan.set(premiumPlanDetails);
                template.planUnitPrice.set(3);
                break;
            }
            case 'vip':
            {
                log.info("VIP Selected");
                template.selectedPlan.set(vipPlanDetails);
                template.planUnitPrice.set(6);
                break;
            }
        }
    }
})

Template.AdminPayment.helpers({
    numberOfStudents: function()
    {
        return numberOfStudents();
    },

    planExpiry: function()
    {
        let school = schoolObj();
        return school.planExpiryDate ? school.planExpiryDate : school.planTrialExpiryDate;
    },

    /**
     * This helper returns the units bought by school
     * If school has not bought any units returns 0
     */
    unitsBought: function()
    {
        let school = schoolObj();
        return school.planUnitsBought ? school.planUnitsBought : 0;
    },

    isBasicPlan: function()
    {
       return (currentSchoolPlan() === 'basic') ? true : false;
    },

    currentPlan: function()
    {
        return currentSchoolPlan();
    },

    selectedPlan: function()
    {
        return Template.instance().selectedPlan.get();
    },

    //Multiplies and returns the plan selected with the number of students in input box
    estimateCost: function()
    {
        if(Template.instance().planNumberOfStudents.get() > 0)
            return Template.instance().planNumberOfStudents.get()*Template.instance().planUnitPrice.get();
        else
            return Template.instance().planUnitPrice.get();
    }
})

/**
 * Number of Active students in school. 
 * Requires the smartix:accounts/basicInfoOfAllUsersInNamespace subscription
 */
var numberOfStudents = function()
{
    return Roles.getUsersInRole(
            Smartix.Accounts.School.STUDENT,
            UI._globalHelpers['getCurrentSchoolId']()
        ).count();
}

var schoolObj = function()
{
    return SmartixSchoolsCol.findOne( UI._globalHelpers['getCurrentSchoolId']());
}

var currentSchoolPlan = function()
{
    let school = schoolObj();
    return school.planChosen ? school.planChosen : 'basic';
}


/**
 * @param: responseId this is the hosted_page_id from chargebee 
 * Method called when payment successfully is transferred
 * Method calls updateSubscriptionRecords which updates the SmartixSchoolsCol database with new details about the plan 
 */
var successRedirectCall = function (responseId){
    Meteor.call('updateSubscriptionRecords', responseId, function(error, result)
    {
        if(error)
        {
            toastr.error("Sorry there was a problem handling your request at this time.");
            log.error(error);
        }
        else{
            hideProcessing();
            toastr.info("Thank You for upgrading! We have sent an inovice to your registered email account");
        }
    });     
}

var hideProcessing = function()
{
    var loadingContainer = $('#loading-div');
    loadingContainer.hide();
}


var showProcessing = function()
{
    var loadingContainer = $('#loading-div');
    loadingContainer.show();
}

var subscribeHandler = function (response) {
    var hostedPageId = response.id;
    var customerContainer = $('#customer-info');
    var iframeContainer = $('#checkout-info');
    showProcessing();
    ChargeBee.embed(response.url, response.site_name).load({
        /*
         * This function will be called when iframe is created.
         * addIframe callback will recieve iframe as parameter.
         * you can use this iframe to add iframe to your page.
         * Loading image in container can also be showed in this callback.
         * Note: visiblity will be none for the iframe at this moment
         */
        addIframe: function (iframe) {
            iframeContainer.append(iframe);
        },

        /*
        * This function will be called once when iframe is loaded.
        * Since checkout pages are responsive you need to handle only height.
        */
        onLoad: function (iframe, width, height) {
            hideProcessing();
            $(customerContainer).slideUp(1000);
            var style = 'border:none; overflow:hidden; width:100%; max-width:500px;';
            style = style + 'height:' + height + 'px;';
            style = style + 'display:none;';//This is for slide down effect
            iframe.setAttribute('style', style);
            $(iframe).slideDown(1000);
        },

        /*
         * This will be triggered when any content of iframe is resized.
         */
        onResize: function (iframe, width, height) {
            var style = 'border:none;overflow:hidden;width:100%; max-width:500px;';
            style = style + 'height:' + height + 'px;';
            iframe.setAttribute('style', style);
        },

        /*
         * This will be triggered when checkout is complete.
         */
        onSuccess: function (iframe) {
            showProcessing();
            $(iframe).slideDown(100, function () {
                $(iframeContainer).empty();
                $(customerContainer).slideDown(200);
            });
            successRedirectCall(hostedPageId);
        },

        /*
         * This will be triggered when user clicks on cancel button. 
         */
        onCancel: function (iframe) {
            $(iframe).slideDown(100, function () {
                $(iframeContainer).empty();
                $(customerContainer).slideDown(200);
            });
            toastr.error("Payment Aborted!");
        }
    });
}


//JSON Objects with plan details.
var premiumPlanDetails = {};
premiumPlanDetails.title = 'Premium';
premiumPlanDetails.description = 'For Starting School with Limited Budget';
premiumPlanDetails.features = ['Personalised App', 'Admin Dashboard', 'In School Tutorial', 'Email Support'];
premiumPlanDetails.price = '$3';

var vipPlanDetails = {};
vipPlanDetails.title = 'VIP';
vipPlanDetails.description = 'For School with Strong Branding';
vipPlanDetails.features = ['Branded App on Apple App Store and Google Play Store', 
                            'Admin Dashboard', 'In School Tutorial', 'Email Support', 'Telephone Support'];
vipPlanDetails.price = '$6';