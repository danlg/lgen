import chargebee from 'chargebee';

Meteor.startup(function(){
    chargebee.configure({site : Meteor.settings.chargebee.site, 
  api_key : Meteor.settings.chargebee.api_key});
})

Meteor.methods({
    /**subscriptionInfo {
     *   userId: Used to retrieve firstName, lastName and email
     *   schoolId: Used to retrieve fullname (stored as company in ChargeBee) 
     *   schoolId: Stored as customer in Chargebee
     *   planid: Used to checkout_new plan_id
     *   numberOfStudents: plan_quantity
     * }
     * 
     * @return object of hosted_page which is used to create the iFrame
     * onError: Meteor.Error() 
     */
    createNewSubscription: function(subscriptionInfo){

        let customerInfo = Meteor.users.findOne(subscriptionInfo.userId);
        let schoolInfo = SmartixSchoolsCol.findOne(subscriptionInfo.schoolId);
        let planType = subscriptionInfo.planOptions;
        let schoolName = schoolInfo.fullname;
        let studentQuantity = subscriptionInfo.numberOfStudents;
        log.info("Starting payment process for school", schoolName);
        return chargebee.hosted_page.checkout_new({
            subscription: { 
                plan_id: planType,
                plan_quantity: studentQuantity 
            },
            customer: {
                //Customer should be the school not the admin of the school so customerID is schoolID
                id: schoolInfo._id, 
                email: customerInfo.emails[0].address,
                first_name: customerInfo.profile.firstName,
                last_name: customerInfo.profile.lastName, 
                company: schoolName,
            },
            embed: true,
            iframe_messaging: true
        }).request(function(error, result)
        {
            if(error){
                log.error(subscriptionInfo.userId, error);
            }
            else{
                return result;
            }
        })
    },

    /**
     * This method is used to edit exisiting subscriptions if the school wants to upgrade/downgrade plan 
     * Can also be used to add more students to the subscription
     * subscriptionInfo {
     *   schoolId: Used to retrieve planSubscriptionId (to update Chargebee subscription) 
     *   planid: Used to checkout_existing plan_id
     *   numberOfStudents: plan_quantity
     * }
     * 
     * @return object of hosted_page which is used to create the iFrame
     * onError: Meteor.Error() 
     */
    editExistingSubscription: function(subscriptionInfo){
        let schoolInfo = SmartixSchoolsCol.findOne(subscriptionInfo.schoolId);
        let planType = subscriptionInfo.planOptions;
        let studentQuantity = subscriptionInfo.numberOfStudents;
        let schoolSubscriptionId = schoolInfo.planSubscriptionId;
        log.info("Updating subscription plan for ", schoolName);
        return chargebee.hosted_page.({
            subscription: { 
                id: schoolSubscriptionId,
                plan_id: planType,
                plan_quantity: studentQuantity 
            },
            embed: true,
            iframe_messaging: true
        }).request(function(error, result)
        {
            if(error){
                log.error(subscriptionInfo.userId, error);
            }
            else{
                return result;
            }
        })
    },

    /**
     * Method called to update SmartixSchoolsCol database onSuccess
     * @params: responseId: the hosted_page_id which is used to retrieve the transaction details 
     * First get the hosted_page details, use the subscriptionId retrieved to find the chargebee.subscription
     * Chargebee.subscription is used to find granual details like plan_quantity purchased
     * All the new details are saved in SmartixSchoolsCol db
     * schoolObj.planExpiryDate = newExpiryDate;
     * schoolObj.planChosen = planId;
     * schoolObj.planUnitsBought = planUnits;
     */
    updateSubscriptionRecords: function (responseId) {
        return chargebee.hosted_page.retrieve(responseId).request(
            Meteor.bindEnvironment(function (error, hostedPageResult) {
                if (error) {
                    //handle error
                    console.log(error);
                } else {
                    let hosted_page = hostedPageResult.hosted_page;
                    let schoolId = hosted_page.content.customer.id;
                    let planId = hosted_page.content.subscription.plan_id;
                    let subscriptionId = hosted_page.content.subscription.id;
                    return chargebee.subscription.retrieve(subscriptionId).request(
                        Meteor.bindEnvironment(function (error, subscriptionResult) {
                            if (error) {
                                //handle error
                                console.log(error);
                            } else {
                                let newExpiryDate = subscriptionResult.subscription.current_term_end;
                                let totalDues = subscriptionResult.subscription.total_dues;
                                let planUnits = subscriptionResult.subscription.plan_quantity;
                                //Convert from UNIX to YYMMDD
                                newExpiryDate = moment.unix(newExpiryDate).format();
                                //Update school plan and expiry date
                                let schoolObj = {};
                                schoolObj.planExpiryDate = newExpiryDate;
                                schoolObj.planChosen = planId;
                                schoolObj.planUnitsBought = planUnits;
                                schoolObj.planSubscriptionId = subscriptionId;
                                var targetSchool = SmartixSchoolsCol.findOne(schoolId);
                                //Add revenue to date to total dues
                                // schoolObj.revenueToDate = targetSchool.revenueToDate + totalDues;
                                delete targetSchool._id;
                                lodash.merge(targetSchool, schoolObj);
                                return SmartixSchoolsCol.update(schoolId, { $set: targetSchool });
                            }
                        })
                    );
                }
            })
        );
    }

});