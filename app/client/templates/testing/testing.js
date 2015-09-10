var isRecording = false;
var media;
var duration;
/*****************************************************************************/
/* Testing: Event Handlers */
/*****************************************************************************/
Template.Testing.events({
  'click [data-action=showLoading]': function(event, template) {
    IonLoading.show({
      duration: 3000
    });
  },

  'click [data-action=showLoadingWithBackdrop]': function(event, template) {
    IonLoading.show({
      backdrop: false
    });

  },

  'click [data-action=showLoadingCustomTemplate]': function(event, template) {
    IonLoading.show({
      customTemplate: '<h3>Loading…</h3><p>Please wait while we upload your image.</p>',
      duration: 3000
    });
  },

  'click .stop': function() {
    IonLoading.hide();
  },
  'change .myFileInput': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      Images.insert(file, function(err, fileObj) {
        if (err) {
          // handle error
        } else {
          // handle success depending what you need to do
          var userId = Meteor.userId();
          var imagesURL = {
            'profile.image': '/cfs/files/images/' + fileObj._id
          };
          Meteor.users.update(userId, {
            $set: imagesURL
          });
        }
      });
    });
  },
  'change .myFileInputSound': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      Sounds.insert(file, function(err, fileObj) {
        if (err) {
          // handle error
        } else {
          // handle success depending what you need to do

          var userId = Meteor.userId();
          var imagesURL = {
            'profile.sound': '/cfs/files/sounds/' + fileObj._id
          };
          Meteor.users.update(userId, {
            $set: imagesURL
          });
        }
      });
    });
  },
  'change .soundTest':function (argument) {

  FS.Utility.eachFile(event, function(file) {



    Sounds.insert(file, function (err, fileObj) {
      if (err) {
        //handle error
        console.log("insert error" + err);
      } else {


        //handle success depending what you need to do
        console.dir(fileObj);
      }
    });


  });



  },
  'click .voice':function (argument) {
    if(!isRecording){
      console.log('startRec');
      media  = getNewRecordFile();
      media.startRecord();
      isRecording=true;
    }else{
      console.log('stopRec');
      media.stopRecord();
      // playAudio(media.src);
      isRecording=false;

      console.log(media.src);

      // console.log(cordova.file.applicationDirectory + media.src);
      // console.log(cordova.file.applicationStorageDirectory + media.src);
      // console.log(cordova.file.dataDirectory + media.src);
      // console.log(cordova.file.cacheDirectory + media.src);

      // console.log(cordova.file.externalApplicationStorageDirectory + media.src);
      // console.log(cordova.file.externalDataDirectory + media.src);
      // console.log(cordova.file.externalCacheDirectory + media.src);
      console.log(cordova.file.externalRootDirectory + media.src);

      // console.log(cordova.file.syncedDataDirectory + media.src);
      // console.log(cordova.file.documentsDirectory + media.src);
      // console.log(cordova.file.sharedDirectory + media.src);


      switch (window.device.platform) {
        case "Android":
          window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + media.src , onResolveSuccess, fail);
          break;
        case "iOS":
          window.resolveLocalFileSystemURL(cordova.file.tempDirectory + media.src , onResolveSuccess, fail);
          break;

      }

      // window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + media.src , onResolveSuccess, fail);
      // window.resolveLocalFileSystemURL(media.src , onResolveSuccess, fail);

      //  Sounds.insert(media.src,function (err, fileObj) {
      //    if(err){
      //      alert(err);
      //    }else{
      //      alert('success');
      //    }
      //  });
    }
  },
  'click .playBtn':function (e) {
    var playname=$(e.target).parent().data('clipname');
    var music = document.getElementById(playname);

    playAudio(this.url());



    // $(e.target).attr('class','icon ion-stop');
    // music.play();
    // music.addEventListener('ended',function (argument) {
    //   $(e.target).attr('class','icon ion-play');
    // },false);


  }

});

function myHandler(e) {



}


