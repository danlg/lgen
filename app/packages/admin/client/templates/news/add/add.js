Template.AdminNewsAdd.onCreated(function () {
    const self = Template.instance();
    this.autorun(() => {
        var schoolName = UI._globalHelpers['getCurrentSchoolName']();
        self.subscribe('schoolInfo', schoolName , (err, res) => {
            if(!err) {
                self.subscribe('smartix:newsgroups/allNewsgroupsFromSchoolName',
                    schoolName, function (err, res) {
                    // console.log(err);
                    // console.log(res);
                });
            }
        });
    });
    // this.subscribe('images');
    // this.subscribe('documents');
    this.imageArr = new ReactiveVar([]);
    this.documentArr = new ReactiveVar([]);
    this.calendarEvent = new ReactiveVar({});
    this.showCalendarForm = new ReactiveVar(false);
});

Template.AdminNewsAdd.onRendered(function(){
  $('#addNews-content').trumbowyg({
     btnsAdd: ['foreColor', 'backColor']
  });
});

Template.AdminNewsAdd.helpers({
    newsgroups: function () {
        if(Template.instance().subscriptionsReady()) {
            if(schoolDoc) {
                return Smartix.Groups.Collection.find({
                    namespace: UI._globalHelpers['getCurrentSchoolId'](),
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
  if (broadcastList.length < 1 ) {
    toastr.info('To send a news, please create at least one newsgroup first');
    return false;
  }
  var anyChecked = false;
  broadcastList.each(function () {
    anyChecked = anyChecked || this.checked;
  });
  if (!anyChecked) {
    toastr.info('Please select at least one newsgroup');
    return false;
  }
  return true;
};

var notifyUser = function (index, broadcastList, sentToNewgroupNames) {
    // If last element
    if( (index + 1) === broadcastList.length) {
        toastr.info('News sent to group: ' + sentToNewgroupNames.toString() );                                               
    }
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

Template.AdminNewsAdd.events({

    'click #addNews-clear':function(event,template){
        //log.info("clear");
        clearForm();
    },
    
    'click #addNews-submit': function (event, template) {
        var broadcastList = $("input[type='checkbox'][name='addNews-newsgroup']");
        if (!checkNews(broadcastList)) {
          return;
        }
        var title = $('#addNews-title').val();
        var content =  $('#addNews-content').trumbowyg('html'); //$('#addNews-content').val();
        if(!title || !content) {
            toastr.error('Please ensure both the Title and Content fields are filled in.');
            return false;
        }
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
                    notifyUser(index, broadcastList, sentToNewgroupNames);
                });
            }
        });
    },

    'change #imageBtn': function (event, template) {
        //https://github.com/CollectionFS/Meteor-CollectionFS
        //Image is inserted from here via FS.Utility
        Smartix.FileHandler.imageUpload(event,{category: 'class'},template.imageArr.get(),
            function(result){
                //log.info('imageArr',result);
                template.imageArr.set(result);
            });
        showPreview("image");
    },

    'click .set-calendar':function(event,template){
        template.showCalendarForm.set( !template.showCalendarForm.get() );
    },

    'change #documentBtn': function (event, template) {
        Smartix.FileHandler.documentUpload(event, {'category': 'newsInAdmin'},template.documentArr.get(),
        function(result){
                //log.info('documentArr',result);
                template.documentArr.set(result);
        });
       showPreview("document");
    }
});

function showPreview(filetype){
    //log.info("show preview:filetype:"+filetype);
    $('.preview'+'.'+filetype).show();  
}

function hidePreview(filetype){
    //log.info("hide preview:filetype:"+filetype);
    $('.preview'+'.'+filetype).hide();
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