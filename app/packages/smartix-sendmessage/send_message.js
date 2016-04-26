/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Session.setDefault("sendMessageSelectedClasses", {
  selectArrName: [],
  selectArrId: []
});
var imageArr = ReactiveVar([]);
var soundArr = ReactiveVar([]);
var documentArr = ReactiveVar([]);
var isRecording = false;
var media = "";
var isPlayingSound = false;
var messageListBaseBorrow = 70;
var messageListHeightBorrower = ReactiveVar([]);
var canVote = ReactiveVar(true);
/*var arr = [];*/
/*var selectArr = ReactiveVar("");
 var selecting = ReactiveVar(false);*/

/*****************************************************************************/
/* SendMessage: Event Handlers */
/*****************************************************************************/
Template.SendMessage.events({
  'click .cancel-calendar':function(event,template){
    template.calendarEvent.set({});
  },
  'click .set-calendar':function(event,sendMsgtemplate){
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
          {
              
          }else{
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
    });
  },
  'click #allowVote':function(e){
      if($('input#allowVote:checked').length > 0){
          canVote.set(true);
          
        if(lodash.findIndex(borrower,{type:"vote-options"}) == -1){
            var borrower = messageListHeightBorrower.get();
            borrower.push({type:"vote-options",height:20});
            messageListHeightBorrower.set(borrower);
            updateMessageListHeight();           
        }         
      }else{
          canVote.set(false);
          var borrower = messageListHeightBorrower.get();
          lodash.remove(borrower, function (obj) {
              if (obj.type == "vote-options") {
                  return true;
              }
          });
          messageListHeightBorrower.set(borrower);
          updateMessageListHeight();             
      }      
  },
  'click #imageBtn': function (e) {

   
    if (Meteor.isCordova) {
      if (window.device.platform === "Android") {
        e.preventDefault();
        imageAction();
      }
    }

  },
  'click .ion-play.playBtn': function (e) {
    if (!isPlayingSound) {
      isPlayingSound = true;
      var playname = $(e.target).data('clipid');
      var soundUrl = $(e.target).data('clipurl');
      //  $(e.target).attr('class','icon ion-stop');
      $(e.target).attr('class', 'button button-icon icon ion-stop ');

      // log.info(playname);

      // log.info(Sounds.findOne(playname).url());
      // log.info(Sounds.findOne(playname));
      log.info(soundUrl);
      log.info("startPlay");
      Smartix.helpers.playAudio(soundUrl, function (argument) {
        log.info("finishPlay");
        $(e.target).attr('class', 'button button-icon icon ion-play playBtn');
        isPlayingSound = false;
      });
    }
  },
  'click .file.voice:not(.disabled)': function (argument) {

    if (!isRecording) {

      log.info('startRec');
      media = Smartix.helpers.getNewRecordFile();
      media.startRecord();
      isRecording = true;
      $(".icon.ion-ios-mic-outline").attr("class", "icon ion-stop");

      setTimeout(function () {
        if (isRecording)
          media.stopRecord();
      }, 1000 * 60 * 3);


    } else {
      log.info('stopRec');
      media.stopRecord();
      //  playAudio(media.src);
      isRecording = false;

      $(".icon.ion-stop").attr("class", "icon ion-ios-mic-outline");


      switch (window.device.platform) {
        case "Android":
          window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + media.src, onResolveSuccess, fail);
          break;
        case "iOS":
          window.resolveLocalFileSystemURL(cordova.file.tempDirectory + media.src, onResolveSuccess, fail);
          break;

      }

      showPreview('voice');
    }

  },
  'click .ion-close-circled.image': function (e) {
    var id = $(e.target).data('imgid');
    log.info(id);

    var array = imageArr.get();
    var index = array.indexOf(id);

    if (index > -1) {
      array.splice(index, 1);
    }

    imageArr.set(array);
    
    hidePreview("image");

    //TODO: clean up file if cancel by user

  },
  'click .ion-close-circled.voice': function (e) {

    var id = $(e.target).data('clipid');
    log.info(id);

    var array = soundArr.get();
    var index = array.indexOf(id);

    if (index > -1) {
      array.splice(index, 1);
    }

    soundArr.set(array);

    hidePreview('voice');
    
    //TODO: clean up file if cancel by user    
  },
  'click .imgThumbs': function (e) {
    var imageFullSizePath = $(e.target).data('fullsizeimage');
    IonModal.open('imageModal', {src: imageFullSizePath});
  },
  'change #imageBtn': function (event, template) {

    //https://github.com/CollectionFS/Meteor-CollectionFS
    //Image is inserted from here via FS.Utility
    Smartix.FileHandler.imageUpload(event,'class',imageArr.get(),
    function(result){
        
        imageArr.set(result);
    });

    showPreview("image");


    

  },
  'click .sendMsgBtn': function (event,template) {
    /*var target  = $(".js-example-basic-multiple").val();*/


    var target = Session.get('sendMessageSelectedClasses').selectArrId;
    log.info(target);
    var msg = $(".msgBox").val();
    
    
    //receive addons stage
    var mediaObj = {};
    mediaObj.allowComment = document.getElementById('allowComment').checked;
    mediaObj.allowVote = document.getElementById('allowVote').checked;  
    if(mediaObj.allowVote){
     mediaObj.voteType = document.querySelector('input[name="voteTypeOption"]:checked').value;   
    }else{
     mediaObj.voteType = "";
    }
    log.info("sendMsg:allowComment:"+mediaObj.allowComment);
    log.info("sendMsg:allowVote:"+mediaObj.allowComment);
    log.info("sendMsg:voteType:"+mediaObj.voteType);
           
    mediaObj.imageArr = imageArr.get();
    mediaObj.soundArr = soundArr.get();
    mediaObj.documentArr = documentArr.get();
    mediaObj.calendarEvent = template.calendarEvent.get();
    
    //receive addons stage ends
    
    //if nothing is received from input
    if(msg == "" && mediaObj.imageArr.length == 0 && mediaObj.soundArr.length
       == 0 && mediaObj.documentArr.length == 0 &&  mediaObj.calendarEvent == {}
      ){
      
      toastr.warning("please input some message");
      
    }
    
    addons = [];
    
    //add images to addons one by one if any
    if(mediaObj.imageArr.length > 0){
        console.log('there is image');
        mediaObj.imageArr.map(function(eachImage){
            addons.push({type:'images',fileId:eachImage});
        })
    }
 
    //add documents to addons one by one if any
    if(mediaObj.documentArr.length > 0){
        console.log('there is doc');
        mediaObj.documentArr.map(function(eachDocument){
            addons.push({type:'documents',fileId:eachDocument});
        })
    }
 
    //add voice to addons one by one if any
    if(mediaObj.soundArr.length > 0){
        console.log('there is voice');
        mediaObj.soundArr.map(function(eachDocument){
            addons.push({type:'voice',fileId:eachDocument});
        })
    }
    
    //add calendar to addons one by one if any
    if(mediaObj.calendarEvent.eventName && mediaObj.calendarEvent.eventName != ""){
        console.log('there is calendar');
        
        console.log(mediaObj.calendarEvent);
        addons.push(
            {
                type:'calendar',
                eventName: mediaObj.calendarEvent.eventName,
                location:  mediaObj.calendarEvent.location,
                startDate: mediaObj.calendarEvent.startDate + " " + mediaObj.calendarEvent.startDateTime ,
                endDate:   mediaObj.calendarEvent.endDate   +" " +  mediaObj.calendarEvent.endDateTime
            }
        );
        
    }
 
     //add comments to addons one by one if any
    if(mediaObj.allowComment){
        console.log('allowComment');
        
        //TBD
        addons.push({type:'comment'});
        
    }

     //add poll to addons one by one if any
    if(mediaObj.allowVote){
        
        var voteObj = {};
        voteObj.type = "poll";
        voteObj.votes = [];
        console.log('allowVote');
        
        log.info(mediaObj.voteType);
        
        if(mediaObj.voteType == 'heartNoEvilStarQuestion'){
            voteObj.votes.push({option:'heart',optionIconType:'icon-emojicon',optionIconValue:'e1a-hearts',users:[]});           
            voteObj.votes.push({option:'noevil',optionIconType:'icon-emojicon',optionIconValue:'e1a-see_no_evil',users:[]});              
            voteObj.votes.push({option:'question',optionIconType:'icon-ionicon',optionIconValue:'ion-help',users:[]}); 
            
            voteObj.options = ['heart','noevil','question'];  
                                                         
        }else if(mediaObj.voteType == 'yesNo'){
            voteObj.votes.push({option:'yes',optionIconType:'icon-emojicon',optionShowEvenNoVote:false,optionIconValue:'e1a-white_check_mark',users:[]});           
            voteObj.votes.push({option:'no',optionIconType:'icon-emojicon',optionShowEvenNoVote:false,optionIconValue:'e1a-negative_squared_cross_mark',users:[]});              
         
            voteObj.options = ['yes','no'];       
            
        }else if(mediaObj.voteType == 'likeDislike'){
            voteObj.votes.push({option:'heart',optionIconType:'icon-ionicon',optionIconValue:'ion-thumbsup',users:[]});           
            voteObj.votes.push({option:'noevil',optionIconType:'icon-ionicon',optionIconValue:'ion-thumbsdown',users:[]});
                        
            voteObj.options = ['like','dislike'];   
                  
        }else if(mediaObj.voteType == 'oneTwoThreeFour'){
            voteObj.votes.push({option:'one',optionIconType:'icon-emojicon',optionIconValue:'e1a-one',users:[]});           
            voteObj.votes.push({option:'two',optionIconType:'icon-emojicon',optionIconValue:'e1a-two',users:[]});
            voteObj.votes.push({option:'three',optionIconType:'icon-emojicon',optionIconValue:'e1a-three',users:[]});           
            voteObj.votes.push({option:'four',optionIconType:'icon-emojicon',optionIconValue:'e1a-four',users:[]});
                                    
            voteObj.options = ['one','two','three','four'];  
                  
        }else{
            //future extension point for futher customization.
            //VoteOptions will need to be defined by user.   
        }
        
                           
        addons.push(voteObj);
        
    } 
      
    GeneralMessageSender(target[0],'text',msg, addons,null,function(){
        
        console.log('callback@GeneralMessageSender');
        Session.set("sendMessageSelectedClasses", {
          selectArrName: [],
          selectArrId: []
        });
        
        //input parameters clean up
        imageArr.set([]);
        soundArr.set([]); 
        documentArr.set([]);       
        $(".msgBox").val("");
        template.calendarEvent.set({});
        hidePreview('all');

        sendBtnMediaButtonToggle(); 
        //force update autogrow
        document.getElementsByClassName("inputBox")[0].updateAutogrow(); 
        
        //scroll messagelist to bottom;
        window.setTimeout(scrollMessageListToBottom, 100);
      
           
    });

  },
  'keyup .inputBox':function(){
    log.info("input box keyup");
    sendBtnMediaButtonToggle();
  },
  'paste .inputBox':function(e){
    log.info("input box paste");
    
    //http://stackoverflow.com/questions/9857801/how-to-get-the-new-value-of-a-textarea-input-field-on-paste
    window.setTimeout(sendBtnMediaButtonToggle, 100);

  },  
  'click #documentBtn':function(e){
    if (Meteor.isCordova) {
      if (window.device.platform === "Android") {
        e.preventDefault();
        Smartix.FileHandler.documentUploadForAndroid(event,'class',documentArr.get(),function(result){ 
          if(result){
              documentArr.set([]);
              window.setTimeout(scrollMessageListToBottom, 100);
          
          }
        });  
      }
    }      
   
  },
  'change #documentBtn': function (event, template) {
      Smartix.FileHandler.documentUpload(event,'class',documentArr.get(),function(result){
          if(result){
              documentArr.set([]);
              window.setTimeout(scrollMessageListToBottom, 100);
          }
      });
  }  
});

