/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

var isRecording = false;
var media = "";
var isPlayingSound = false;
var recordTimer;
var needReduce = false;
/*****************************************************************************/
/* ChatRoom: Event Handlers */
/*****************************************************************************/
Template.ChatRoom.events({
  
  'click .sendBtn': function () {
    if (Meteor.user().profile.firstchat) {
      analytics.track("First Chat", {
        date: new Date(),
      });
      Meteor.call("updateProfileByPath", 'profile.firstchat', false);
    }
    var text = $('.inputBox').val();
    template.atBottom = true;
    if (!lodash.isEmpty(text)) {
      Meteor.call('chat/sendMessage', Router.current().params.chatRoomId, text, function (err, data) {
        if (!err) {
          var text = $('.inputBox').val();
          $('.inputBox').val("");
          

          var targetUser = getAnotherUser();        
          var targetId = targetUser._id;
          
          var query = {};
          sendBtnMediaButtonToggle();
          query.userId = targetId;
          var notificationObj = {};
          notificationObj.from = getFullNameByProfileObj(Meteor.user().profile);
          notificationObj.title = getFullNameByProfileObj(Meteor.user().profile);
          notificationObj.text = text;
          notificationObj.payload = {
            sound: 'Hello World',
            type: 'chat'
          };
          notificationObj.query = query;
          Meteor.call("serverNotification", notificationObj);
          document.getElementsByClassName("inputBox")[0].updateAutogrow();
          
          //send chat email
          Meteor.call("chatroomEmail",targetUser,Meteor.user(),text);
        }
      });
    }
  },
  'click .imageIcon': function (argument) {
    // alert("asd");
  
  },
  'keyup .inputBox':function(){
    sendBtnMediaButtonToggle();
  },
  'change .inputBox': function () {
    //var height = $(".inputBoxList").height() + 2;
    //$(".chatroomList").css(height, "(100% - " + height + "px )");
    sendBtnMediaButtonToggle(); 
  },

  'click #imageBtn': function (e) {
    if (Meteor.isCordova) {
      if (window.device.platform === "Android") {
        e.preventDefault();
        imageAction();
      }
    }
  },

  'change #imageBtn': function (event, template) {
    FS.Utility.eachFile(event, function (file) {
      Images.insert(file, function (err, fileObj) {
        if (err) {
          // handle error
          log.error(err);
        }
        else {
          var pushObj = {};
          pushObj.from = Meteor.userId();
          pushObj.sendAt = moment().format('x');
          pushObj.text = "";
          pushObj.image = fileObj._id;
          Meteor.call("chat/sendImage", Router.current().params.chatRoomId, pushObj, function (error, result) {
            if (error) {
              log.error("error", error);
            }
          });
          
          var targetUser = getAnotherUser();    
          var targetId = targetUser._id;
          var query = {};
          query.userId = targetId;

          var notificationObj = {};
          notificationObj.from = getFullNameByProfileObj(Meteor.user().profile);
          notificationObj.title = getFullNameByProfileObj(Meteor.user().profile);
          notificationObj.text = "Image";
          notificationObj.query = query;
          notificationObj.sound = 'default';
          notificationObj.payload = {
            sound: 'Hello World',
            type: 'chat'
          };
          Meteor.call("serverNotification", notificationObj);
          if (Meteor.user().profile.firstpicture) {
            analytics.track("First Picture", {
              date: new Date(),
            });
            Meteor.call("updateProfileByPath", 'profile.firstpicture', false);
          }
        }
      });
    });
  },

  'click .imgThumbs': function (e) {
    var imageFullSizePath = $(e.target).data('fullsizeimage');
    IonModal.open('imageModal', {src: imageFullSizePath});
  },

  'click .voice': function (argument) {
    if (!isRecording) {
      log.info('startRec');
      media = getNewRecordFile();
      media.startRecord();
      isRecording = true;
      $(".ion-ios-mic-outline").attr("class", "icon ion-stop");
      setTimeout(function () {
        if (isRecording)
          media.stopRecord();
      }, 1000 * 60 * 3);//3 min max
    }
    else {
      log.info('stopRec');
      media.stopRecord();
      //  playAudio(media.src);
      isRecording = false;
      $(".icon.ion-stop").attr("class", "ion-ios-mic-outline");
      switch (window.device.platform) {
        case "Android":
          window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + media.src, onResolveSuccess, fail);
          break;
        case "iOS":
          window.resolveLocalFileSystemURL(cordova.file.tempDirectory + media.src, onResolveSuccess, fail);
          break;
      }
      // Sounds.insert(media.src,function (err, fileObj) {
      //   if(err){
      //     alert(err);
      //   }else{
      //     alert('success');
      //   }
      // });
    }
  },

  'click .playBtn': function (e) {
    //check also https://github.com/SidneyS/cordova-plugin-nativeaudio#api
    //no record
    log.info(isPlayingSound);
    if (!isPlayingSound) {
      isPlayingSound = true;
      var playname = $(e.target).data('clipid');
      //  $(e.target).attr('class','icon ion-stop');
     
      $(e.target).attr('class', 'button button-icon icon ion-stop playBtn');
      // alert("startPlay");
      playAudio(Sounds.findOne(playname).url(), function (argument) {
        //  alert("callback!");
        $(e.target).attr('class', 'button button-icon icon ion-play playBtn');
        isPlayingSound = false;
      });
    }
    //  music.addEventListener('ended',function (argument) {
    //    $(e.target).attr('class','icon ion-play');
    //  },false);
  }
});