/*****************************************************************************/
/* Testing: Helpers */
/*****************************************************************************/
Template.Testing.helpers({
  src:function (argument) {
    return Meteor.user().profile.image;
  },
  mp3Src:function (argument) {
    return Meteor.user().profile.sound;
  },
  Soundssrc:function (argument) {
    return Sounds.find();
  }
});

/*****************************************************************************/
/* Testing: Lifecycle Hooks */
/*****************************************************************************/
Template.Testing.created = function() {};

Template.Testing.rendered = function() {

  /*IonPopup.show({
      title: 'A Popup',
      template: 'Here\'s a quick popup.',
      buttons: [{
        text: 'Close me',
        type: 'button-positive',
        onTap: function() {
          IonPopup.close();
        }
      }]
    });*/

};

Template.Testing.destroyed = function() {};


function getNewRecordFile() {

  var src;



        switch (window.device.platform) {
          case "Android":
            src = moment().format('x')+".aac";
            break;
          case "iOS":
            src = moment().format('x')+".wav";
            break;

        }


  mediaRec = new Media(src,
      // success callback
      function() {
          console.log("recordAudio():Audio Success");
      },

      // error callback
      function(err) {
          console.log("recordAudio():Audio Error: "+ err.code);
      }
  );

  return mediaRec;

}




    function onFileSystemSuccess(fileSystem) {
        console.log('onFileSystemSuccess: '+ fileSystem.name);
    }

    function onResolveSuccess(fileEntry) {

        media="";

        console.log('onResolveSuccess: ' + fileEntry.name);

        fileEntry.file(function(file) {

          var newFile = new FS.File(file);
          //newFile.attachData();
          //console.log(newFile);

          // newFile.attachData(file, {type:"audio/aac"});

          Sounds.insert(newFile, function (err, fileObj) {
            if (err) {
              //handle error
              console.log("insert error" + err);
            } else {
              //handle success depending what you need to do
              console.dir(fileObj);
              var fileURL = {
                "file": "/cfs/files/files/" + fileObj._id
              };
              console.log(fileURL.file);
            }
          });
        });
    }

    function fail(error) {
        console.log('fail: ' + error.code);
    }


    // function playAudio (url) {
    //     // Play the audio file at url
    //     var my_media = new Media(url,
    //         // success callback
    //         function () {
    //            console.log("playAudio():Audio Success");
    //           //  my_media.release;
    //           //  callback();
    //            console.log("calledback");
    //          },
    //         // error callback
    //         function (err) {
    //           console.log(err);
    //           console.log("playAudio():Audio Error: " + err);
    //          }
    //     );
    //
    //     // Play audio
    //     my_media.play({ numberOfLoops: 1 });
    //
    //
    // }

    // Record audio
    // recordAudio = function () {
    //     var src = "myrecording.mp3";
    //
    //
    //     switch (window.device.platform) {
    //       case "Android":
    //         src = moment().format('x')+".aac";
    //         break;
    //       case "iOS":
    //         src = moment().format('x')+".wav";
    //         break;
    //
    //     }
    //
    //
    //
    //     var mediaRec = new Media(src,
    //         // success callback
    //         function() {
    //             console.log("recordAudio():Audio Success");
    //         },
    //
    //         // error callback
    //         function(err) {
    //             console.log("recordAudio():Audio Error: "+ err.code);
    //         });
    //
    //     // Record audio
    //     mediaRec.startRecord();
    //
    //     // Stop recording after 10 seconds
    //     setTimeout(function() {
    //         mediaRec.stopRecord();
    //
    //
    //         switch (window.device.platform) {
    //           case "Android":
    //             window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + mediaRec.src , onResolveSuccess, fail);
    //             break;
    //           case "iOS":
    //             window.resolveLocalFileSystemURL(cordova.file.tempDirectory + mediaRec.src , onResolveSuccess, fail);
    //             break;
    //
    //         }
    //
    //
    //
    //     }, 2000);
    // };