/*****************************************************************************/
/* SendMessage: Helpers */
/*****************************************************************************/
Template.SendMessage.helpers({
  
  calendarEventSet:function(){ 
   // log.info(Template.instance().calendarEvent);
  
   if($.isEmptyObject(Template.instance().calendarEvent.get())){
     return false;
   }else{
     return true;
   }
  },
  messageBox: function () {
    return "";
  },
  addClassBtnStatus: function () {
    return Session.get("isSelecting") ? "hidden" : "";
  },
  doneClassBtnStatus: function () {
    return Session.get("isSelecting") ? "" : "hidden";
  },
  checkbox: function () {
    return Session.get("isSelecting") ? "" : "hidden";
  },
  isSelect: function (classCode) {
    return classCode == Router.current().params.classCode ? "selected" : "";
  },
  selectArr: function () {
    return [];
  },
  searchObj: function () {

    if (lodash.has(Router.current().params, 'classCode')) {
      if (!lodash.isUndefined(Router.current().params.classCode)) {
        log.info(Smartix.Groups.Collection.find({
            type: 'class',
          classCode: Router.current().params.classCode
        }).fetch());
        var getDefaultClass = Smartix.Groups.Collection.findOne({
            type: 'class',
          classCode: Router.current().params.classCode
        });
        log.info(getDefaultClass);
        var obj = {
          selectArrName: [getDefaultClass.className],
          selectArrId: [getDefaultClass._id]
        };

        Session.set("sendMessageSelectedClasses", obj);
      }
    }

    return Session.get('sendMessageSelectedClasses');


  },
  arrToString: function (arr) {
    if (arr.length < 1) {
      return "";
    } else {
      return lodash(arr).toString();
    }
  },
  uploadPic: function (argument) {      
    return imageArr.get();
  },
  uploadSound: function (argument) {
    return soundArr.get();
  },
  uploadDocument: function(argument){
    return documentArr.get();  
  },
  uploadDocuments: function(argument){
    return documentArr.get();  
  },  
  getImage: function () {
    var id = this.toString();
    return Images.findOne(id);
  },
  getSound: function () {
    var id = this.toString();
    return Sounds.findOne(id);
  },
  getDocument: function(){
    var id = this.toString();
    return Documents.findOne(id);      
  },
  isVotingTypeDisabled:function(){
      if(canVote.get() == true){         
          return "";
      }else{
          return "display:none;";
      }
  },
  isDisabled: function (type) {
    switch (type) {
      case 'camera':
        return imageArr.get().length > 0 || soundArr.get().length > 0 ? "disabled" : "";
      case 'voice':
        return imageArr.get().length > 0 || soundArr.get().length > 0 ? "disabled" : "";
      default:

    }
  },
  isHidden: function(){
    if(imageArr.get().length > 0 || soundArr.get().length > 0 || documentArr.get().length > 0){
      return "display:none;"
    }else{
      return "";
    }
  },
  isShown: function(){
    if(imageArr.get().length > 0 || soundArr.get().length > 0  || documentArr.get().length > 0 ){
      return "display:block !important;"
    }else{
      return "";
    }    
  },
  isPlaceHolder: function(){
    // we put the placeholder to guide user only for web version
    return Meteor.isCordova ? "" : TAPi18n.__("Type_Message_Here");
  },
  withExtraRightPadding:function(){
    if(!Meteor.isCordova){
      return "padding-right:40px;"
    }else{
      return "";
    }
  }
});

