Template.AdminNewsAdd.onCreated(function () {
    const self = this;
    self.imageArr = new ReactiveVar([]);
    self.fileArr = new ReactiveVar([]);
    self.documentArr = new ReactiveVar([]);
    self.calendarEvent = new ReactiveVar({});
    self.showCalendarForm = new ReactiveVar(false);
    let schoolName = UI._globalHelpers['getCurrentSchoolName']();
    if(schoolName)
        {
            self.subscribe('smartix:newsgroups/allNewsgroupsFromSchoolName', schoolName);   
        }
    });

Template.AdminNewsAdd.onRendered(function(){
  $('#addNews-content').trumbowyg({
     btnsAdd: ['foreColor', 'backColor']
  });
});

Template.AdminNewsAdd.helpers({
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
    routeData: function () {
       return {
           school:  UI._globalHelpers['getCurrentSchoolName']()
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
    },
    uploadedFileNames: function(){
        return Template.instance().fileArr.get();
    }
});

let checkNews = function(broadcastList){
  if (broadcastList.length < 1 ) {
    toastr.info(TAPi18n.__("Admin.NoNewsgroupExists"));
    return false;
  }
  return true;
};

var notifyAdmin = function (msg) {
    // If last element
    toastr.info(TAPi18n.__("Admin.NewsSentToGroup") );
    // log.info("Notify");
    Router.go('admin.news.view', { school: Router.current().params.school, msgcode: msg}); 
    // clearForm();
};

// var clearForm = function ( ) {
//     // Clear form values
//     $('#addNews-title').val("");
//     //https://alex-d.github.io/Trumbowyg/documentation.html#empty
//     $('#addNews-content').trumbowyg('empty');
//     Template.instance().imageArr.set([]);
//     Template.instance().documentArr.set([]);
//     Template.instance().calendarEvent.set({});
//     Template.instance().showCalendarForm.set(false);
// };

Template.AdminNewsAdd.events({

    'click #addNews-clear':function(event,template){
        //log.info("clear");
        clearForm();
    },
    
    'click #addNews-submit': function (event, template) {
        var broadcastList = [];
            $.each($("input[name='addNews-newsgroup'][type='checkbox']:checked"), function(){            
                broadcastList.push($(this).val());
        });
        if (!checkNews(broadcastList)) {
          return;
        }
        var title = $('#addNews-title').val();
        var content =  $('#addNews-content').trumbowyg('html'); //$('#addNews-content').val();
        if(!title || !content) {
            toastr.error(TAPi18n.__("Admin.NewsFieldsNotFilled"));
            return false;
        }
        var doPushNotificationB = true; //document.getElementById("addNews-push-notification").checked;
        //log.info('doPushNotificationB',doPushNotificationB);
        event.preventDefault();
        if(template.showCalendarForm.get()){
            if($('#event-name').val() === ""){
                toastr.info(TAPi18n.__("FillEventDetail"));
                return;
            }
             if($('#location').val() === ""){
                toastr.info(TAPi18n.__("FillEventDetail"));
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
        // var sentToNewgroupNames = [];
        // var lastNewsGroupCode;
        Meteor.call('smartix:messages/createNewsMessage'
            , broadcastList
            , 'article'
            , {
                content: content,
                title: title
            }
            , addons
            , doPushNotificationB, 
            (err, res)=>{
                if(!err)
                {
                    //we notify the admin sender after the messages are sent

                    notifyAdmin(res);
                    //we redirect to the page where the news is shown
                    // Router.go('admin.newsgroups.view', { school: Router.current().params.school, classCode: lastNewsGroupCode });
                }
                else
                {
                    log.error(err);
                    toastr.error(TAPi18n.__("Admin.NewsSentError"));
                }
            });
            // log.info("After call");
    },

    'change #imageBtn': function (event, template) {
        //https://github.com/CollectionFS/Meteor-CollectionFS
        //Image is inserted from here via FS.Utility
        var metadata = {category: 'news', school: UI._globalHelpers['getCurrentSchoolName']()};
        Smartix.FileHandler.imageUpload(event, metadata, template.imageArr.get(),
            function(result){
                //log.info('imageArr',result);
                template.imageArr.set(result);
                var fileArr = template.fileArr.get();
                fileArr.push(event.target.files[0].name);
                template.fileArr.set(fileArr);
            });
    },

    'click .set-calendar':function(event,template){
        template.showCalendarForm.set( !template.showCalendarForm.get() );
    },

    'change #documentBtn': function (event, template) {
	    const metadata = { category: 'news', school: UI._globalHelpers['getCurrentSchoolName']() };
        Smartix.FileHandler.documentUpload(event, metadata,template.documentArr.get(),
        function(result){
                //log.info('documentArr',result);
                template.documentArr.set(result);
                var fileArr = template.fileArr.get();
                fileArr.push(event.target.files[0].name);
                template.fileArr.set(fileArr);
        });
    }
});

// function showPreview(filetype){
//     //log.info("show preview:filetype:"+filetype);
//     $('.preview'+'.'+filetype).show();  
// }

// function hidePreview(filetype){
//     //log.info("hide preview:filetype:"+filetype);
//     $('.preview'+'.'+filetype).hide();
// }

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