/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var classObj;
//var classObjReactive = ReactiveVar({});
var teacherName = ReactiveVar("");
var teacherAvatar = ReactiveVar("");
var isRecording = false;
var media = "";
var isPlayingSound = false;
var isAtTop = ReactiveVar(true);
//var initialLoadItems = ReactiveVar(20);
var loadedItems = ReactiveVar(10);
var loadExtraItems = 5;
var localClassMessagesCollection = new Meteor.Collection(null);

/*****************************************************************************/
/* ClassDetail: Event Handlers */
/*****************************************************************************/
Template.ClassDetail.events({
  'click .tab-item': function (e) {
    var msgId = $(e.target.parentNode).data("msgid");
    var action = $(e.target.parentNode).data("action");
    
    if(msgId && action){
     
        
       // log.info("clickvotebtn:",classObj);
        Meteor.call('updateMsgRating', action, msgId, classObj, function (error,result) {
              
        });        
    }

  },
  'click .imgThumbs': function (e) {
    e.preventDefault();
    var imageFullSizePath = $(e.target).data('fullsizeimage');
    IonModal.open('imageModal', {
      src: imageFullSizePath
    });
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
  'click .content .item .content a': function (e) {
      Smartix.FileHandler.openFile(e);
      e.preventDefault();
  },
  'click .content .item .document a': function (e) {
      Smartix.FileHandler.openFile(e);
      e.preventDefault();
  },
  'click .add-comment-annoucement':function(e){
      //log.info(e);
      var text = $(e.target).parent().find('.add-comment-annoucement-textbox').val();
      var msgId = $(e.target).data().msgid;
      Meteor.call('addCommentToClassAnnoucement',msgId, {_id:classObj._id},text, function (argument) {
     
      });
      
  },
  'click .commentToggleBtn':function(e){
    toggleCommentSection(e);
  },
  'click .comment-counter':function(e){
    toggleCommentSection(e);
  },
  'click .load-prev-msg':function(){     
     loadedItems.set( loadedItems.get() + loadExtraItems );       
  }
});

/*****************************************************************************/
/* ClassDetail: Helpers */
/*****************************************************************************/
Template.ClassDetail.helpers({
  classObj: function () {
    var latestClassObj = Classes.findOne({classCode: Router.current().params.classCode});
    classObj = latestClassObj;
    //classObjReactive.set(Classes.findOne({classCode: Router.current().params.classCode}));
    return classObj;
  },
  className: function () {
    return classObj.className;
  },
  getClassName: function () {
    return Classes.findOne({classCode: Router.current().params.classCode}).className;
  },
  actions: function () {
    return ["star", "checked", "close", "help"];
  },
  isNotEmpty: function (action) {
    return action.length > 0;
  },
  createBy: function () {
    return classCode.createBy;
  },
  isSelectAction: function (action) {
    //return "";
    return lodash.includes(lodash.map(action, "_id"), Meteor.userId()) ? "colored" : "";
  },
  getMessagesObj: function () {
    //debugger;
    
    var currentClassObj = Classes.findOne({classCode: Router.current().params.classCode});
    
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
     
      if(!localClassMessagesCollection){
          localClassMessagesCollection = new Meteor.Collection(null);
      }
       
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
             
                if (localClassMessagesCollection.findOne({msgId:currentFilterMsg.msgId}) != null) {
                    localClassMessagesCollection.update({msgId:currentFilterMsg.msgId}, {
                    $set: currentFilterMsg
                    });
                } else {
                    localClassMessagesCollection.insert(currentFilterMsg);
                }                
       }
       //log.info('extraFilterMessages',extraFilterMessages);
          
      //log.info('localClassMessagesCollection:count:',localClassMessagesCollection.find().count());

      return localClassMessagesCollection.find({},{sort:{"sendAt":1}});
    } else {
      return false;
    }
  },
  teacherName: function () {
    return teacherName.get();
  },
  teacherAvatar: function(){
    return teacherAvatar.get();     
  },
  atTop:function(){
      if(isAtTop.get()){
          return true;
      }else{
          return false;
      }
  },
  isVoteOptionWithIcon:function(voteOptionIconString){
      if(voteOptionIconString){
          return true;
      }else{
          return false;
      }
  },
  getNameById: function (userId) {
    var userObj = Meteor.users.findOne(userId);
    return userObj._id == Meteor.userId() ? "You" : userObj.profile.firstname + " " + userObj.profile.lastname;
  },
  isLoadMoreButtonShow: function(){
      var currentClass= Classes.findOne({classCode: Router.current().params.classCode});
      
      //log.info('reachTheEnd:loadedItems',loadedItems.get(),'classObjMessages',currentClass.messagesObj.length,'initialLoadItems',initialLoadItems.get());
      if(loadedItems.get() > currentClass.messagesObj.length ){
          return "hidden";
      }else{
          return "";
      }
  }
});