/*****************************************************************************/
/* SendMessage: Lifecycle Hooks */
/*****************************************************************************/
Template.SendMessage.created = function () {

    this.calendarEvent = new ReactiveVar({});
};

Template.SendMessage.rendered = function () {
  $(".msgBox").autogrow();
  //log.info(canVote.get());
  if(canVote.get()){
    var borrower = messageListHeightBorrower.get();
    if(lodash.findIndex(borrower,{type:"vote-options"}) == -1){
        borrower.push({type:"vote-options",height:20});
        messageListHeightBorrower.set(borrower);
        updateMessageListHeight();           
    }
  }
    
};

Template.SendMessage.destroyed = function () {
  imageArr.set([]);
  soundArr.set([]);
  isRecording = false;
  media = "";
  isPlayingSound = false;
  Session.set("sendMessageSelectedClasses", {
    selectArrName: [],
    selectArrId: []
  });
  canVote.set(true);
  messageListHeightBorrower.set([]);
};

//for the separated send message page
Template.ionNavBar.events({
  'click .sendMsgBtn': function () {
    /*var target  = $(".js-example-basic-multiple").val();*/


    var target = Session.get('sendMessageSelectedClasses').selectArrId;
    log.info(target);
    
    var msg = $(".msgBox").val();
    var mediaObj = {};
    mediaObj.imageArr = imageArr.get();
    mediaObj.soundArr = soundArr.get();

    log.info(target.length);
    
    if(msg == "" && mediaObj.imageArr.length == 0 && mediaObj.soundArr.length == 0){
      
      toastr.error("please input some message");
      
    }    
    else if (target.length > 0) {
      
      //loop through selected classes
      for (var count = 0; count < target.length; count++) {
        
        log.info("called" + count);
        var tempArray = [];
        tempArray.push(target[count]);
        Meteor.call('sendMsg', tempArray, msg, mediaObj, function () {
          Session.set("sendMessageSelectedClasses", {
            selectArrName: [],
            selectArrId: []
          });
          Router.go('TabClasses');
        });
      }

    } else {
      toastr.error("no class select!");
    }
  }
});



