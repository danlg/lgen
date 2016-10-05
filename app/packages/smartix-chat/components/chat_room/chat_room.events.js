/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
import blobUtil from 'blob-util';


var isRecording = false;
var media = "";
var isPlayingSound = false;

Template.imageModal.events({
	// Here handling chat image long press - on long press showing popup for save/cancel the image to mobile gallery - Rajit Deligence
	//'contextmenu #dt-image-chat': function (e) {
	// not used yet to debug
	//cordova-base64-to-gallery@4.1.1
	'click #imageGallery': function(event, template){
		var img = document.getElementById('imageHolder');
		//log.info("Test", img);
		function getBase64ImageHolder(image) {
			var imgSrc = image.getAttribute('src');
			log.info("getBase64ImageHolder/imgSrc="+imgSrc);
			imgSrc = imgSrc.split('?')[0];
			//https://github.com/nolanlawson/blob-util#imgSrcToBlob API
			var saveImage = blobUtil.imgSrcToDataURL(imgSrc, 'image/png', { crossOrigin: 'Anonymous' }, 1.0).then(function (dataURL) {
				//log.info("Data URL", dataURL);
				var params = { data: dataURL, quality: 100 };
				window.imageSaver.saveBase64Image(params,
					function (result) {
						log.info('window.imageSaver.saveBase64Image.result OK' + result);
						toastr.info("Image saved successfully in photo album");
					},
					function (error) {
						log.error('window.imageSaver.saveBase64Image.error ' + error);
						toastr.error("Error saving image");
					}
				);			// log.info(schoolbannerSource, dataURL);
			}).catch(function (err) {
				log.error("cannot save image", err);
			});               //.replace(/^data:image\/(png|jpg);base64,/, "");
		}
		var getBase64 = getBase64ImageHolder(img);
	}
});

Template.ChatRoom.events({
	// Here handling chat image long press - on long press showing popup for save/cancel the image to mobile gallery - Rajit Deligence


// 	try to use this code to download image in background
// 	Make sure your url contains a image and it is valid url
// 	NSString *strImgURLAsString = @"imageURL";
// [strImgURLAsString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
// NSURL *imgURL = [NSURL URLWithString:strImgURLAsString];
// [NSURLConnection sendAsynchronousRequest:[NSURLRequest requestWithURL:imgURL] queue:[NSOperationQueue mainQueue] completionHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
// 	if (!connectionError) {
// 		UIImage *img = [[UIImage alloc] initWithData:data];
// 		// pass the img to your imageview
// 	}else{
// 		NSLog(@"%@",connectionError);
// 	}
// }];

	// 'click #dt-image-chat': function (e) {
    'contextmenu #dt-image-chat': function (e) {
		log.info("Clicked imageGallery dt-image-chat");
		if (Meteor.isCordova) {
			var img = e.target;
			var callback = function (buttonIndex) {
				setTimeout(function () {
					// like other Cordova plugins (prompt, confirm) the buttonIndex is 1-based (first button is index 1)
					//  alert('button index clicked: ' + buttonIndex);
					switch (buttonIndex) {
						case 1:
							//do nothing -- Cancel case
							break;
						case 2:
							function getBase64Image(img) {
								var canvas = document.createElement("canvas");
								canvas.width = img.width;
								canvas.height = img.height;
								img.setAttribute('crossOrigin', 'anonymous');
								if (!img.getAttribute('src')) {
									img.setAttribute('src', img.getAttribute('data-fullsizeimage'))
								}
								var ctx = canvas.getContext("2d");
								ctx.drawImage(img, 0, 0);
								var dataURL = canvas.toDataURL("image/png", 1.0);
								return dataURL;               //.replace(/^data:image\/(png|jpg);base64,/, "");
							}
							var base64 = getBase64Image(img);
							//https://github.com/agomezmoron/cordova-save-image-gallery/blob/master/README.md
							var params = {data: base64, quality: 100};
							window.imageSaver.saveBase64Image(params,
								function (result) {
									log.info('result ' + result);
									toastr.info("Image saved successfully");
								},
								function (error) {
									log.error('error ' + error);
								}
							);
							break;
					}
				});
			};
			navigator.notification.confirm('Are you sure, you want to save this image', callback, 'Confirm', ['Cancel', 'Save'])
		}
	},

	// TODO KEEP ME !
	'click .imgThumbs': function (e) {
		var imageFullSizePath = $(e.target).data('fullsizeimage');
		log.info("click .imgThumbs", imageFullSizePath);
		IonModal.open('imageModal', {src: imageFullSizePath});
	},

	'click .sendBtn': function () {
		var text = $('.inputBox').val();
		if (!lodash.isEmpty(text)) {
			GeneralMessageSender(
				Router.current().params.chatRoomId, 'text', text, null,
				Smartix.helpers.getAllUserExceptCurrentUser(),
				function () {
					$('.inputBox').val("");
					sendBtnMediaButtonToggle();
					document.getElementsByClassName("inputBox")[0].updateAutogrow();
				}
			);
		}//else we do not send
	},

	'click .imageIcon': function (argument) {
		log.info("imageIcon" + argument);
		console.log("imageIcon" + argument);
		//alert("imageIcon" + argument);
	},

	'keyup .inputBox': function () {
		sendBtnMediaButtonToggle();
		$(".inputBox").autogrow();
	},

	'change .inputBox': function () {
		//var height = $(".inputBoxList").height() + 2;
		//$(".chatroomList").css(height, "(100% - " + height + "px )");
		sendBtnMediaButtonToggle();
	},

	'paste .inputBox': function () {
		log.info("input box paste");

		//http://stackoverflow.com/questions/9857801/how-to-get-the-new-value-of-a-textarea-input-field-on-paste
		window.setTimeout(sendBtnMediaButtonToggle, 100);
	},

	'click #imageBtn': function (e) {
		if (Meteor.isCordova) {
			if (window.device.platform === "Android") {
				e.preventDefault();
				Smartix.FileHandler.imageUploadForAndroid(
					{
						category: 'chat',
						id: Router.current().params.chatRoomId,
						'school': UI._globalHelpers['getCurrentSchoolName']()
					}
				);
			}
		}
	},

	'change #imageBtn': function (event, template) {
		Smartix.FileHandler.imageUpload(
			event,
			{
				category: 'chat',
				id: Router.current().params.chatRoomId,
				'school': UI._globalHelpers['getCurrentSchoolName']()
			}
		);
	},

	'click #documentBtn': function (e) {
		if (Meteor.isCordova) {
			if (window.device.platform === "Android") {
				e.preventDefault();
				Smartix.FileHandler.documentUploadForAndroid(e,
					{
						'category': 'chat',
						'id': Router.current().params.chatRoomId,
						'school': UI._globalHelpers['getCurrentSchoolName']()
					}
				);
			}
		}
	},

	'change #documentBtn': function (event, template) {
		const metadata = {
			school: UI._globalHelpers['getCurrentSchoolName'](),
			category: 'chat',
			id: Router.current().params.chatRoomId
		};
		Smartix.FileHandler.documentUpload(event, metadata);
	},

	'click .voice': function (argument) {
		if (!isRecording) {
			//log.info('startRec');
			media = Smartix.helpers.getNewRecordFile();
			media.startRecord();
			isRecording = true;
			$(".ion-ios-mic-outline").attr("class", "icon ion-stop");
			setTimeout(function () {
				if (isRecording)
					media.stopRecord();
			}, 1000 * 60 * 3);//3 min max
		}
		else {
			//log.info('stopRec');
			media.stopRecord();
			//  playAudio(media.src);
			isRecording = false;
			$(".icon.ion-stop").attr("class", "ion-ios-mic-outline");
			//cordova.file is provided by cordova-plugin-file@4.2.0
			//TODO We should use cordova.file.dataDirectory instead as it is Read/Write for both Android and iOS
			// Persistent and private data storage within the application's sandbox using internal
			// memory (on Android, if you need to use external memory, use .externalDataDirectory).
			// On iOS, this directory is not synced with iCloud (use .syncedDataDirectory). (iOS, Android, BlackBerry 10, windows)
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
			Smartix.helpers.playAudio(Sounds.findOne(playname).url(), function (argument) {
				//  alert("callback!");
				$(e.target).attr('class', 'button button-icon icon ion-play playBtn');
				isPlayingSound = false;
			});
		}
		//  music.addEventListener('ended',function (argument) {
		//    $(e.target).attr('class','icon ion-play');
		//  },false);
	},
	'click .bubble a': function (e) {
		Smartix.FileHandler.openFile(e);
		e.preventDefault();
	},
	'click .load-prev-msg': function (event, template) {
		template.loadedItems.set(template.loadedItems.get() + template.loadExtraItems);
	}
});

