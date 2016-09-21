//TODO:

//1. get all messages that have calendar addons that user is in the group
//db.getCollection('smartix:messages').find({'addons.type':'calendar',group:{ $in: usergroups}})

//2. display them like the list view shown in github
Template.CalendarListView.onCreated(function(){
   var self = this;
   self.subscribe('newsgroupsForUser',null,null,Session.get('pickedSchoolId'),function(){
      //self.subscribe('newsForUser',null,null,Session.get('pickedSchoolId'));
      self.subscribe('calendarEntriesForUser',null,null,Session.get('pickedSchoolId'));
      self.subscribe('smartix:distribution-lists/listsInNamespace',Session.get('pickedSchoolId'));
   });    
});

var calendar = null;

Template.CalendarListView.onRendered( () => {
    //calendar = $('#calendar22').fullCalendar();

    $('#calendar').fullCalendar({
        // put your options and callbacks here
    });

    //log.info("Calen", calendar);
});


Template.CalendarListView.helpers({
    
    // calendarOptions:function(){
    //     return {
    //         // Standard fullcalendar options
    //         height: 700,
    //         hiddenDays: [ 0 ],
    //         slotDuration: '01:00:00',
    //         minTime: '08:00:00',
    //         maxTime: '19:00:00',
    //         lang: 'fr',
    //         // Function providing events reactive computation for fullcalendar plugin
    //         events: function(start, end, timezone, callback) {
    //             //console.log(start);
    //             //console.log(end);
    //             //console.log(timezone);
    //             var events = [];
    //             // Get only events from one document of the Calendars collection
    //             // events is a field of the Calendars collection document
    //             var calendar = Calendars.findOne(
    //                 { "_id":"myCalendarId" },
    //                 { "fields": { 'events': 1 } }
    //             );
    //             // events need to be an array of subDocuments:
    //             // each event field named as fullcalendar Event Object property is automatically used by fullcalendar
    //             if (calendar && calendar.events) {
    //                 calendar.events.forEach(function (event) {
    //                     eventDetails = {};
    //                     for(key in event)
    //                         eventDetails[key] = event[key];
    //                     events.push(eventDetails);
    //                 });
    //             }
    //             callback(events);
    //         },
    //         // Optional: id of the calendar
    //         id: "calendar1",
    //         // Optional: Additional classes to apply to the calendar
    //         addedClasses: "col-md-8",
    //         // Optional: Additional functions to apply after each reactive events computation
    //         autoruns: [
    //             function () {
    //                 console.log("user defined autorun function executed!");
    //             }
    //         ]
    //     }
    // },

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
        var calendarObjs =lodash.filter(this.addons, function(addon) { return addon.type =='calendar'; });
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