function onSuccess(imageURI) {
  // var image = document.getElementById('myImage');
  // image.src = "data:image/jpeg;base64," + imageData;

  log.info("onSuccess");
  // alert(imageData);
  window.resolveLocalFileSystemURL(imageURI,
    function (fileEntry) {
      // alert("got image file entry: " + fileEntry.fullPath);

      // log.info(fileEntry.)
      fileEntry.file(function (file) {
        // alert(file);
        log.info(file);


        Images.insert(file, function (err, fileObj) {
          if (err) {
            // handle error
            log.error(err);
          } else {

            // alert(fileObj._id);
            var arr = imageArr.get();
            arr.push(fileObj._id);
            

            
            imageArr.set(arr);

            if (Meteor.user().firstPicture) {
              analytics.track("First Picture", {
                date: new Date(),
              });

              Meteor.call("updateProfileByPath", 'firstPicture', false);
            }
            
            showPreview("image");
          }
        });


      });
    },
    function () {
      //error
      // alert("ada");
    }
  );

}

function onFail(message) {
  toastr.error('Failed because: ' + message);
}



var callback = function (buttonIndex) {
  
            
  setTimeout(function () {
    // like other Cordova plugins (prompt, confirm) the buttonIndex is 1-based (first button is index 1)
    //  alert('button index clicked: ' + buttonIndex);
    switch (buttonIndex) {
      case 1:
        navigator.camera.getPicture(onSuccess, onFail, {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          limit: 1
        });
        break;
      case 2:
        navigator.camera.getPicture(onSuccess, onFail, {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
          limit: 1
        });
        break;
      default:

    }

  });
};


