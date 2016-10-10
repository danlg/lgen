
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
        log.info(Smartix.Calendar.Collection.find().fetch())
    });
    this.calendarEvent = new ReactiveVar({});
    this.showCalendarForm = new ReactiveVar(false);
})

Template.AdminCalendarAdd.onRendered(function(){
    loadCalendar();
});

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
        calendarObj.startDate = startDateTime;
        calendarObj.endDate = endDateTime;
        log.info(calendarObj);       
        Meteor.call('smartix:calendar/addNewCalendarEvent', calendarObj, function(err, res){
            if(!err){
                log.info("Successfully added event to DB");
            }
        });
    },
    

});


var notifyAdmin = function (sentToNewgroupNames) {
    // If last element
    clearForm();
    toastr.info(TAPi18n.__("Admin.NewsSentToGroup") + sentToNewgroupNames.toString() );
};

var clearForm = function ( ) {
    // Clear form values
    $('#addNews-title').val("");
    //https://alex-d.github.io/Trumbowyg/documentation.html#empty
    $('#addNews-content').trumbowyg('empty');
    Template.instance().imageArr.set([]);
    Template.instance().documentArr.set([]);
    Template.instance().calendarEvent.set({});
    Template.instance().showCalendarForm.set(false);
};


let loadCalendar = () => {
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

    mycalendar = jQuery('#calendar').fullCalendar({
            // put your options and callbacks here
            locale:  TAPi18n.getLanguage(),
            events: calendarEventsArray,
            header: {
                left:   'title',
                center: 'month',
                // listMonth not pretty but should be added later to get rid of our custom. dev list
                right:  'prev,next'
            },
            eventClick: function(calEvent, jsEvent, view) {
                IonModal.open("calendarModal", calEvent);
                log.info(calEvent);
            },
            selectable:true,
            select: function(start, end, jsEvent, view){
                selectCalendarRange(start, end)
            }
    });
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

function populateAddons(addons, mediaObj)
{
  //add images to addons one by one if any
  if (mediaObj.imageArr.length > 0) {
    //log.info('there is image');
    mediaObj.imageArr.map(function (eachImage) {
      addons.push({type: 'images', fileId: eachImage});
    })
  }
  //add documents to addons one by one if any
  if (mediaObj.documentArr.length > 0) {
    //log.info('there is doc');
    mediaObj.documentArr.map(function (eachDocument) {
      addons.push({type: 'documents', fileId: eachDocument});
    })
  }
  //add calendar to addons one by one if any
  if (mediaObj.calendarEvent.eventName && mediaObj.calendarEvent.eventName != "") {
    //log.info('there is calendar');
    //log.info(mediaObj.calendarEvent);
    addons.push(populateCalendar(mediaObj));
  }
}

function populateCalendar(mediaObj) {
  var calendarObj = { 
                        type:'calendar',
                        eventName: mediaObj.calendarEvent.eventName,
                        location:  mediaObj.calendarEvent.location,
                        startDate: mediaObj.calendarEvent.startDate + " " + mediaObj.calendarEvent.startDateTime ,
                        endDate:   mediaObj.calendarEvent.endDate   +" " +  mediaObj.calendarEvent.endDateTime
                     };  
  return calendarObj;
}