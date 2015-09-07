var isRecording = false;
 media="";
/*****************************************************************************/
/* ChatRoom: Event Handlers */
/*****************************************************************************/
Template.ChatRoom.events({
  'click .sendBtn':function(){
    var text = $('.inputBox').val();
    template.atBottom=true;
    if(!lodash.isEmpty(text)){
      Meteor.call('chat/SendMessage',Router.current().params.chatRoomId,text,function(err,data){
        if(!err){

          var text = $('.inputBox').val();
          $('.inputBox').val("");

          var targetId =  Meteor.users.findOne({_id:{$nin:[Meteor.userId()]}})._id;
          var query = {};
          query.userId = targetId;

          var notificationObj={};
            notificationObj.from = getFullNameByProfileObj(Meteor.user().profile);
            notificationObj.title = getFullNameByProfileObj(Meteor.user().profile);
            notificationObj.text = text;
            // notificationObj.payload = {
            //   title: 'Hello World'
            // },
            notificationObj.query=query;


          Meteor.call("serverNotification", notificationObj, function(error, result){
            if(error){

            }
            if(result){

            }
          });


        }

      });
    }
  },
  'change .inputBox':function(){
    var height = $(".inputBoxList").height()+2;
    $(".chatroomList").css(height,"(100% - " + height +"px )");
  },
  'click .imageBtnTri':function (argument) {
    // $("#imageBtn").trigger('click');
    // testShareSheet();
  },
  'change #imageBtn': function(event, template) {
    // Meteor.call("chatSendImage",event,Router.current().params.chatRoomId,function (err) {
    //   err?alert(err.reason);:alert("success");
    // });



    FS.Utility.eachFile(event, function(file) {



      // Meteor.call("chatSendImage", file,Router.current().params.chatRoomId, function(error, result){
      //   if(error){
      //     console.log("error", error);
      //   }
      //   if(result){
      //
      //   }
      // });

      Images.insert(file, function(err, fileObj) {
        if (err) {
          // handle error
        } else {
          // handle success depending what you need to do
          // var userId = Meteor.userId();
          // var imagesURL = {
          //   'profile.image': '/cfs/files/images/' + fileObj._id
          // };
          // Meteor.users.update(userId, {
          //   $set: imagesURL
          // });

          var pushObj = {};
            pushObj.from = Meteor.userId();
            pushObj.sendAt = moment().format('x');
            pushObj.text = "";
            pushObj.image = fileObj._id;

          Meteor.call("chat/SendImage", Router.current().params.chatRoomId,pushObj, function(error, result){
            if(error){
              console.log("error", error);
            }
            if(result){

            }
          });


          // Chat.update({_id:Router.current().params.chatRoomId},{$push:{messagesObj:pushObj}});

        }
      });

    });




   },
   'click .imgThumbs':function (e) {
     var imageFullSizePath = $(e.target).data('fullsizeimage');
     IonModal.open('imageModal',{src:imageFullSizePath});
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
       playAudio(media.src);
       isRecording=false;

        Sounds.insert(media.src,function (err, fileObj) {
          if(err){
            alert(err);
          }else{
            alert('success');
          }
        });

     }

   }

});

/*****************************************************************************/
/* ChatRoom: Helpers */
/*****************************************************************************/
Template.ChatRoom.helpers({
  'chatRoomProfile':function(){
    return Chat.findOne({_id:Router.current().params.chatRoomId});
  },
  'isMind':function(){
    return this.from===Meteor.userId()?"mind":"notmind";
  },
  sendTime:function(sendAt){
    return moment(sendAt,"HH:mm");
  },
  userProfile:function(){
    var arr = Chat.findOne({_id:Router.current().params.chatRoomId}).chatIds;
    return lodash.reject(arr,{_id:Meteor.userId()})[0];
  },
  getName:function(profile){

    var userObj =  Meteor.users.findOne({_id:{$nin:[Meteor.userId()]}});

    return getFullNameByProfileObj(userObj.profile);
  },
  isText:function () {
    return this.text!=="";
  },
  isImage:function (chatObj) {
    return chatObj.image!=="";
  },
  getImage:function () {
    var ImageId = this.image.replace("/cfs/files/images/","");
    return Images.findOne(ImageId);
  },
  isWorkOff:function (argument) {
    var arr = Chat.findOne({_id:Router.current().params.chatRoomId}).chatIds;
    var targetUserObj = lodash.reject(arr,{_id:Meteor.userId()})[0];

  },
  targertWorkingTime:function (argument) {
    var target = Meteor.users.find({_id:{$ne:Meteor.userId()}});
    if(target.profile.role=="Teacher"){
      
    }
  }

});

/*****************************************************************************/
/* ChatRoom: Lifecycle Hooks */
/*****************************************************************************/
Template.ChatRoom.created = function () {
};

