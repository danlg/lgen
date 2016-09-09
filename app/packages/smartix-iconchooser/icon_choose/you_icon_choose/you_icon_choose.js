/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/* icon chooser
* input parameters:
* imageSmall: icon user choose would be set to this session.
* avatarType: emoji or image
* imageLarge: avatar 480x480
* iconListToGet:  the icon list html string to be retrieved would be stored to this session
*/
import MegaPixImage from './megapix-image.js';
import Cropper from 'cropperjs';

var inputParameters;
var img;

Template.YouIconChoose.onCreated(function () {
  this.uploadedImage = new ReactiveVar("");
  this.isPickEmoji = new ReactiveVar(true);
  inputParameters = Template.parentData(0);
  //TODO this should be the only thing being in child Object class
  //the rest should be in base class IconChoose
  //base class for YouIconChoose and ClassIconChoose
  //do not want any side effect with Session so duplicate code for now....
  $.getJSON('/packages/smartix_iconchooser/icon_list/profile_avatar.json', function (result) {
    Session.set(inputParameters.iconListToGet, result);
  });
});

Template.YouIconChoose.events({
  'click .emojicon': function (event) {
    var clickedIconValue = $(event.target).attr('title');
    if (clickedIconValue) {
      var avatarType = "emoji";
      Session.set(inputParameters.imageSmall, clickedIconValue);
      Session.set(inputParameters.avatarType, avatarType);
      log.info("session of " + inputParameters.imageSmall + ": " +
        Session.get(inputParameters.imageSmall) + "  " +
        Session.get(inputParameters.avatarType));
    }
  }
  , 'click #imageButton': function (event, template) {
      if (Meteor.isCordova) {
        if (window.device.platform === "Android") {
          event.preventDefault();
          imageUploadForAndroid(event, template);
        }
      }
  }
  , 'change #imageButton': function (event, template) {
      var files = event.target.files;
      if (files.length > 0) {
        var reader = new FileReader();
        template.isPickEmoji.set(false);
        reader.onload = function (readerEvent) {
          template.uploadedImage.set(readerEvent.target.result);
          var imgHolder = template.$('#imageCrop')[0];
          // log.info("uploadedImage", template.uploadedImage.get());
          imgHolder.src = template.uploadedImage.get();
          img = cropInit(imgHolder);
        };
        // read the image file as a data URL.
        reader.readAsDataURL(files[0]);
      }
  }
  , 'click #save': function (event, template) {
      event.preventDefault();
      var imageCropped = img.getCroppedCanvas().toDataURL()
      // var newData480 = imageResize(imageCropped, 480, 480)
      // log.info("img480 created");
      var newData120 = imageResize(imageCropped, 120, 120);
      log.info("img120 created");
      var avatarType = "image";
      //Save session variables. 
      Session.set(inputParameters.avatarType, avatarType);
      Session.set(inputParameters.imageSmall, newData120);
      // Session.set(inputParameters.imageLarge,newData480);
      // log.info(template.croppedImage.get());
  }
  , 'click #emojiBtn': function(event, template)
  {
    event.preventDefault();
    log.info("EmojiBtn Clicked");
    template.isPickEmoji.set(true);
  }
});

Template.YouIconChoose.helpers({
  isEmojiSelect: function () {
    return Template.instance().isPickEmoji.get();
  },

  getYouIconList: function () {
    return Session.get(this.iconListToGet);
  },

  isEmojiTabActive: function()
  {
    return Template.instance().isPickEmoji.get() ? 'activeTab' : '';
  },

  isImageTabActive: function()
  {
    return Template.instance().isPickEmoji.get() ? '' : 'activeTab';
  }

});


var imageUploadForAndroid = function (event, template) {
  var onSuccess = function (imageURI) {
    window.resolveLocalFileSystemURL(imageURI,
      function (fileEntry) {
        filenameofajax = fileEntry.name;
        var onErrorIn = function (evt) {
          log.error("imageUploadForAndroid.you_icon_choose, File entry error  " + error.code);
          console.log("imageUploadForAndroid.you_icon_choose, File entry error  " + error.code);
        };
        var onSuccessIn = function (file) {
          template.isPickEmoji.set(false);
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function (readerEvent) {
            console.log("imageUploadForAndroid.onSuccessIn.onload target=", readerEvent.target);
            //console.log(readerEvent.target.result);
            template.uploadedImage.set(readerEvent.target.result);
            var imgHolder = template.$('#imageCrop')[0];
            // log.info("uploadedImage", template.uploadedImage.get());
            imgHolder.src = template.uploadedImage.get();
            img = cropInit(imgHolder);
          };
        };
        fileEntry.file(onSuccessIn, onErrorIn);
      }
    );
  };

  var onFail = function (message) {
    toastr.error(TAPi18n.__("FailedBecause") + message);
  }
  var callback = function (buttonIndex) {
    setTimeout(function () {
      switch (buttonIndex) {
        case 1:
          navigator.camera.getPicture(onSuccess, onFail, { allowEdit: true, correctOrientation: true,
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            limit: 1
          });
          break;
        case 2:
          navigator.camera.getPicture(onSuccess, onFail, { allowEdit: true, correctOrientation: true,
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

  //var callback = androidCameraCallback;

  var options = {
    'buttonLabels': ['Take Photo From Camera', 'Select From Gallery'],
    'androidEnableCancelButton': true, // default false
    'winphoneEnableCancelButton': true, // default false
    'addCancelButtonWithLabel': 'Cancel'
  };
  window.plugins.actionsheet.show(options, callback);
};

var cropInit = function (image) {
  var cropper = new Cropper(image, {
    aspectRatio: 1 / 1,
    viewMode: 1,
    dragMode: 'move',
    restore: false,
    autoCropArea: 0.65,
    modal: false,
    center: false,
    guides: false,
    highlight: false,
    cropBoxMovable: false,
    cropBoxResizable: false
  });
  return cropper;
}

var imageResize = function (img, width_x, height_y) {
  var canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');
  // set its dimension to target size
  canvas.width = width_x;
  canvas.height = height_y;
  // create an off-screen canvas
  if (Meteor.isCordova) {
    if (window.device.platform === "iOS") {
      var imgHolder = document.getElementById('imageCrop');
      var mpImg = new MegaPixImage(img);
      mpImg.render(imgHolder, { width: width_x, height: height_y, quality: 0.5 });
      img = imgHolder.src;
    }
  }
  var image = new Image();
  image.src = img;
  // draw source image into the off-screen canvas:
  ctx.drawImage(image, 0, 0, width_x, height_y);
  // encode image to data-uri with base64 version of compressed image
  return canvas.toDataURL();
}