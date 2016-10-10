Smartix = Smartix || {};

Smartix.Calendar = Smartix.Calendar || {};


Meteor.publish('smartix:calendar/eventsBySchool', function (schoolId) {
  return Smartix.Calendar.Collection.find({
    schoolId: schoolId
  });
});

Meteor.methods({
    'smartix:calendar/addNewCalendarEvent': function(calendarObj){
        return Smartix.Calendar.addCalendarEvent(calendarObj);
    }
})