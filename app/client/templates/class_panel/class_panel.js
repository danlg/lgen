var text = new ReactiveVar('');
var classObj;
var teacherName = ReactiveVar("");

var soundArr = ReactiveVar([]);
var isRecording = false;
var media = "";
var isPlayingSound = false;
var tempClassCode;
/*****************************************************************************/
/* ClassPanel: Event Handlers */
/*****************************************************************************/
Template.ClassPanel.events({
  'change .chooseType': function (evt) {
    var type = $(evt.target).val();
    var msgId = $(evt.target).data('mgsid');
    var classObj = Router.current().data().classObj;
    Meteor.call("updateMsgRating", type, msgId, classObj);
  },
  'keyup .search': function () {
    text.set($('.search').val());
    /*console.log(text.get());*/
  },
  'click .list.card': function () {
    Router.go('ClassPanelMsgNotice', {msgCode: this.msgId});
  },
  'click .sendBtn': function (event,template) {
    
    var selectedClassCodes = [];
    selectedClassCodes.push(template.currentClassCode.get());
    var target = selectedClassCodes;
    
    log.info(target);
    var msg = $(".inputBox").val();
    
    //todo: acquire image and sound arr from user input
    var mediaObj = {};
    mediaObj.imageArr = {};
    mediaObj.soundArr = {};

    if (target.length > 0) {
      Meteor.call('sendMsg', target, msg, mediaObj, function (error,result) {
        /*Session.set("sendMessageSelectedClasses", {
          selectArrName: [],
          selectArrId: []
        });
        Router.go('TabClasses');*/
        $(".inputBox").val('');
      });
    } else {
      alert("no class select!");
    }
  },
  'change #imageBtn': function (event, template) {
    FS.Utility.eachFile(event, function (file) {
      Images.insert(file, function (err, fileObj) {
        if (err) {
          // handle error
          console.log(err);
        }
        else {
          log.info("Image is inserted");
          
          var selectedClassCodes = [];
          selectedClassCodes.push(template.currentClassCode.get());
          var target = selectedClassCodes;
          
          log.info(target);
          var msg = $(".inputBox").val();
          
          //todo: acquire image and sound arr from user input
          var mediaObj = {};
          log.info(fileObj);         
          log.info(fileObj._id);
          
          mediaObj.imageArr = [] ;
          mediaObj.imageArr.push(fileObj._id) ;
          mediaObj.soundArr = soundArr.get();
      
          if (target.length > 0) {
            Meteor.call('sendMsg', target, msg, mediaObj, function (error,result) {
 
              $("#imageBtn").val('');
            });
          } else {
            alert("no class select!");
          }          
        }
      });
    });
  },
  'click .file.voice:not(.disabled)': function (event,template) {

    if (!isRecording) {
      alert("start recording!");
      console.log('startRec');
      media = getNewRecordFile();
      media.startRecord();
      isRecording = true;
      $(".icon.ion-mic-a").attr("class", "icon ion-stop");

      setTimeout(function () {
        if (isRecording)
          media.stopRecord();
      }, 1000 * 60 * 3);


    } else {
      alert("stop recording!");
      console.log('stopRec');
      media.stopRecord();
      //  playAudio(media.src);
      isRecording = false;

      $(".icon.ion-stop").attr("class", "icon ion-mic-a");


      switch (window.device.platform) {
        case "Android":
          window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + media.src, onResolveSuccess, fail);
          break;
        case "iOS":
          window.resolveLocalFileSystemURL(cordova.file.tempDirectory + media.src, onResolveSuccess, fail);
          break;

      }

    }

  } 
  
});

/*****************************************************************************/
/* ClassPanel: Helpers */
/*****************************************************************************/
Template.ClassPanel.helpers({
  classObj: function () {
    classObj = Classes.findOne();
    return classObj;
  },
  classCode: function () {
    return Classes.findOne().classCode;
  },
  isNotEmpty: function (action) {
    return action.length > 0;
  },
  createBy: function () {
    return classCode.createBy;
  },
  teacherName: function () {
    return teacherName.get();
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
  }
});

/*****************************************************************************/
/* ClassPanel: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassPanel.created = function () {
  


};

Template.ClassPanel.rendered = function () {
  Meteor.call('getFullNameById', classObj.createBy, function (err, data) {
    return teacherName.set(data);
  });
  
  this.currentClassCode = new ReactiveVar( classObj.classCode );
  tempClassCode = classObj.classCode;
  
  Meteor.call('getUserCreateClassesCount', function (err, count) {

    var createdClassCount = count;
    log.info(createdClassCount);
    var hasSeenTheTour = Session.get("hasSeenTheTourForStudent");
    log.info(" has user seen the tour? " + hasSeenTheTour);
    if (createdClassCount == 1 && hasSeenTheTour != true) {

      
      IonPopup.show({
        title: TAPi18n.__("Congratulations"),
        template: TAPi18n.__("InviteTeacherToLearnHowToAdd"),
        buttons: [
          {
            text: 'OK',
            type: 'button-positive',
            onTap: function () {
              IonPopup.close();
              Router.go('InviteUser');
            }
          },
          {
            text: 'Later',
            type: 'button-light',
            onTap: function () {
              IonPopup.close();
            }
          }
        ]
      });

    }

  });
  


};

Template.ClassPanel.destroyed = function () {
};


function playAudio(url, callback) {
  // Play the audio file at url
  // console.log(callback);
  var my_media = new Media(url,
    // success callback
    function () {
      console.log("playAudio():Audio Success");
      callback();
      console.log("calledback");
    },
    // error callback
    function (err) {
      console.log("playAudio():Audio Error: " + err);
    }
  );
  // Play audio
  my_media.play({numberOfLoops: 1});
}


function onResolveSuccess(fileEntry) {
 
  console.log('onResolveSuccess: ' + fileEntry.name);
  fileEntry.file(function (file) {
    var newFile = new FS.File(file);
 
    Sounds.insert(newFile, function (err, fileObj) {
      if (err) {
        //handle error
        console.log("insert error" + err);
      }
      else {
        //handle success depending what you need to do
        console.dir(fileObj);
        var fileURL = {
          "file": "/cfs/files/files/" + fileObj._id
        };
        console.log(fileURL.file);

        var arr = [];
        arr.push(fileObj._id);
        media = "";
        
        log.info("Sound is inserted");
        
        var selectedClassCodes = [];
        selectedClassCodes.push(tempClassCode);
        var target = selectedClassCodes;
        
        log.info(target);
        var msg = $(".inputBox").val();
        
        //todo: acquire image and sound arr from user input
        var mediaObj = {};
        
        mediaObj.imageArr = [] ;
        mediaObj.soundArr = arr;
    
        if (target.length > 0) {
          Meteor.call('sendMsg', target, msg, mediaObj, function (error,result) {

            $(".inputBox").val('');
            
          });
        } else {
          alert("no class select!");
        }   
      }
    }
      );
  });  
}

function fail(error) {
  console.log('fail: ' + error.code);
}