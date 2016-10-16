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
    let endTest = moment(calendarObj.endDate).isValid();
    let isAdmin = Smartix.Accounts.School.isAdmin(calendarObj.schoolId, Meteor.userId());
    if(isAdmin && startTest && endTest){
        Smartix.Calendar.Collection.insert(calendarObj);
    }
};

Smartix.Calendar.deleteCalendarEvent = function(id){
    let calendarObj = Smartix.Calendar.Collection.findOne(id);
    let isAdmin = Smartix.Accounts.School.isAdmin(calendarObj.schoolId, Meteor.userId());
    if(isAdmin){
       return Smartix.Calendar.Collection.remove(id);
    }
};


Smartix.Calendar.editCalendarEvent = function(calendarObj, eventId){
    let originalCalendarObj = Smartix.Calendar.Collection.findOne(eventId);
    calendarObj.schoolId = originalCalendarObj.schoolId;
    Smartix.Calendar.Collection.calendarSchema.clean(calendarObj);
    check(calendarObj, Smartix.Calendar.Collection.calendarSchema);
    let startTest = moment(calendarObj.startDate).isValid();
    let endTest = moment(calendarObj.endDate).isValid();    
    let isAdmin = Smartix.Accounts.School.isAdmin(originalCalendarObj.schoolId, Meteor.userId());
    if(isAdmin && startTest && endTest){
       return Smartix.Calendar.Collection.update(eventId, calendarObj,  {validate: false});
    }
};