/*****************************************************************************/
/* ChatRoom: Helpers */
/*****************************************************************************/
Template.ChatRoom.helpers({
  chatRoomProfile: function () {
    return Chat.findOne({_id: Router.current().params.chatRoomId});
  },
  isCordova: function(){
    return Meteor.isCordova;
  },
  withExtraRightPadding:function(){
    if(!Meteor.isCordova){
      return "padding-right:40px;"
    }else{
      return "";
    }
  },  
  isMine: function () {
    return this.from === Meteor.userId() ? "mine" : "notmine";
  },

  userProfile: function () {
    //get another person's user object in 1 to 1 chatroom.     
    var userObj = getAnotherUser();
    return userObj
  },
  
  getName: function (profile) {    
    var userObj = getAnotherUser();
    return getFullNameByProfileObj(userObj.profile);
  },

  isText: function () {
    return this.text !== "";
  },

  isImage: function () {
    return this.image && this.image !== "";
  },

  isSound: function (argument) {
    return this.sound && this.sound !== "";
  },

  getImage: function () {
    var ImageId = this.image.replace("/cfs/files/images/", "");
    return Images.findOne(ImageId);
  },

  isWorkOff: function (argument) {
    
    //get another person's user object in 1 to 1 chatroom.     
    var targetUserObj = getAnotherUser();

  },

  targertWorkingTime: function (argument) {
    var displayOffline = false;
    var target = getAnotherUser();
    if (target.profile.role === "Teacher") {
      if (target.profile.chatSetting && target.profile.chatSetting.workHour) {
        
        
        var workHourTime = target.profile.chatSetting.workHourTime;
        var dayOfWeek = moment().day();
        var fromMoment = moment(workHourTime.from, "HH:mm");
        var toMoment = moment(workHourTime.to, "HH:mm");
        var range = moment.range(fromMoment, toMoment);

        //if today is not in work day
        if(!workHourTime.weeks[dayOfWeek-1]){
            displayOffline = true;
        }           
        //if currently not in work hour
        if (!range.contains(moment())) {
            displayOffline = true;
        }
     
      }
    }
    return displayOffline;
  },

  getSound: function (argument) {
    // var SoundId = this.image.replace("/cfs/files/sounds/","");
    return Sounds.findOne(this.sound);
  },

  soundsCollection: function (argument) {
    return Sounds.find();
  }

});

/*****************************************************************************/
/* ChatRoom: Lifecycle Hooks */
/*****************************************************************************/
Template.ChatRoom.created = function () {
};

Template.ChatRoom.rendered = function () {
  //$(".list.chatroomList").height("100%");
  //$(".list.chatroomList").height(($(".list.chatroomList").height() - 123) + "px");
  $(".inputBox").autogrow();
  chatroomList = this.find('.chatroomList');
  template = this;
  template.atBottom = true;
  var onscroll;
  onscroll = _.throttle(function () {
    return template.atBottom = chatroomList.scrollTop >= chatroomList.scrollHeight - chatroomList.clientHeight;
  }, 200);
  Meteor.setInterval(function () {
    if (template.atBottom) {
      chatroomList.scrollTop = chatroomList.scrollHeight - chatroomList.clientHeight;
    }
  }, 100);

  chatroomList.addEventListener('touchstart', function () {
    return template.atBottom = false;
  });

  chatroomList.addEventListener('touchend', function () {
    return onscroll();
  });

  chatroomList.addEventListener('scroll', function () {
    template.atBottom = false;
    return onscroll();
  });

  chatroomList.addEventListener('mousewheel', function () {
    template.atBottom = false;
    return onscroll();
  });

  chatroomList.addEventListener('wheel', function () {
    template.atBottom = false;
    return onscroll();
  });

  //open external url by system browser. If not using system browser via cordova inappbrowser plugin, user cannot go back to the chat screen
  //https://blog.nraboy.com/2014/12/open-dynamic-links-using-cordova-inappbrowser/
  document.onclick = function (e) {
      e = e ||  window.event;
      var element = e.target || e.srcElement;
  
      if (element.tagName == 'A') {
          window.open(element.href, "_system", "location=yes");
          return false;
      }
  };
  // if(needReduce){
  //   var height = $(".list.chatroomList").height();
  //   height= height - 60;
  //   log.info(height);
  //   $(".list.chatroomList").height(height+"px");
  //   needReduce = false;
  // }else{
  //   var height = $(".list.chatroomList").height();
  //   height= height + 60;
  //   log.info(height);
  //   $(".list.chatroomList").height(height+"px");
  // }
};

