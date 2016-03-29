/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var text = new ReactiveVar('');
var classObj;
var currentClassCode;

var soundArr = ReactiveVar([]);
var isRecording = false;
var media = "";
var isPlayingSound = false;
var loadedItems = ReactiveVar(10);
var loadExtraItems = 5;
var localClassMessagesCollection = new Meteor.Collection(null);


/*****************************************************************************/
/* ClassPanel: Event Handlers */
/*****************************************************************************/
Template.ClassPanel.events({
  'change .chooseType': function (evt) {
    var type = $(evt.target).val();
    var msgId = $(evt.target).data('mgsid');
    var classObj = Classes.findOne({classCode: Router.current().params.classCode});
    Meteor.call("updateMsgRating", type, msgId, classObj);
  },
  'keyup .search': function () {
    text.set($('.search').val());
    log.info(text.get());
  },
  'click .list .card': function (e) {
    //Router.go('MessageExtraInfo', {msgCode: this.msgId});
    
    if(e.target.tagName == 'A' || e.target.tagName == "IMG" || e.target.tagName == "BUTTON"){
        //do nothing if user click on a link or an image or a button   
    }else{
    
        console.log(e);
        if($(e.currentTarget).children('.extraInfo').hasClass('expand')){
        $(e.currentTarget).children('.extraInfo').removeClass('expand');      
        }else{
         $(e.currentTarget).children('.extraInfo').addClass('expand');
         
         window.setTimeout(function(){
             
            document.getElementById("messageList").scrollTop = document.getElementById("messageList").scrollTop + $(e.currentTarget).offset().top - 115;
             
         },1000);

        }
    }
    
  },
  'click .imgThumbs': function (e) {
    var imageFullSizePath = $(e.target).data('fullsizeimage');
    IonModal.open('imageModal', {src: imageFullSizePath});
  },
  'click .playBtn': function (e) {
    if (!isPlayingSound) {
      isPlayingSound = true;
      var playname = $(e.target).data('clipid');
      //  $(e.target).attr('class','icon ion-stop');
      $(e.target).attr('class', 'button button-icon icon ion-stop ');

      // alert("startPlay");
      playAudio(Sounds.findOne(playname).url(), function (argument) {
        $(e.target).attr('class', 'button button-icon icon ion-play playBtn');
        isPlayingSound = false;
      });
    }
  },
  'click .messageList .item .content a': function (e) {
      Application.FileHandler.openFile(e);
      e.preventDefault();
  },
  'click .messageList .item .bubble a': function (e) {
      Application.FileHandler.openFile(e);
      e.preventDefault();
  },
  'click .commentShownToggle':function(e){
      var actionObj = $(e.target).data();
      var classObj = Classes.findOne({classCode: Router.current().params.classCode});
      if(actionObj.action == 'hide'){   
         log.info("hide comment id:" + actionObj.commentid + " "+ actionObj.msgid +" "+ classObj._id);
         Meteor.call('showHideComment',false,classObj._id,actionObj.msgid,actionObj.commentid)  ; 
      }else{      
         log.info("show comment id:" + actionObj.commentid+ " "+ actionObj.msgid+" "+ classObj._id);
         Meteor.call('showHideComment',true,classObj._id,actionObj.msgid,actionObj.commentid)  ; 
      }
  },
  'click .comment-counter':function(e){
      
        if($(e.currentTarget).parents( ".list .card" ).children('.extraInfo').hasClass('expand')){
        $(e.currentTarget).parents( ".list .card" ).children('.extraInfo').removeClass('expand');      
        }else{
            $(e.currentTarget).parents( ".list .card" ).children('.extraInfo').addClass('expand');
            
            window.setTimeout(function(){
                
            document.getElementById("messageList").scrollTop = document.getElementById("messageList").scrollTop + $(e.currentTarget).offset().top - 115;
                
            },1000);
            
        
        }      
  },
  'click .load-prev-msg':function(){
     loadedItems.set( loadedItems.get() + loadExtraItems );
  }
  
});