// Record audio
// function onFileSystemSuccess(fileSystem) {
// 	log.info('onFileSystemSuccess: ' + fileSystem.name);
// }

function onResolveSuccess(fileEntry) {
	log.info('onResolveSuccess: ' + fileEntry.name);
	fileEntry.file(function (file) {
		var newFile = new FS.File(file);
		//newFile.attachData();
		//log.info(newFile);
		var chatRoomId = Router.current().params.chatRoomId;

		console.log("Setting sound metadata "+
			"school:" + UI._globalHelpers['getCurrentSchoolName']() +
			"category:'chat'" +
			"id:" + chatRoomId);
		log.info("Setting sound metadata ",
			"school:", UI._globalHelpers['getCurrentSchoolName'](),
			"category:chat",
			"id:", chatRoomId);
		newFile.metadata = {
			school: UI._globalHelpers['getCurrentSchoolName'](),
			category: 'chat',
			id: chatRoomId
		};
		Sounds.insert(newFile, function (err, fileObj) {
			if (err) {
				//handle error
				log.error("onResolveSuccess, Sounds.insert error", err);
			}
			else {
				//handle success depending what you need to do
				//console.dir(fileObj);
				// var fileURL = { 	"file": "/cfs/files/files/" + fileObj._id };
				//log.info(fileURL.file);
				var textDesc = "New voice message";
				textDesc = ( Meteor.user() && Meteor.user().profile )
					? ( textDesc + " from " + Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName )
					: textDesc;
				GeneralMessageSender(Router.current().params.chatRoomId, 'text', textDesc, [{
						type: 'voice',
						fileId: fileObj._id
					}],
					Smartix.helpers.getAllUserExceptCurrentUser()
				);
			}
		});
	});
}

function fail(error) {
	log.error('fail: ' + error.code);
}

function sendBtnMediaButtonToggle() {
	if ($('.inputBox').val().length > 0) {
		$('.mediaButtonGroup')[0].style.display = "none";
		$('.sendBtn')[0].style.display = "block";
	}
	else {
		$('.mediaButtonGroup')[0].style.display = "block";
		$('.sendBtn')[0].style.display = "none";
	}
}

////get another person's user object in 1 to 1 chatroom. call by chatroom helpers
// function getAnotherUser() {
// 	//find all userids in this chat rooms
// 	var arr = Smartix.Groups.Collection.findOne({_id: Router.current().params.chatRoomId}).chatIds;
//
// 	//find and remove the userid of the current user
// 	var currentUserIdIndex = arr.indexOf(Meteor.userId());
// 	arr.splice(currentUserIdIndex, 1);
//
// 	//return another user's user object
// 	var targetUserObj = Meteor.users.findOne(arr[0]);
// 	return targetUserObj;
// }

