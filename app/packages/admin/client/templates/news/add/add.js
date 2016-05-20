Template.AdminNewsAdd.onCreated(function () {
    this.autorun(() => {
        this.currentSchoolName = new ReactiveVar('currentSchoolName');
        if(Router
            && Router.current()
            && Router.current().params
            && Router.current().params.school
        ) {
            this.currentSchoolName = Router.current().params.school;
            this.subscribe('schoolInfo', this.currentSchoolName, (err, res) => {
                if(!err) {
                    this.subscribe('smartix:newsgroups/allNewsgroupsFromSchoolName', this.currentSchoolName, function (err, res) {
                        // console.log(err);
                        // console.log(res);
                    });
                }
            });
        }
    });

    this.subscribe('images');
    this.subscribe('documents');
        
    this.imageArr = new ReactiveVar([]);
    this.documentArr = new ReactiveVar([]);
    this.calendarEvent = new ReactiveVar({});
    
    this.showCalendarForm = new ReactiveVar(false);

});

Template.AdminNewsAdd.helpers({
    newsgroups: function () {
        if(Template.instance().subscriptionsReady()) {
            var schoolDoc = SmartixSchoolsCol.findOne({
                username: Template.instance().currentSchoolName
            });
            if(schoolDoc) {
                return Smartix.Groups.Collection.find({
                    namespace: schoolDoc._id,
                    type: 'newsgroup'
                });
            }
        }
    },
    uploadPic: function (argument) { 
        return Template.instance().imageArr.get();
    },
    uploadDocuments: function(argument){
        return Template.instance().documentArr.get();  
    },
    getDocument: function(){
        var id = this.toString();
        return Documents.findOne(id);      
    },    
    calendarEventSet:function(){ 
        return ( !($.isEmptyObject( Template.instance().calendarEvent.get() ) ) );
    },
    showCalendarForm:function(){
        return Template.instance().showCalendarForm.get();
    }
});

checkNews = function(broadcastList){
  if (broadcastList.size()===0 ) {
    toastr.info('To send a news, please create at least one newsgroup first');
    return false;
  }

  var anyChecked = false;
  broadcastList.each(function () {
    anyChecked = anyChecked || this.checked;
  });
  if (!anyChecked) {
    toastr.info('Please check at least one newsgroup');
    return false;
  }
  return true;
};

var clearForm = function (index, broadcastList, sentToNewgroupNames, template) {

    // If last element
    if( (index + 1) === broadcastList.length) {
        
        // Clear form values
        $('#addNews-title').val("");
        $('#addNews-content').val("");
        
        template.imageArr.set([]); 
        template.documentArr.set([]); 
        template.calendarEvent.set({}); 
        
        template.showCalendarForm.set(false);   

        toastr.info('News sent to group: ' + sentToNewgroupNames.toString() );                                               
    }
}

