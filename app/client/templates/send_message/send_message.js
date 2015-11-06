Session.setDefault("sendMessageSelectedClasses", {
  selectArrName: [],
  selectArrId: []
});
var imageArr = ReactiveVar([]);
var soundArr = ReactiveVar([]);
var isRecording = false;
var media = "";
var isPlayingSound = false;
/*var arr = [];*/
/*var selectArr = ReactiveVar("");
 var selecting = ReactiveVar(false);*/

/*****************************************************************************/
/* SendMessage: Event Handlers */
/*****************************************************************************/
Template.SendMessage.events({
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
      playAudio(soundUrl, function (argument) {
        log.info("finishPlay");
        $(e.target).attr('class', 'button button-icon icon ion-play playBtn');
        isPlayingSound = false;
      });
    }
  },
  'click .file.voice:not(.disabled)': function (argument) {

    if (!isRecording) {

      log.info('startRec');
      media = getNewRecordFile();
      media.startRecord();
      isRecording = true;
      $(".icon.ion-mic-a").attr("class", "icon ion-stop");

      setTimeout(function () {
        if (isRecording)
          media.stopRecord();
      }, 1000 * 60 * 3);


    } else {
      log.info('stopRec');
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

    // var i = imageArr.get().indexOf(id);
    // if(i != -1) {
    //   log.info(imageArr.get().splice(i, 1));
    //   imageArr.set(imageArr.get().splice(i, 1));
    // }

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

  },
  'click .imgThumbs': function (e) {
    var imageFullSizePath = $(e.target).data('fullsizeimage');
    IonModal.open('imageModal', {src: imageFullSizePath});
  },
  'change #imageBtn': function (event, template) {

    FS.Utility.eachFile(event, function (file) {

      Images.insert(file, function (err, fileObj) {
        if (err) {
          // handle error
          log.error(err);
        } else {

          // alert(fileObj._id);
          var arr = imageArr.get();
          arr.push(fileObj._id);
          imageArr.set(arr);


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
  'click .sendMsgBtn': function () {
    /*var target  = $(".js-example-basic-multiple").val();*/


    var target = Session.get('sendMessageSelectedClasses').selectArrId;
    log.info(target);
    var msg = $(".msgBox").val();
    var mediaObj = {};
    mediaObj.imageArr = imageArr.get();
    mediaObj.soundArr = soundArr.get();
     
    if(msg == "" && mediaObj.imageArr.length == 0 && mediaObj.soundArr.length == 0){
      
      alert("please input some message");
      
    }else if(target.length > 0) {
      Meteor.call('sendMsg', target, msg, mediaObj, function () {
        Session.set("sendMessageSelectedClasses", {
          selectArrName: [],
          selectArrId: []
        });
        
        //input parameters clean up
        $(".msgBox").val("");
        imageArr.set([]);
        soundArr.set([]);

      });
    } else {
      alert("no class select!");
    }
  }  
});

/*****************************************************************************/
/* SendMessage: Helpers */
/*****************************************************************************/
Template.SendMessage.helpers({
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
        log.info(Classes.find({
          classCode: Router.current().params.classCode
        }).fetch());
        var getDefaultClass = Classes.findOne({
          classCode: Router.current().params.classCode
        });
        log.info(getDefaultClass);
        var obj = {
          selectArrName: [getDefaultClass.className],
          selectArrId: [getDefaultClass.classCode]
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
    log.info(imageArr.get().length);
    log.info(imageArr.get());
    return imageArr.get();
  },
  uploadSound: function (argument) {
    return soundArr.get();
  },
  getImage: function () {
    var id = this.toString();
    return Images.findOne(id);
  },
  getSound: function () {
    var id = this.toString();
    return Sounds.findOne(id);
  },
  isDisabled: function (type) {
    switch (type) {
      case 'camera':
        return imageArr.get().length > 0 || soundArr.get().length > 0 ? "disabled" : "";
      case 'voice':
        return imageArr.get().length > 0 || soundArr.get().length > 0 ? "disabled" : "";
      default:

    }
  }
});

/*****************************************************************************/
/* SendMessage: Lifecycle Hooks */
/*****************************************************************************/
Template.SendMessage.created = function () {

};

Template.SendMessage.rendered = function () {
  $(".msgBox").autogrow();
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
};

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
      
      alert("please input some message");
      
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
      alert("no class select!");
    }
  }
});



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
          } else {

            // alert(fileObj._id);
            var arr = imageArr.get();
            arr.push(fileObj._id);
            imageArr.set(arr);

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
    function () {
      //error
      // alert("ada");
    }
  );

}

function onFail(message) {
  alert('Failed because: ' + message);
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
