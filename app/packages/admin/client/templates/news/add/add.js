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
        
    })

    this.subscribe('images');
    this.subscribe('documents');
        
    this.imageArr = new ReactiveVar([]);
    this.documentArr = new ReactiveVar([]);
    this.calendarEvent = new ReactiveVar({});

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
        if($.isEmptyObject(Template.instance().calendarEvent.get())){
            return false;
        }else{
            return true;
        }
    }
})

Template.AdminNewsAdd.events({
    'click #addNews-submit': function (event, template) {

        var title = $('#addNews-title').val();
        var content = $('#addNews-content').val();
        var doPushNotification = document.getElementById("addNews-push-notification").checked
        log.info('doPushNotification',doPushNotification);
        event.preventDefault();

        $("input[type='checkbox'][name='addNews-newsgroup']").each(function (index) {
            if (this.checked) {
                Meteor.call('smartix:messages/createNewsMessage', this.value, 'article', { content: content, title: title }, null,doPushNotification);
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
    'click .cancel-calendar':function(event,template){
        template.calendarEvent.set({});
    },
    'click .set-calendar':function(event,sendMsgtemplate){
        
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