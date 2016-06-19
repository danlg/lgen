/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

var isRecording = false;
var media = "";
var isPlayingSound = false;

/* ChatRoom: Event Handlers */
Template.ChatRoom.events({

	'click .sendBtn': function () {
		var text = $('.inputBox').val();
		if (!lodash.isEmpty(text)) {
			GeneralMessageSender(Router.current().params.chatRoomId, 'text', text, null, Smartix.helpers.getAllUserExceptCurrentUser(), function () {
				$('.inputBox').val("");
				sendBtnMediaButtonToggle();
				document.getElementsByClassName("inputBox")[0].updateAutogrow();
			});
		}//else we do not send
	},

	'click .imageIcon': function (argument) {
		// alert("asd");
	},
	
	'keyup .inputBox': function () {
		sendBtnMediaButtonToggle();
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
		Smartix.FileHandler.documentUpload(event,
			{
				'category': 'chat',
				'id': Router.current().params.chatRoomId,
				'school': UI._globalHelpers['getCurrentSchoolName']()
			}
		);
	},

	'click .imgThumbs': function (e) {
		var imageFullSizePath = $(e.target).data('fullsizeimage');
		IonModal.open('imageModal', {src: imageFullSizePath});
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
		log.info("setting sound metadata ", "school:", UI._globalHelpers['getCurrentSchoolName'](), "category:chat", "id:", chatRoomId);
		newFile.metadata = { 
			school: UI._globalHelpers['getCurrentSchoolName'](), 
			category: 'chat', 
			id: chatRoomId };
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
		$('.mediaButtonGroup').fadeOut(50, function () {
			$('.sendBtn').fadeIn(50, function () {
			});
		});
	}
	else {
		//
		$('.sendBtn').fadeOut(50, function () {
			$('.mediaButtonGroup').fadeIn(50, function () {
			});
		});
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

