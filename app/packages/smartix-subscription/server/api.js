import chargebee from 'chargebee';

Meteor.startup(function(){
    chargebee.configure({site : Meteor.settings.chargebee.site, 
  api_key : Meteor.settings.chargebee.api_key});
})

Meteor.methods({
    /**subscriptionInfo {
     *   nbstudents
     *   planid
     * }
     * schoolId: the id (not the short name) 
     */
    createNewSubscription: function(subscriptionInfo){

        let customerInfo = Meteor.users.findOne(subscriptionInfo.userId);
        let schoolInfo = SmartixSchoolsCol.findOne(subscriptionInfo.schoolId);
        let planType = subscriptionInfo.planOptions;
        let studentQuantity = subscriptionInfo.numberOfStudents;
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
                company: schoolInfo.fullname
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
                                //Convert from UNIX to YYMMDD
                                newExpiryDate = moment.unix(newExpiryDate).format();
                                //Update school plan and expiry date
                                let schoolObj = {};
                                schoolObj.planExpiryDate = newExpiryDate;
                                schoolObj.planChosen = planId;
                                var targetSchool = SmartixSchoolsCol.findOne(schoolId);
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