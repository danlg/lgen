/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/* icon chooser
* input parameters:
* sessionToBeSet: icon user choose would be set to this session.
* iconListToGet:  the icon list html string to be retrieved would be stored to this session
*/
var inputParameters;


Template.YouIconChoose.events({
	'click .emojicon': function(event){
		var clickedIconValue = $(event.target).attr('title');
		if(clickedIconValue){
            var avatarType="emoji";
			Session.set(inputParameters.sessionToBeSet,clickedIconValue);
			Session.set(inputParameters.avatarType,avatarType);
            log.info("session of "+ inputParameters.sessionToBeSet+ ": " + 
					 Session.get(inputParameters.sessionToBeSet) + "  " + 
					 Session.get(inputParameters.avatarType));		}
	},
    'click #imageBtn': function (e) {
        if (Meteor.isCordova) {
            var avatarType="image";
            Session.set(inputParameters.avatarType,avatarType);  
        if (window.device.platform === "Android") {
            e.preventDefault();
            imageUploadForAndroidAndIOS();
            // IonModal.close('YouIconChoose');      
        }
        }
    },
  'change #imageBtn': function (event, template) {
      event.preventDefault();
      var input = template.find('#imageBtn');
      var imageObj = input.files[0];
      var avatarType="image";
      Session.set(inputParameters.avatarType,avatarType);  
      imageUpload(event, imageObj);
      log.info("session of "+ inputParameters.sessionToBeSet+ ": " +
					 Session.get(inputParameters.avatarType));
  }   
});

Template.YouIconChoose.helpers({
	getYouIconList:function(){
		return Session.get(this.iconListToGet);
	}
});

Template.YouIconChoose.created = function () {
	inputParameters = Template.parentData(0);
	//TODO this should be the only thing being in child Object class
	//the rest should be in base class IconChoose
	//base class for YouIconChoose and ClassIconChoose
	//do not want any side effect with Session so duplicate code for now....
    
	$.getJSON('/packages/smartix_iconchooser/icon_list/profile_avatar.json',function(result){
		Session.set(inputParameters.iconListToGet, result);
	});	
};

Template.YouIconChoose.rendered = function () {


};

Template.YouIconChoose.destroyed = function () {
};

function imageUpload(event, imageObj) {
        var reader  = new FileReader();
        if(imageObj.type == "image/jpeg")
        {
                reader.onload = event;
                reader.readAsDataURL(imageObj);
                reader.onloadend = function () 
                {
                    var parentDataContext = {uploadedImage: reader, parentInputParameters: inputParameters};
                    IonModal.open("UploadIcon", parentDataContext);
                }
        }
};

function imageUploadForAndroidAndIOS(e) {
    var onSuccess = function (imageURI) {
                window.resolveLocalFileSystemURL(imageURI,
                    function (fileEntry) {
                        filenameofajax=fileEntry.name;
                        var efail = function(evt) {
                            console.log("File entry error  "+error.code);
                        };
                        var win=function(file) {
                            console.log(file);
                            var reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onloadend = function(evt) {
                                console.log("read success");
                                var parentDataContext = {uploadedImage: reader, parentInputParameters: inputParameters};
                                IonModal.open("UploadIcon", parentDataContext);
                            };
                        };
                        fileEntry.file(win, efail);
                    },
                    function () {
                        //error
                        // alert("ada");
                    }
                    );
        }

    var onFail = function (message) {
        toastr.error('Failed because: ' + message);
    }
    var callback = function (buttonIndex) {
        setTimeout(function () {
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
    var options = {
        'buttonLabels': ['Take Photo From Camera', 'Select From Gallery'],
        'androidEnableCancelButton': true, // default false
        'winphoneEnableCancelButton': true, // default false
        'addCancelButtonWithLabel': 'Cancel'
    };
    window.plugins.actionsheet.show(options, callback);
}