/*****************************************************************************/
/* ClassPanel: Helpers */
/*****************************************************************************/
Template.ClassPanel.helpers({
  classObj: function () {
    var classObj = Classes.findOne({classCode: Router.current().params.classCode});
    return classObj;
  },
  classCode: function () {
    return Router.current().params.classCode
  },
  isNotEmpty: function (action) {
    return action.length > 0;
  },
  createBy: function () {
    return classObj.createBy;
  },
  className: function () {
    return classObj.className;
  },
  havePic: function () {
    return this.imageArr.length > 0;
  },
  getImage: function () {
    var id = this.toString();
    return Images.findOne(id);
  },
  haveSound: function () {
    return this.soundArr.length > 0;
  },
  getSound: function () {
    var id = this.toString();
    return Sounds.findOne(id);
  },
  haveDocument: function () {
    return this.documentArr.length > 0;
  },
  getDocument: function () {
    var id = this.toString();
    return Documents.findOne(id);
  },
  isPlural: function (count) {
    return count > 1;
  },
  isZero: function (count) {
    return count === 0;
  },
  showByDefaultIfWithComments:function(){
      if(this.comment.comments.length){
          return "expand";
      }else{
          return "";
      }
  },
  getMessagesObj: function (inputClassObj) {
    //debugger;
    if(inputClassObj){
        
    }else{
        return;
    }
    
    var currentClassObj = inputClassObj;
    
    //log.info('getMessagesObj',classObj);
    if (currentClassObj.messagesObj.length > 0) { 
        
       //log.info('loadedItems',loadedItems.get());
       var rangeFrom = currentClassObj.messagesObj.length - loadedItems.get();
       var rangeTo   = currentClassObj.messagesObj.length;       
       var extraFilterMessages = lodash.filter(currentClassObj.messagesObj,function(num,currentIndex){
           if(currentIndex > rangeFrom && currentIndex < rangeTo){
               return true;
           }
       });       
       extraFilterMessage = lodash.sortBy(extraFilterMessages,['sendAt']);
     

       localClassMessagesCollection = new Meteor.Collection(null);
     
       
       for(var i = 0; i < extraFilterMessages.length; i++){
                var currentFilterMsg = extraFilterMessages[i];
                if(i == 0 || extraFilterMessages.length == 1){
                    currentFilterMsg.showTimestamp = true;
                }
                else if(extraFilterMessages.length > 1){
                   
                    var prevFilterMsg = extraFilterMessages[i-1];
                    
                    //log.info('currentFilterMsg',currentFilterMsg);
                    //log.info('nextFilterMsg',nextFilterMsg);           
                    var currentDate = moment.unix(currentFilterMsg.sendAt.substr(0,10)).format("YYYY-MM-DD");
                    var prevDate = moment.unix(prevFilterMsg.sendAt.substr(0,10)).format("YYYY-MM-DD");
                    
                    //log.info('currentDate',currentDate);
                    //log.info('nextDate',nextDate);
                    if(currentDate != prevDate){
                        currentFilterMsg.showTimestamp = true;
                    }else{
                        currentFilterMsg.showTimestamp = false;
                    }
                }else{
                     currentFilterMsg.showTimestamp = false;
                }
             
                localClassMessagesCollection.insert(currentFilterMsg);
                          
       }
       //log.info('extraFilterMessages',extraFilterMessages);
          
      //log.info('localClassMessagesCollection:count:',localClassMessagesCollection.find().count());

      return localClassMessagesCollection.find({},{sort:{"sendAt":1}});
    } else {
      return false;
    }
  },
  isLoadMoreButtonShow: function(){
     
      var currentClass= Classes.findOne({classCode: Router.current().params.classCode});
      if(currentClass){
        //log.info('reachTheEnd:loadedItems',loadedItems.get(),'classObjMessages',currentClass.messagesObj.length,'initialLoadItems',initialLoadItems.get());
        if(loadedItems.get() > currentClass.messagesObj.length ){
            return "hidden";
        }else{
            return "";
        }
      }
  }

});

/*****************************************************************************/
/* ClassPanel: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassPanel.onCreated = function () {
        
  //log.info('onCreatedBe',this.subscriptionsReady());

  //log.info('onCreatedAf',this.subscriptionsReady());

};

Template.ClassPanel.rendered = function () {
   
   log.info('rendered',this.subscriptionsReady());
    
   
    var template = this;
    //scroll to bottom
    this.autorun(function () {
        if (template.subscriptionsReady()) {
       
        
        Tracker.afterFlush(function () {
                
                 if(classObj){
                     currentClassCode = classObj.classCode;
                 }
                var imgReadyChecking = function(){
                    var hasAllImagesLoaded =true;

                    $('img').each(function(){
                        if(this.complete){
                            //log.info('loaded');
                        }else{
                            //log.info('not loaded');
                            hasAllImagesLoaded = false;
                        }
                    });
	                
                    if(hasAllImagesLoaded){
                        log.info('scroll to bottom');
                        //need to wrap the code inside autorun and subscriptionready
                        //see http://stackoverflow.com/questions/32291382/when-the-page-loads-scroll-down-not-so-simple-meteor-js
                        //scroll messagelist to bottom;


                        var messageListDOM = document.getElementById("messageList");
                        var messageListDOMToBottomScrollTopValue = messageListDOM.scrollHeight - messageListDOM.clientHeight;
                        messageListDOM.scrollTop=messageListDOMToBottomScrollTopValue; 
                        //$('#messageList').animate({scrollTop:messageListDOMToBottomScrollTopValue}, 300);
                    	
                    }else{
                        log.info('run next time');
                        //if not all images is fully loaded, scroll bottom would not work.
                        //so we set a timer to do the imgReadyChecking again later
                        setTimeout(imgReadyChecking, 1000);
                    }                                  
                };
                //run for the first time
            	imgReadyChecking();
               
        });
        }
    });
    
   // Session.set('hasFooter',false);
};

Template.ClassPanel.destroyed = function () {
  //  Session.set('hasFooter',true);
  loadedItems.set(10); 
  loadExtraItems = 5;
  Meteor.call('setAllClassCommentsAsRead',currentClassCode);
  localClassMessagesCollection = null;
};

