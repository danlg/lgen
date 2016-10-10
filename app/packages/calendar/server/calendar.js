Smartix = Smartix || {};
Smartix.Calendar = Smartix.Calendar || {};

Smartix.Calendar.Collection.calendarSchema = new SimpleSchema({
    schoolId: {
        type: String,
    },
    eventName: {
        type: String
    },
    location: {
        type: String,
        optional: true
    },
    startDate:{
        type: String
    },
    endDate:{
        type: String
    },
    description: {
        type: String,
        optional: true
    },
    calendarName: {
        type: String,
        optional: true
    }
});

Smartix.Calendar.Collection.attachSchema(Smartix.Calendar.Collection.calendarSchema);


Smartix.Calendar.addCalendarEvent = function(calendarObj){
    check(calendarObj, Smartix.Calendar.Collection.calendarSchema);
    let startTest = moment(calendarObj.startDate).isValid();
    let endTest = moment(calendarObj.endTest).isValid();
    let isAdmin = Smartix.Accounts.School.isAdmin(calendarObj.schoolId, Meteor.userId());
    if(isAdmin && startTest && endTest){
        Smartix.Calendar.Collection.insert(calendarObj);
    }
}
