
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
