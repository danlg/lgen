// BEGINNING OF FULL CALENDAR INTEGRATION - This works just remove comment to make calendar appear

import jQuery from 'jquery'
import fullCalendar from 'fullcalendar';

var mycalendar;

Template.CalendarListView.onCreated(function(){
    var self = this;
    self.subscribe('newsgroupsForUser',null,null,Session.get('pickedSchoolId'),function(){
        //self.subscribe('newsForUser',null,null,Session.get('pickedSchoolId'));
        self.subscribe('calendarEntriesForUser',null,null,Session.get('pickedSchoolId'), function(){
            let calendarEvents = Smartix.Messages.Collection.find(
            {},
            // { sort: { 'addons.startDate': 1 } }// sort doesn't work on server side, for calendar event, by chronological order
            ).fetch();
            let calendarEventsArray = [];
            lodash.forEach(calendarEvents, function(calendarEvent){
                let calendarEventObj = {};
                calendarEventObj.title = calendarEvent.addons[0].eventName;
                calendarEventObj.start = moment(calendarEvent.addons[0].startDate).format();
                calendarEventObj.end = moment(calendarEvent.addons[0].endDate).format();
                calendarEventObj.description = "Location: " + calendarEvent.addons[0].location;
                calendarEventsArray.push(calendarEventObj);
            });
            mycalendar = jQuery('#calendar').fullCalendar({
                    // put your options and callbacks here
                    events: calendarEventsArray,
                    // eventRender: function(event, element) {
                    //     element.qtip({
                    //         content: event.description
                    //     });
                    // }
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

Template.CalendarListView.events({

  'click .add-to-calendar':function(event){
      var startDate = this.startDate;
      var endDate = this.endDate;
      var eventName = this.eventName;
      var location = this.location;
      var description = $(event.target).data('description');
      
      Smartix.Messages.Addons.Calendar.addEvent(eventName,location,description,startDate,endDate,function(){
         toastr.info(TAPi18n.__("EventAddCalendar")); 
      });
  }    
    
});