/*****************************************************************************/
/* ClassDetail: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassDetail.created = function () {



};

Template.ClassDetail.rendered = function () {
    
  Meteor.call('getFullNameById', classObj.createBy, function (err, data) {
    return teacherName.set(data);
  });
  Meteor.call('getAvatarById', classObj.createBy, function (err, data) {
    //log.info(data);
    return teacherAvatar.set(data);
  });
  //greet first-time user
  if(Meteor.user().profile.firstclassjoined){
     IonPopup.alert({
      title: TAPi18n.__("Congratulations"),
      template: TAPi18n.__("JoinedFirstClass"),
      okText: TAPi18n.__("OKay")
    });
    //set the flag to false so it would not show again
    Meteor.users.update(Meteor.userId(), {$set: {"profile.firstclassjoined": false}}); 
  }
  
    $( ".class-detail" ).scroll(function() {
       if($('.class-detail').scrollTop() >75){
          isAtTop.set(false);
      }else{
          isAtTop.set(true);
      }    
    });

  var classDetailClass = document.getElementsByClassName("class-detail")[0];
  /****track if there are any new messages *********/
  var initialClassObj = Classes.findOne({classCode: Router.current().params.classCode});
  var initialCount = classObj.messagesObj.length;
  
  //http://stackoverflow.com/questions/32461639/how-to-execute-a-callback-after-an-each-is-done
  this.autorun(function(){
    var latestClassObj = Classes.findOne({classCode: Router.current().params.classCode});
   
    // we need to register a dependency on the number of documents returned by the
    // cursor to actually make this computation rerun everytime the count is altered
    var latestCount = latestClassObj.messagesObj.length;
    
    Tracker.afterFlush(function(){
        if(latestCount > initialCount){
            
            //scroll to bottom
            var classMessageListToBottomScrollTopValue = classDetailClass.scrollHeight - classDetailClass.clientHeight; 
            classDetailClass.scrollTop = classMessageListToBottomScrollTopValue; 
            
            initialCount = latestCount;
        }
    }.bind(this));
  }.bind(this));  
  /****track if there are any new messages - END *********/  
  
    var template = this;
    //scroll to bottom
    this.autorun(function () {
        if (template.subscriptionsReady()) {
        Tracker.afterFlush(function () {
            
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
                        //log.info('scroll to bottom');
                        //need to wrap the code inside autorun and subscriptionready
                        //see http://stackoverflow.com/questions/32291382/when-the-page-loads-scroll-down-not-so-simple-meteor-js
                        var classMessageListToBottomScrollTopValue = classDetailClass.scrollHeight - classDetailClass.clientHeight;            
                        //log.info(classMessageListToBottomScrollTopValue);
                    	classDetailClass.scrollTop = classMessageListToBottomScrollTopValue; 
                    	
                    }else{
                        //if not all images is fully loaded, scroll bottom would not work.
                        //so we set a timer to do the imgReadyChecking again later
                        setTimeout(imgReadyChecking, 1000);
                    }                                  
                };
                //run immediately for the first time
            	imgReadyChecking();
               
        });
        }
    });         
    
};

Template.ClassDetail.destroyed = function () {
    
 //initialLoadItems.set(20);
 loadedItems.set(10); 
 loadExtraItems = 5;    

 Meteor.call('setAllClassMessagesAsRead',classObj.classCode);
 localClassMessagesCollection = null;
};

function playAudio(url, callback) {
  // Play the audio file at url
     log.info(callback);
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
  my_media.play({
    numberOfLoops: 1
  });
}


function toggleCommentSection(e){
      var commentSection = $(e.target).parent().parent().find('section.commentSection');
      if(commentSection.hasClass('hidden')){
          commentSection.removeClass('hidden')
      }else{
          commentSection.addClass('hidden');
      }    
}

function showCommentSection(e){
      var commentSection = $(e.target).parent().parent().find('section.commentSection');
      if(commentSection.hasClass('hidden')){
          commentSection.removeClass('hidden')
      }
}