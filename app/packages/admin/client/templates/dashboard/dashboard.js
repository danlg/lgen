Template.AdminDashboard.onCreated(function () {
    var schoolName = UI._globalHelpers['getCurrentSchoolName']();
    this.subscribe('schoolInfo', schoolName, function(err, result)
    {
        if(!err)
        {
            startCountDown();
        }
    });
});

Template.AdminDashboard.helpers({
    routeData: function () {
       return {
           school:  UI._globalHelpers['getCurrentSchoolName']()
       }
    }
});

var startCountDown = function()
{
        var schoolObj = SmartixSchoolsCol.findOne(UI._globalHelpers['getCurrentSchoolId']());
        var timeToExpiry = schoolObj.planTrialExpiryDate;
        // log.info(timeToExpiry);
        $('#clock').countdown(timeToExpiry, function(event) {
           $(this).html(event.strftime('%D ' + TAPi18n.__("Days") + ' %H:%M:%S'+ ' left to upgrade your school! '));
        });
}