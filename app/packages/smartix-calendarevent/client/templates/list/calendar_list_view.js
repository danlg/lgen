// BEGINNING OF FULL CALENDAR INTEGRATION - This works just remove comment to make calendar appear

import jQuery from 'jquery'
import fullCalendar from 'fullcalendar';

//var mycalendar;

Template.CalendarListView.onCreated(function(){
    var self = this;
    var schoolId =  UI._globalHelpers['getCurrentSchoolId']();
    self.subscribe('newsgroupsForUser',null,null,Session.get('pickedSchoolId'),function(){
        //self.subscribe('newsForUser',null,null,Session.get('pickedSchoolId'));
        self.subscribe('calendarEntriesForUser',null,null,Session.get('pickedSchoolId'), function(){
            self.subscribe('smartix:calendar/eventsBySchool', schoolId, function(){
                // log.info(Smartix.Calendar.Collection.find().fetch());
                loadCalendar();
            }); 
        });
        self.subscribe('smartix:distribution-lists/listsInNamespace',Session.get('pickedSchoolId'));
    });
});
//1. get all messages that have calendar addons that user is in the group
//db.getCollection('smartix:messages').find({'addons.type':'calendar',group:{ $in: usergroups}})
//2. display them like the list view shown in github

Template.CalendarListView.onRendered( () => {
    
});
//END  OF FULL CALENDAR INTEGRATION

Template.CalendarListView.helpers({
    getEvents:function(){
        //TODO : DONE filter done server side
        return Smartix.Messages.Collection.find(
            {},
            { sort: { 'addons.startDate': 1 } }// sort doesn't work on server side, for calendar event, by chronological order
        );
    },

    getGroupName:function(groupId){
        //log.info('getGroupName',groupId);
       return Smartix.Groups.Collection.findOne(groupId).name;
    },
    
    getCalendar:function(){
        var calendarObjs =lodash.filter(this.addons, function(addon) { return addon.type ==='calendar'; });
        return calendarObjs[0];       
    },
    
    calendarTime:function(date){   
        return moment(date).calendar();
    },
    
    isAllDayEvent: function(){
        //log.info('isAllDayEvent', 'startDate:',this.startDate,'endDate:', this.endDate);
        return (this.startDate.getTime() === this.endDate.getTime())
    }
    
});

let fetchSchoolCalendarEvents = () =>{
    let calendarEvents = Smartix.Calendar.Collection.find().fetch();
    let calendarEventsArray = [];
    lodash.forEach(calendarEvents, function(calendarEvent){
        let calendarEventObj = {};
        calendarEventObj.title =  (calendarEvent.location)
                            ? calendarEvent.eventName + " / " + calendarEvent.location
                            : calendarEvent.eventName;
        calendarEventObj.start = moment(calendarEvent.startDate).format();
        calendarEventObj.end = moment(calendarEvent.endDate).format();
        calendarEventObj.location = calendarEvent.location;
        calendarEventObj.content = calendarEvent.description;
        calendarEventsArray.push(calendarEventObj);
    });
    let calendarEventsSource = {};
    calendarEventsSource.events = calendarEventsArray;
    calendarEventsSource.color = 'green';
    // log.info(calendarEventsSource);
    return calendarEventsSource;
}

let fetchUserCalendarEvents = () => {
    let calendarEvents = Smartix.Messages.Collection.find().fetch();
    let calendarEventsArray = [];
    lodash.forEach(calendarEvents, function(calendarEvent){
        let calendarEventObj = {};
        let calendarTemp = calendarEvent.addons[0];
        calendarEventObj.title =  (calendarTemp.location)
                            ? calendarTemp.eventName + " / " + calendarTemp.location
                            : calendarTemp.eventName;
        calendarEventObj.start = moment(calendarTemp.startDate).format();
        calendarEventObj.end = moment(calendarTemp.endDate).format();
        calendarEventObj.location = calendarTemp.location;
        calendarEventObj.content = calendarEvent.data.content;
        calendarEventsArray.push(calendarEventObj);
    });
    let calendarEventsSource = {};
    calendarEventsSource.events = calendarEventsArray;
    return calendarEventsSource;
}

let loadCalendar = () => {
    let mycalendar = jQuery('#calendar').fullCalendar({
            // put your options and callbacks here
            eventSources: [fetchSchoolCalendarEvents(), fetchUserCalendarEvents()],
            locale:  TAPi18n.getLanguage(),
            header: {
                left:   'title today',
                center: 'listMonth,month,agendaWeek,agendaDay',
                // listMonth not pretty but should be added later to get rid of our custom. dev list
                right:  'prev,next'
            },
            defaultView: 'month',//'listMonth',
            eventClick: function(calEvent, jsEvent, view) {
                IonModal.open("calendarModal", calEvent);
                // log.info(calEvent);
            }
    });
};

// let reloadCalendar = () =>{
//     log.info("Method Called");
//     jQuery('#calendar').fullCalendar('removeEvents');
//     jQuery('#calendar').fullCalendar('removeEventSource', fetchCalendarEvents());
//     jQuery('#calendar').fullCalendar('addEventSource', fetchCalendarEvents());
//     jQuery('#calendar').fullCalendar('rerenderEvents');
// }

Template.calendarModal.events({
  'click .add-to-calendar': function(event){
      var startDate = this.start;
      var endDate = this.end;
      var eventName = this.title;
      var location = this.location;
      var description = this.content;
    //   log.info(startDate, eventName, description, endDate);
      Smartix.Messages.Addons.Calendar.addEvent(eventName,location,description,startDate,endDate,function(){
         toastr.info(TAPi18n.__("EventAddCalendar")); 
      });
  }    
    
});
