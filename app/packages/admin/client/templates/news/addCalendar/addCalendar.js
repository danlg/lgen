
import jQuery from 'jquery'
import fullCalendar from 'fullcalendar';

isNewEvent = ReactiveVar(true);
isAllDayEvent = ReactiveVar(false);

Template.AdminCalendarAdd.onCreated(function () {
    var schoolId =  UI._globalHelpers['getCurrentSchoolId']();
     this.subscribe('smartix:calendar/eventsBySchool', schoolId, function(){
                loadCalendar();
    });    
});

Template.AdminCalendarAdd.helpers({
    getCurrentTime : function(){
        let date = new Date();
	    //todo round to the next hour
        return moment(date).format('HH:mm');
    },
    getCurrentTimePlusOne : function(){
        let date = new Date();
        return moment(date).add(1, 'hours').format('HH:mm');
    },
    isNewEvent : function(){
        return isNewEvent.get();
    },
    isAllDayEvent: function(){
        return isAllDayEvent.get();
    }
});

Template.AdminCalendarAdd.events({

    'click #modal-save':function(event,template){
        log.info("clear");
        let calendarObj = {};
        let startDateTime, endDateTime;
        if(!isAllDayEvent.get()){
            startDateTime = moment($('#start-date').val()+" "+$('#start-date-time').val()).utc().format();
            endDateTime = moment($('#end-date').val()+" "+$('#end-date-time').val()).utc().format();
        }else{
            startDateTime = moment($('#start-date').val()).format("YYYY-MM-DD");
            endDateTime = moment($('#start-date').val()).add(1, 'days').format("YYYY-MM-DD");
        }
        // log.info(startDateAndTime);
        calendarObj.schoolId =  UI._globalHelpers['getCurrentSchoolId']();
        calendarObj.eventName = $('#event-name').val();
        calendarObj.location = $('#location').val();
        calendarObj.description = $('#description').val();
        calendarObj.calendarName = $('#calendarName').val();
        calendarObj.startDate = startDateTime;
        calendarObj.endDate = endDateTime;
        calendarObj.allDay = $("#all-day-event").is(':checked');
        log.info(calendarObj);       
        Meteor.call('smartix:calendar/addNewCalendarEvent', calendarObj, function(err, res){
            if(!err){
                log.info("Successfully added event");
                reloadCalendar();
                notifyAdmin();
            }
            else{
                log.error("There was an issue");
                toastr.error("There was an issue posting event");
            }
            isAllDayEvent.set(false);
        });
    },  
    
    'click #modal-delete': function(event, template){
        let eventId = $('#eventId').val();
        log.info('deleteing:', eventId);
        Meteor.call('smartix:calendar/deleteCalendarEvent', eventId, function(err, res){
            if(!err)
            {
                log.info("Success");
                reloadCalendar();
                toastr.info("Successfully deleted event");
            }
            else{
                log.error("There was an issue");
                toastr.error("There was an issue");
            }
        })
    },

    'click #modal-edit': function(event, template){
        let eventId = $('#eventId').val();
        let orgEventObj = Smartix.Calendar.Collection.findOne(eventId);
        let startDateTime, endDateTime;
        let calendarObj = {};
        if(!isAllDayEvent.get()){
            let startTime = ($('#start-date-time').val()) ? $('#start-date-time').val() : moment(orgEventObj.startDate).format('HH:mm');
            let endTime = ($('#end-date-time').val()) ? $('#end-date-time').val() : moment(orgEventObj.endDate).format('HH:mm');
            startDateTime = moment($('#start-date').val()+" "+startTime).utc().format();
            endDateTime = moment($('#end-date').val()+" "+endTime).utc().format();
        }
       else{
            startDateTime = moment($('#start-date').val()).format("YYYY-MM-DD");
            endDateTime = moment($('#start-date').val()).add(1, 'days').format("YYYY-MM-DD");
        }
        calendarObj.eventName = $('#event-name').val();
        calendarObj.location = $('#location').val();
        calendarObj.description = $('#description').val();
        calendarObj.calendarName = $('#calendarName').val();
        calendarObj.startDate = startDateTime;
        calendarObj.endDate = endDateTime;
        calendarObj.allDay = $("#all-day-event").is(':checked');
        Meteor.call('smartix:calendar/editCalendarEvent', calendarObj, eventId, function(err, res){
            if(!err){
                reloadCalendar();
                clearForm();
                toastr.info("Successfully updated event");
            }
            else{
                log.error("There was an issue");
                toastr.error("There was an issue");
            }
        });
    },

    'change #all-day-event': function(event, template){
        isAllDayEvent.set(!isAllDayEvent.get());
    }
});