Template.ChatRoom.rendered = function () {




  $(".inputBox").autogrow();

   chatroomList  = this.find('.chatroomList');

  template = this;

  template.atBottom=true;

  /*$(".content").animate({ scrollTop: $('.content')[0].scrollHeight}, 0);*/
  /*if(Meteor.isCordova){
    window.addEventListener('native.keyboardshow', keyboardShowHandler);
  }*/
  var onscroll;



onscroll = _.throttle(function() {
  return template.atBottom = chatroomList.scrollTop >= chatroomList.scrollHeight - chatroomList.clientHeight;
}, 200);


  Meteor.setInterval(function(){
    if(template.atBottom){
      chatroomList.scrollTop = chatroomList.scrollHeight - chatroomList.clientHeight;
    }
  },100);


chatroomList.addEventListener('touchstart', function() {
  return template.atBottom = false;
});

chatroomList.addEventListener('touchend', function() {
  return onscroll();
});

chatroomList.addEventListener('scroll', function() {
  template.atBottom = false;
  return onscroll();
});

chatroomList.addEventListener('mousewheel', function() {
  template.atBottom = false;
  return onscroll();
});

chatroomList.addEventListener('wheel', function() {
  template.atBottom = false;
  return onscroll();
});




};

Template.ChatRoom.destroyed = function () {
};

/*function keyboardShowHandler(e){
  $(".content").animate({ scrollTop: $('.content')[0].scrollHeight}, 100);
    alert('Keyboard height is: ' + e.keyboardHeight);
}*/

function testShareSheet() {
    var options = {
        'androidTheme': window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT, // default is THEME_TRADITIONAL
        'title': 'How to get image',
        'buttonLabels': ['Gallery', 'Camera'],
        'androidEnableCancelButton' : true, // default false
        'winphoneEnableCancelButton' : true, // default false
        'addCancelButtonWithLabel': 'Cancel',
        // 'addDestructiveButtonWithLabel' : 'Delete it',
        'position': [20, 40] // for iPad pass in the [x, y] position of the popover
    };
    // Depending on the buttonIndex, you can now call shareViaFacebook or shareViaTwitter
    // of the SocialSharing plugin (https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin)
    window.plugins.actionsheet.show(options, callback);
}

  var callback = function(buttonIndex) {
   setTimeout(function() {
     // like other Cordova plugins (prompt, confirm) the buttonIndex is 1-based (first button is index 1)
    //  alert('button index clicked: ' + buttonIndex);


    if(buttonIndex==1){


      var options = {
        // max images to be selected, defaults to 15. If this is set to 1, upon
        // selection of a single image, the plugin will return it.
        maximumImagesCount: 1,

        // max width and height to allow the images to be.  Will keep aspect
        // ratio no matter what.  So if both are 800, the returned image
        // will be at most 800 pixels wide and 800 pixels tall.  If the width is
        // 800 and height 0 the image will be 800 pixels wide if the source
        // is at least that wide.
        // width: int,
        // height: int,

        // quality of resized image, defaults to 100
        // quality: int (0-100)
      };


      window.imagePicker.getPictures(
          function(results) {
              for (var i = 0; i < results.length; i++) {
                  console.log('Image URI: ' + results[i]);







                  // Meteor.call("insertImageTest", results[i], function(error, result){
                  //   if(error){
                  //     console.log("error", error);
                  //   }
                  //   if(result){
                  //
                  //   }
                  // });

                  // Images.insert(results[i], function (err, fileObj) {
                  //     if(err)console.log(err);
                  //     else{
                  //       console.log(fileObj);
                  //     }
                  // });

              }
          }, function (error) {
              console.log('Error: ' + error);
          },
      options);

    }else{

      MeteorCamera.getPicture(onSuccess)

      //
      // navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
      //     // destinationType: Camera.DestinationType.DATA_URL
      //       destinationType: window.Camera.DestinationType.FILE_URI,
      //       sourceType: window.Camera.PictureSourceType.PHOTOLIBRARY,
      //       mediaType: window.Camera.MediaType.ALLMEDIA
      // });
    }


   });
 };



function onSuccess(err,imageData) {
    // var image = document.getElementById('myImage');
    // image.src = "data:image/jpeg;base64," + imageData;

    alert(imageData);
    // window.resolveLocalFileSystemURI(fileURI,
    //     function( fileEntry){
    //         alert("got image file entry: " + fileEntry.fullPath);
    //     },
    //     function(){
    //       //error
    //     }
    // );

}

function onFail(message) {
    alert('Failed because: ' + message);
}

// Record audio


function getNewRecordFile() {

  var src = "documents://"+moment().format('x')+".wav";
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





playAudio = function (url) {
    // Play the audio file at url
    var my_media = new Media(url,
        // success callback
        function () { console.log("playAudio():Audio Success"); },
        // error callback
        function (err) { console.log("playAudio():Audio Error: " + err); }
    );

    // Play audio
    my_media.play();

    // Pause after 10 seconds
    setTimeout(function () {
        media.pause();
    }, 10000);
};