function onResolveSuccess(fileEntry) {
  log.info('onResolveSuccess: ' + fileEntry.name);

  fileEntry.file(function (file) {

    var newFile = new FS.File(file);
    //newFile.attachData();
    //log.info(newFile);

    Sounds.insert(newFile, function (err, fileObj) {
      if (err) {
        //handle error
        log.error("insert error" + err);
      } else {
        //handle success depending what you need to do
        console.dir(fileObj);
        var fileURL = {
          "file": "/cfs/files/files/" + fileObj._id
        };
        log.info(fileURL.file);

        var arr = soundArr.get();
        arr.push(fileObj._id);
        soundArr.set(arr);
        media = "";

      }
    });
  });
}

function fail(error) {
  log.error('fail: ' + error.code);
}

function playAudio(url, callback) {
  // Play the audio file at url
  log.info("playAudio : " + url);
  var my_media = new Media(url,
    // success callback
    function () {
      log.info("playAudio():Audio Success");
      callback();
      log.info("calledback");
    },
    // error callback
    function (err) {
      log.error("playAudio():Audio Error: " + err);
    }
  );
  // Play audio
  my_media.play({numberOfLoops: 1});
}


function imageAction() {
  var options = {
    'buttonLabels': ['Take Photo From Camera', 'Select From Gallery'],
    'androidEnableCancelButton': true, // default false
    'winphoneEnableCancelButton': true, // default false
    'addCancelButtonWithLabel': 'Cancel'
  };
  window.plugins.actionsheet.show(options, callback);
}

