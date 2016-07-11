import chargebee from 'chargebee';

Template.AdminPayment.onCreated(function()
{
    this.subscribe('smartix:accounts/basicInfoOfAllUsersInNamespace', UI._globalHelpers['getCurrentSchoolId']());
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
        Meteor.call('createNewSubscription', subscriptionOptions, function(error, result)
        {
            if(error)
            {
                toastr.error("Sorry there was a problem handling your request at this time.");
                log.error(error);
            }
            else{
                // log.info(result.hosted_page);
                var hostedPage = result.hosted_page;
                hostedPage.site_name = 'smartix-test';
                // launchIframe(hostedPage);
                subscribeHandler(hostedPage);
            }
        });

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

    currentPlan: function()
    {
        let school = schoolObj();
        return school.planChosen ? school.planChosen : 'basic';
    }
})


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

var successRedirectCall = function (responseId){
    showProcessing();
    Meteor.call('updateSubscriptionRecords', responseId, function(error, result)
    {
        if(error)
        {
            toastr.error("Sorry there was a problem handling your request at this time.");
            log.error(error);
        }
        else{
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
            var style = 'border:none;overflow:hidden;width:100%;';
            style = style + 'height:' + height + 'px;';
            style = style + 'display:none;';//This is for slide down effect
            iframe.setAttribute('style', style);
            $(iframe).slideDown(1000);
        },

        /*
         * This will be triggered when any content of iframe is resized.
         */
        onResize: function (iframe, width, height) {
            var style = 'border:none;overflow:hidden;width:100%;';
            style = style + 'height:' + height + 'px;';
            iframe.setAttribute('style', style);
        },

        /*
         * This will be triggered when checkout is complete.
         */
        onSuccess: function (iframe) {
            // log.info("hostedPageId", hostedPageId);
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