var notifyAdmin = function () {
    // If last element
    clearForm();
    toastr.info("Successfully added event");
};

var clearForm = function ( ) {
    // Clear form values
    document.getElementById("calendar-input-form").reset();
};

let fetchCalendarEvents = () => {
    let calendarEvents = Smartix.Calendar.Collection.find().fetch();
    let calendarEventsArray = [];
    lodash.forEach(calendarEvents, function(calendarEvent){
        let calendarEventObj = {};
        calendarEventObj.id = calendarEvent._id;
        calendarEventObj.title =  (calendarEvent.location)
                            ? calendarEvent.eventName + " / " + calendarEvent.location
                            : calendarEvent.eventName;
        calendarEventObj.start = moment(calendarEvent.startDate).format();
        calendarEventObj.end = moment(calendarEvent.endDate).format();
        calendarEventObj.location = calendarEvent.location;
        calendarEventObj.content = calendarEvent.description;
        calendarEventObj.allDay = calendarEvent.allDay || '';
        calendarEventsArray.push(calendarEventObj);
    });
    let calendarEventsSource = {};
    calendarEventsSource.events = calendarEventsArray;
    // log.info(calendarEventsSource);
    return calendarEventsSource;
};

let loadCalendar = () => {
    let mycalendar = jQuery('#calendar').fullCalendar({
            // put your options and callbacks here
            //droppable: true,
            eventSources: [fetchCalendarEvents()],
            locale:  TAPi18n.getLanguage(),
            header: {
                left:   'title today',
                center: 'month,agendaWeek,agendaDay',
                right:  'prev,next'
            },
            selectable:true,
            select: function(start, end, jsEvent, view){
                selectCalendarRange(start, end)
            },
            eventClick: function(calEvent, jsEvent, view) {
                editCalendarEvent(calEvent);
            }
    });
    // log.info(mycalendar);
};

let reloadCalendar = () =>{
    let cal = jQuery('#calendar');//time consuming
    cal.fullCalendar('removeEvents');
    cal.fullCalendar('removeEventSource', fetchCalendarEvents());
    cal.fullCalendar('addEventSource', fetchCalendarEvents());
    cal.fullCalendar('rerenderEvents');
};

let selectCalendarRange = (start, end) =>
{
    isNewEvent.set(true);
    //if the admin clicks on one date need to ensure it is not all day event
    if(end.diff(start) === 86400000)
    {
        $('#end-date').attr('value', start.format('YYYY-MM-DD'));
    }
    else
        $('#end-date').attr('value', end.format('YYYY-MM-DD'));
    $('#start-date').attr('value', start.format('YYYY-MM-DD'));
    openModal();
}

let editCalendarEvent = (calEvent) => {
    isNewEvent.set(false);
    openModal(calEvent);
}

let openModal = (eventDetails) => {
    //do something if not a new event
    isAllDayEvent.set(false);
    $("#all-day-event").prop("checked", false);
    if(!isNewEvent.get() && eventDetails){
        let calendarEventObj = Smartix.Calendar.Collection.findOne(eventDetails.id);
        $('#eventId').val(calendarEventObj._id);
        $('#event-name').val(calendarEventObj.eventName);
        $('#location').val(calendarEventObj.location);
        $('#calendarName').val(calendarEventObj.calendarName);
        $('#description').val(calendarEventObj.description);
        $('#start-date').val( moment(calendarEventObj.startDate).format('YYYY-MM-DD'));
        $('#end-date').val(moment(calendarEventObj.endDate).format('YYYY-MM-DD'));
        let startTime = moment(calendarEventObj.startDate).format('HH:mm');
        $('#start-date-time').val(startTime);
        let endTime = moment(calendarEventObj.endDate).format('HH:mm');
        $('#end-date-time').val(endTime);
        if(calendarEventObj.allDay){
            isAllDayEvent.set(true);
            $("#all-day-event").prop("checked", true);
        }
    }
    else{
        clearForm();
    }
    Meteor.setTimeout(function(){
        $('#calendar-event-btn').click();  
    },200);  
}