function showPreview(filetype){
    log.info("show preview:filetype:"+filetype);
    
    $('.preview'+'.'+filetype).show();

    var borrower = messageListHeightBorrower.get();
    //increase the height of input box panel
    if(filetype && filetype == "image"){
     //borrow 95px from messageList
     borrower.push({type:filetype,height:95});          
    }else if(filetype && filetype == "document") {
     //borrow 38px from messageList
     borrower.push({type:filetype,height:38});     
     //$('.messageList').css({'height':'calc(100% - 151px )'})        
    }else if(filetype == "setting"){
     //borrow 20px from messageList
     borrower.push({type:filetype,height:20});          
    }
    else{ //filetype == voice
     //borrow 67px from messageList
     borrower.push({type:filetype,height:67});     
     //$('.messageList').css({'height':'calc(100% - 180px )'})        
    }
    messageListHeightBorrower.set(borrower);

    updateMessageListHeight();
      
    //http://stackoverflow.com/questions/10503606/scroll-to-bottom-of-div-on-page-load-jquery
    $('.messageList').scrollTop($('.messageList').prop("scrollHeight") );   
}
function hidePreview(filetype){
    log.info("hide preview:filetype:"+filetype);
    var borrower = messageListHeightBorrower.get();

    if(filetype == "all"){
        borrower = [];

        if(canVote.get()){
            borrower.push({type:"vote-options",height:20});         
        }        
        $('.preview').hide();    
    }else{
        lodash.remove(borrower,function(obj){
            if(obj.type == filetype){
              return true;
         }
        });
        $('.preview'+'.'+filetype).hide();       
    }
    messageListHeightBorrower.set(borrower);
   
    updateMessageListHeight();
    
    //http://stackoverflow.com/questions/10503606/scroll-to-bottom-of-div-on-page-load-jquery   
    $('.messageList').scrollTop($('.messageList').prop("scrollHeight") );   
}

function sendBtnMediaButtonToggle(){
  if ($('.inputBox').val().length > 0 || imageArr.get().length > 0 || soundArr.get().length > 0) {
    $('.mediaButtonGroup').fadeOut(50, function () {
      $('.sendMsgBtn').fadeIn(50, function () { });
    });
  } else {
    $('.sendMsgBtn').fadeOut(50, function () {
      $('.mediaButtonGroup').fadeIn(50, function () { });
    });

  }   
}

function scrollMessageListToBottom(){
   //scroll messagelist to bottom;
   var messageListDOM = document.getElementById("messageList");
   var messageListDOMToBottomScrollTopValue = messageListDOM.scrollHeight - messageListDOM.clientHeight;
   messageListDOM.scrollTop=messageListDOMToBottomScrollTopValue; 
   $('.messageList').scrollTop($('.messageList').prop("scrollHeight") );  
}

function updateMessageListHeight(){
    var totalExtraBorrow = 0;
    var totalBorrow;
    var calcValue;
        
    var borrower = messageListHeightBorrower.get();
    
    borrower.map(function(obj){
        totalExtraBorrow = totalExtraBorrow + obj.height;
    })
    totalBorrow = messageListBaseBorrow + totalExtraBorrow;
    calcValue = "calc(100% - "+totalBorrow+"px)";
    $('.messageList').css({'height':calcValue});   
     
}