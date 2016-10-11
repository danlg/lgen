
import jQuery from 'jquery'
import fullCalendar from 'fullcalendar';

Template.AdminCalendarAdd.onCreated(function () {
    const self = Template.instance();
    var schoolName = UI._globalHelpers['getCurrentSchoolName']();
    var schoolId =  UI._globalHelpers['getCurrentSchoolId']();
    this.autorun(() => {
        if(schoolName)
        {
            self.subscribe('smartix:newsgroups/allNewsgroupsFromSchoolName', schoolName);
        }
    });
     self.subscribe('smartix:calendar/eventsBySchool', schoolId, function(){
                // log.info(Smartix.Calendar.Collection.find().fetch());
                loadCalendar();
    }); 
    this.calendarEvent = new ReactiveVar({});
    this.showCalendarForm = new ReactiveVar(false);
})

Template.AdminCalendarAdd.helpers({
    newsgroups: function () {
        if(Template.instance().subscriptionsReady()) {
            // var schoolDoc = UI._globalHelpers['getCurrentSchoolName']();
            // if(schoolDoc) {
                return Smartix.Groups.Collection.find({
                    type: 'newsgroup'
                });
            // }
        }
    },
    calendarEventSet:function(){ 
        return ( !($.isEmptyObject( Template.instance().calendarEvent.get() ) ) );
    },
    showCalendarForm:function(){
        return Template.instance().showCalendarForm.get();
    },
    getCurrentTime : function(){
        var date = new Date();
        var formattedTime = moment(date).format('HH:mm');
        return formattedTime;
    },
    getCurrentTimePlusOne : function(){
        var date = new Date();
        var formattedTime = moment(date).add(1, 'hours').format('HH:mm');
        return formattedTime;
    }
});

Template.AdminCalendarAdd.events({

    'click #modal-save':function(event,template){
        log.info("clear");
        let startDateTime = moment($('#start-date').val()+" "+$('#start-date-time').val()).utc().format();
        let endDateTime = moment($('#end-date').val()+" "+$('#end-date-time').val()).utc().format();
        // log.info(startDateAndTime);
        let calendarObj = {};
        calendarObj.schoolId =  UI._globalHelpers['getCurrentSchoolId']();
        calendarObj.eventName = $('#event-name').val();
        calendarObj.location = $('#location').val();
        calendarObj.description = $('#description').val();
        calendarObj.calendarName = $('#calendarName').val();
        calendarObj.startDate = startDateTime;
        calendarObj.endDate = endDateTime;
        log.info(calendarObj);       
        Meteor.call('smartix:calendar/addNewCalendarEvent', calendarObj, function(err, res){
            if(!err){
                log.info("Successfully added event to DB");
                reloadCalendar();
                notifyAdmin();
            }
            else{
                log.error("There was an issue");
                toastr.error("There was an issue posting event");
            }
        });
    },  

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


let fetchCalendarEvents = () =>{
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
    // log.info(calendarEventsSource);
    return calendarEventsSource;
}

let loadCalendar = () => {
    mycalendar = jQuery('#calendar').fullCalendar({
            // put your options and callbacks here
            eventSources: [fetchCalendarEvents()],
            locale:  TAPi18n.getLanguage(),
            header: {
                left:   'title',
                center: 'month',
                // listMonth not pretty but should be added later to get rid of our custom. dev list
                right:  'prev,next'
            },
            selectable:true,
            select: function(start, end, jsEvent, view){
                selectCalendarRange(start, end)
            }
            // eventClick: function(calEvent, jsEvent, view) {
            //     alert('Event: ' + calEvent.title);
            //     alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
            //     alert('View: ' + view.name);
            //     // change the border color just for fun
            //     $(this).css('border-color', 'red');
            // }
    });
    // log.info(mycalendar);
}

let reloadCalendar = () =>{
    jQuery('#calendar').fullCalendar('removeEvents');
    jQuery('#calendar').fullCalendar('removeEventSource', fetchCalendarEvents());
    jQuery('#calendar').fullCalendar('addEventSource', fetchCalendarEvents());
    jQuery('#calendar').fullCalendar('rerenderEvents');
}


let selectCalendarRange = (start, end) =>
{
    //if the admin clicks on one date need to ensure it is not all day event
    if(end.diff(start) === 86400000)
    {
        $('#end-date').attr('value', start.format('YYYY-MM-DD'));
    }
    else
        $('#end-date').attr('value', end.format('YYYY-MM-DD'));
    $('#start-date').attr('value', start.format('YYYY-MM-DD'));
    Meteor.setTimeout(function(){
        $('#calendar-event-btn').click();  
    },200);  
}