Template.AdminNewsAdd.events({
    'click #addNews-submit': function (event, template) {
        var broadcastList = $("input[type='checkbox'][name='addNews-newsgroup']");
        if (!checkNews(broadcastList)) {
          return;
        }

        var title = $('#addNews-title').val();
        var content = $('#addNews-content').val();
        var doPushNotificationB = true; //document.getElementById("addNews-push-notification").checked;
        //log.info('doPushNotificationB',doPushNotificationB);
        event.preventDefault();
        
        if(template.showCalendarForm.get()){
            if($('#event-name').val() === ""){
                toastr.info('Please fill in Event Name');
                return;
            }
            
             if($('#location').val() === ""){
                toastr.info('Please fill in Event Location');
                return;
            }           
            template.calendarEvent.set({
                eventName: $('#event-name').val(),
                location: $('#location').val(),
                startDate:$('#start-date').val(),
                startDateTime:$('#start-date-time').val(),
                endDate:$('#end-date').val(),
                endDateTime:$('#end-date-time').val()       
            });            
        }
        
        var addons = [];

        var mediaObj = {};
        mediaObj.imageArr = template.imageArr.get();
        mediaObj.documentArr = template.documentArr.get();
        mediaObj.calendarEvent = template.calendarEvent.get();

        populateAddons(addons, mediaObj);
        
        var sentToNewgroupNames = [];
        broadcastList.each(function (index) {
            var self = this;
            if (self.checked) {
   
                Meteor.call('smartix:messages/createNewsMessage'
                , self.value
                , 'article'
                , {
                    content: content,
                    title: title
                }
                , addons
                , doPushNotificationB
                , function() {
                    // TODO - add here newsgroup name 
                    sentToNewgroupNames.push($('label[for=' + self.value + ']').text());
                    clearForm(index, broadcastList, sentToNewgroupNames, template);
                });
            } else {
                clearForm(index, broadcastList, sentToNewgroupNames, template);
            }
        });
    },
    'change #imageBtn': function (event, template) {
        //https://github.com/CollectionFS/Meteor-CollectionFS
        //Image is inserted from here via FS.Utility
        Smartix.FileHandler.imageUpload(event,'class',template.imageArr.get(),
            function(result){
                console.log('imageArr',result);
                template.imageArr.set(result);
            });
        showPreview("image");
    },
    'click .set-calendar':function(event,template){
        if(template.showCalendarForm.get() == true){
           template.showCalendarForm.set(false);
        }else{
           template.showCalendarForm.set(true);
        }
       
        //TODO: change to Bootstrap equvialent implementation
        /*
        IonPopup.show({
        title: 'Set a calendar event',
        templateName: 'CalendarEvent',
        buttons: [{
            text: 'Set',
            type: 'button-positive',
            onTap: function(event,template) {
            
            log.info($(template.firstNode).find('#event-name').val());
            
            // $(template.firstNode).find('.hidden').click();
            if($(template.firstNode).find('#event-name').get(0).checkValidity() &&
            $(template.firstNode).find('#location').get(0).checkValidity() &&
            $(template.firstNode).find('#start-date').get(0).checkValidity() &&
            $(template.firstNode).find('#start-date-time').get(0).checkValidity() &&
            $(template.firstNode).find('#end-date').get(0).checkValidity() &&
            $(template.firstNode).find('#end-date-time').get(0).checkValidity())
            { } else{
                toastr.info('Please fill the form');
                return;
            }
            
            sendMsgtemplate.calendarEvent.set({
                eventName: $(template.firstNode).find('#event-name').val(),
                location: $(template.firstNode).find('#location').val(),
                startDate:$(template.firstNode).find('#start-date').val(),
                startDateTime:$(template.firstNode).find('#start-date-time').val(),
                endDate:$(template.firstNode).find('#end-date').val(),
                endDateTime:$(template.firstNode).find('#end-date-time').val()       
            });
            
            log.info(sendMsgtemplate.calendarEvent.get());
            
            IonPopup.close();
            }
        }]
        });*/
    },
    'change #documentBtn': function (event, template) {
        Smartix.FileHandler.documentUpload(event,'newsInAdmin',template.documentArr.get(),
        
        function(result){
           
                console.log('documentArr',result);
                template.documentArr.set(result);
            
        });
       showPreview("document");
    }     
});

function showPreview(filetype){
    log.info("show preview:filetype:"+filetype);
    
    $('.preview'+'.'+filetype).show();  
}
function hidePreview(filetype){
    log.info("hide preview:filetype:"+filetype);
    $('.preview'+'.'+filetype).hide();       

}


function populateAddons(addons, mediaObj)
{
  //add images to addons one by one if any
  if (mediaObj.imageArr.length > 0) {
    //console.log('there is image');
    mediaObj.imageArr.map(function (eachImage) {
      addons.push({type: 'images', fileId: eachImage});
    })
  }

  //add documents to addons one by one if any
  if (mediaObj.documentArr.length > 0) {
    //console.log('there is doc');
    mediaObj.documentArr.map(function (eachDocument) {
      addons.push({type: 'documents', fileId: eachDocument});
    })
  }

  //add calendar to addons one by one if any
  if (mediaObj.calendarEvent.eventName && mediaObj.calendarEvent.eventName != "") {
    //console.log('there is calendar');
    //console.log(mediaObj.calendarEvent);
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