Template.ChatRoom.destroyed = function () {
};

function onSuccess(imageURI) {
  // var image = document.getElementById('myImage');
  // image.src = "data:image/jpeg;base64," + imageData;
  // alert(imageData);
  window.resolveLocalFileSystemURI(imageURI,
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
          }
          else {
            var pushObj = {};
            pushObj.from = Meteor.userId();
            pushObj.sendAt = moment().format('x');
            pushObj.text = "";
            pushObj.image = fileObj._id;

            Meteor.call("chat/sendImage", Router.current().params.chatRoomId, pushObj, function (error, result) {
              if (error) {
                log.error("error", error);
              }
            });
            
            //get another person's user object in 1 to 1 chatroom.             
            var targetUserObj = getAnotherUser();               
            var targetId = targetUserObj._id;
            var query = {};
            query.userId = targetId;
            var notificationObj = {};
            notificationObj.from = getFullNameByProfileObj(Meteor.user().profile);
            notificationObj.title = getFullNameByProfileObj(Meteor.user().profile);
            notificationObj.text = "Image";
            notificationObj.query = query;
            notificationObj.sound = 'default';
            notificationObj.payload = {
              sound: 'Hello World',
              type: 'chat'
            };
            Meteor.call("serverNotification", notificationObj);
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
// Record audio
function onFileSystemSuccess(fileSystem) {
  log.info('onFileSystemSuccess: ' + fileSystem.name);
}

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
      }
      else {
        //handle success depending what you need to do
        console.dir(fileObj);
        var fileURL = {
          "file": "/cfs/files/files/" + fileObj._id
        };
        log.info(fileURL.file);
        var pushObj = {};
        pushObj.from = Meteor.userId();
        pushObj.sendAt = moment().format('x');
        pushObj.text = "";
        pushObj.sound = fileObj._id;
        Meteor.call("chat/sendImage", Router.current().params.chatRoomId, pushObj, function (error, result) {
          if (error) {
            log.error("error", error);
          }
        });

        //get another person's user object in 1 to 1 chatroom. 
        var targetUserObj = getAnotherUser();         
        var targetId = targetUserObj._id;
        
        var query = {};
        query.userId = targetId;
        var notificationObj = {};
        notificationObj.from = getFullNameByProfileObj(Meteor.user().profile);
        notificationObj.title = getFullNameByProfileObj(Meteor.user().profile);
        notificationObj.text = "Sound";
        notificationObj.query = query;
        notificationObj.sound = 'default';
        notificationObj.payload = {
          sound: 'Hello World',
          type: 'chat'
        };
        // if(Meteor.user().profile.firstpicture){
        //   analytics.track("First Picture", {
        //     date: new Date(),
        //   });
        //   Meteor.call("updateProfileByPath", 'profile.firstpicture',false);
        // }
        Meteor.call("serverNotification", notificationObj);
      }
    });
  });
}

function fail(error) {
  log.error('fail: ' + error.code);
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
  

function sendBtnMediaButtonToggle(){
     if($('.inputBox').val().length>0){
        
        $('.mediaButtonGroup').fadeOut(50,function(){$('.sendBtn').fadeIn(50,function(){});});
        
    }else{
      //
        $('.sendBtn').fadeOut(50,function(){ $('.mediaButtonGroup').fadeIn(50,function(){});   });
          
    }   
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

////get another person's user object in 1 to 1 chatroom. call by chatroom helpers
function getAnotherUser(){
            //find all userids in this chat rooms
            var arr = Chat.findOne({_id: Router.current().params.chatRoomId}).chatIds;
            
            //find and remove the userid of the current user
            var currentUserIdIndex = arr.indexOf(Meteor.userId());
            arr.splice(currentUserIdIndex, 1);
            
            //return another user's user object
            var targetUserObj = Meteor.users.findOne(arr[0]);  
            return   targetUserObj;
}