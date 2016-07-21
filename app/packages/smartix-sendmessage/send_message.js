/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Session.setDefault("sendMessageSelectedClasses", {
	selectArrName: [],
	selectArrId: []
});
var imageArr = ReactiveVar([]);
var soundArr = ReactiveVar([]);
var stickerArr = ReactiveVar([]);
var documentArr = ReactiveVar([]);
var isRecording = false;
var media = "";
var isPlayingSound = false;
var messageListBaseBorrow;
var messageListHeightBorrower = ReactiveVar([]);
var canVote = ReactiveVar();

var showStickerButton = ReactiveVar(false);

Template.SendMessage.onCreated(function () {
	Session.set('chosenStickerForUser', null);
	this.calendarEvent = new ReactiveVar({});
	this.chatOrClassCode = new ReactiveVar();
	this.panelCategory = new ReactiveVar();
	//log.info("Template.SendMessage.onCreated");
	let schoolName = UI._globalHelpers['getCurrentSchoolName']();

	if (Router.current().params.classCode) {
		this.chatOrClassCode.set(Router.current().params.classCode);
		this.panelCategory.set('class');
		this.subscribe('createdClassByMe');
		canVote.set(true);
		messageListBaseBorrow = 70;
		log.info("Class Room Message Box Created", this.chatOrClassCode.get());
	}
	//log.info("schoolName", schoolName);
	else if (Router.current().params.chatRoomId){
		this.chatOrClassCode.set(Router.current().params.chatRoomId);
		this.panelCategory.set('chat');
		messageListBaseBorrow = 50;
		// this.subscribe('chatRoomWithUser', this.chatOrClassCode);
		log.info("Chat Room Message Box Created", this.chatOrClassCode.get());
	}
	this.subscribe('stickers');
	this.subscribe('images', schoolName, this.panelCategory.get(), this.chatOrClassCode.get());
	this.subscribe('documents', schoolName, this.panelCategory.get(), this.chatOrClassCode.get());
	this.subscribe('sounds', schoolName, this.panelCategory.get(), this.chatOrClassCode.get());
});

Template.SendMessage.destroyed = function () {
	this.calendarEvent.set({});
	Session.set('chosenStickerForUser', null);
	imageArr.set([]);
	soundArr.set([]);
	isRecording = false;
	media = "";
	isPlayingSound = false;
	Session.set("sendMessageSelectedClasses", {
		selectArrName: [],
		selectArrId: []
	});
	canVote.set(true);
	messageListHeightBorrower.set([]);
};

Template.SendMessage.onRendered(function () {
	Session.set('chosenStickerForUser', null);
	stickerArr.set([]);
	$(".msgBox").autogrow();
	//log.info(canVote.get());
	if (canVote.get()) {
		var borrower = messageListHeightBorrower.get();
		if (lodash.findIndex(borrower, { type: "vote-options" }) == -1) {
			borrower.push({ type: "vote-options", height: 20 });
			messageListHeightBorrower.set(borrower);
		}
	}
	updateMessageListHeight();
	//initial check of vote option.
	voteEnableCheck();
	canShowStickerButton();
});

/* SendMessage: Helpers */
Template.SendMessage.helpers({
	
	calendarEventSet: function () {
		// log.info("calendarEventSet");
		// log.info(Template.instance());
		// log.info(Template.instance().calendarEvent);
		var inner = Template.instance().calendarEvent.get();
		return (!($.isEmptyObject(inner)));
	},

	isClass: function()
	{
		return isClassPanel();
	},

	searchObj: function () {
		if (lodash.has(Router.current().params, 'classCode')) {
			if (!lodash.isUndefined(Router.current().params.classCode)) {
				var getDefaultClass = Smartix.Groups.Collection.findOne({
					type: 'class',
					classCode: Router.current().params.classCode
				});
				//log.info(getDefaultClass);
				var obj = {
					selectArrName: [getDefaultClass.className],
					selectArrId: [getDefaultClass._id]
				};
				Session.set("sendMessageSelectedClasses", obj);
			}
		}
		return Session.get('sendMessageSelectedClasses');
	},

	arrToString: function (arr) {
		if (arr.length < 1) {
			return "";
		}
		else {
			return lodash(arr).toString();
		}
	},

	uploadSticker: function()
	{
		if(Session.get('chosenStickerForUser'))
		{
			var stickerId = Session.get('chosenStickerForUser');
			if(stickerId){
				if (lodash.indexOf(stickerArr.get(), stickerId) === -1){
					showPreview('sticker');
					let tempArray = stickerArr.get();
					tempArray.push(stickerId);
					stickerArr.set(tempArray);
				}
				return stickerArr.get();
			}
		}
		return "";
	},

	uploadPic: function (argument) {
		return imageArr.get();
	},
	uploadSound: function (argument) {
		return soundArr.get();
	},
	uploadDocument: function (argument) {
		return documentArr.get();
	},
	uploadDocuments: function (argument) {
		return documentArr.get();
	},
	getImage: function () {
		var id = this.toString();
		return Images.findOne(id);
	},
	getSound: function () {
		var id = this.toString();
		return Sounds.findOne(id);
	},
	getDocument: function () {
		var id = this.toString();
		return Documents.findOne(id);
	},
	isVotingTypeDisabled: function () {
		if (canVote.get() === true) {
			return "";
		}
		else {
			return "display:none;";
		}
	},
	isDisabled: function (type) {
		switch (type) {
			case 'camera':
				return imageArr.get().length > 0 || soundArr.get().length > 0 ? "disabled" : "";
			case 'voice':
				return imageArr.get().length > 0 || soundArr.get().length > 0 ? "disabled" : "";
			default:

		}
	},
	isHidden: function () {
		if (imageArr.get().length > 0 || soundArr.get().length > 0 || documentArr.get().length > 0) {
			return "display:none;"
		}
		else {
			return "";
		}
	},
	isShown: function () {
		if (imageArr.get().length > 0 || soundArr.get().length > 0 || documentArr.get().length > 0) {
			return "display:block !important;"
		}
		else {
			return "";
		}
	},
	isPlaceHolder: function () {
		// we put the placeholder to guide user only for web version
		return Meteor.isCordova ? "" : TAPi18n.__("Type_Message_Here");
	},
	withExtraRightPadding: function () {
		if (!Meteor.isCordova) {
			return "padding-right:40px;"
		}
		else {
			return "";
		}
	}
});

/* SendMessage: Event Handlers */
Template.SendMessage.events({
	'click .showActionSheet': function (event, template) {
		
		// var userRolesInCurrentNamespace = Meteor.user().roles[UI._globalHelpers['getCurrentSchoolId']()];
        //student cannot create class

		let buttonsForActionSheet =[
			{ text: TAPi18n.__("AttachDocument") },
			{ text: TAPi18n.__("AttachEvent") }]
		

		// if(userRolesInCurrentNamespace.indexOf(Smartix.Accounts.School.TEACHER)!==-1 || hasTradableStickers)
		// {
		if(showStickerButton.get()){
			buttonsForActionSheet.push({ text: TAPi18n.__("smartix-stickers.AttachSticker")});
		}
		
		IonActionSheet.show({
			//titleText: 'What to attach?',
			buttons: buttonsForActionSheet,
			cancelText: 'Cancel',
			cancel: function () {
				//log.info('Cancelled!');
			},
			buttonClicked: function (index) {
				if (index === 0) {
					//log.info('Document');
					$('#documentBtn').click();
				}
				if (index === 1) {
					//log.info('Calendar');
					setCalendar(event, template);
				}
				if (index === 2)
				{
					showStickers(event, template);
				}
				return true;
			}
		});
	},

	'click .cancel-calendar': function (event, template) {
		template.calendarEvent.set({});
	},

	'click .set-calendar': setCalendar,
	'click #allowVote': function (event) {
		voteEnableCheck();
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
			Smartix.helpers.playAudio(soundUrl, function (argument) {
				log.info("finishPlay");
				$(e.target).attr('class', 'button button-icon icon ion-play playBtn');
				isPlayingSound = false;
			});
		}
	},

	'click .file.voice:not(.disabled)': function (argument) {
		if (!isRecording) {
			log.info('startRec');
			media = Smartix.helpers.getNewRecordFile();
			media.startRecord();
			isRecording = true;
			$(".icon.ion-ios-mic-outline").attr("class", "icon ion-stop");
			setTimeout(function () {
				if (isRecording)
					media.stopRecord();
			}, 1000 * 60 * 3);//max 3 min
		}
		else {
			log.info('stopRec');
			media.stopRecord();
			//  playAudio(media.src);
			isRecording = false;
			$(".icon.ion-stop").attr("class", "icon ion-ios-mic-outline");
			switch (window.device.platform) {
				case "Android":
					window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + media.src, onResolveSuccess, fail);
					break;
				case "iOS":
					window.resolveLocalFileSystemURL(cordova.file.tempDirectory + media.src, onResolveSuccess, fail);
					break;
			}
			showPreview('voice');
		}
	},

	'click .ion-close-circled.image': function (e) {
		var id = $(e.target).data('imgid');
		//log.info(id);
		var array = imageArr.get();
		var index = array.indexOf(id);
		if (index > -1) {
			array.splice(index, 1);
		}
		imageArr.set(array);
		hidePreview("image");
		//TODO: clean up file if cancel by user
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
		hidePreview('voice');
		//TODO: clean up file if cancel by user
	},

	'click .imgThumbs': function (e) {
		var imageFullSizePath = $(e.target).data('fullsizeimage');
		IonModal.open('imageModal', { src: imageFullSizePath });
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
		//https://github.com/CollectionFS/Meteor-CollectionFS
		//Image is inserted from here via FS.Utility'
		let panelId = template.chatOrClassCode.get();
		let panelCategory = template.panelCategory.get();
		Smartix.FileHandler.imageUpload(
			event,
			{ category: panelCategory, id: panelId, 'school': UI._globalHelpers['getCurrentSchoolName']() }
			, imageArr.get(),
			function (result) {
				imageArr.set(result);
			}
		);
		showPreview("image");
	},

	'click #documentBtn': function (event, template) {
		if (Meteor.isCordova) {
			if (window.device.platform === "Android") {
				event.preventDefault();
				let panelId = template.chatOrClassCode.get();
				let panelCategory = template.panelCategory.get();
				Smartix.FileHandler.documentUploadForAndroid(
					event,
					{ 'category': panelCategory, 'id': panelId, 'school': UI._globalHelpers['getCurrentSchoolName']() }
					, documentArr.get(), function (result) {
						documentArr.set(result);
					});
				showPreview("document");
			}
		}
	},

	'change #documentBtn': function (event, template) {
		let panelId = template.chatOrClassCode.get();
		let panelCategory = template.panelCategory.get();
		Smartix.FileHandler.documentUpload(event,
			{ 'category': panelCategory, 'id': panelId, 'school': UI._globalHelpers['getCurrentSchoolName']() }
			, documentArr.get(), function (result) {
				documentArr.set(result);
			});
		showPreview("document");
	},

	'click .sendMsgBtn': function (event, template) {
		if(Session.get('sendMessageSelectedClasses').selectArrId.length > 0)
		{
			var target = Session.get('sendMessageSelectedClasses').selectArrId;
		}
		else
		{
			var target = [Router.current().params.chatRoomId];
		}		
		//log.info(target);
		var msg = $(".msgBox").val();
		//receive addons stage
		var mediaObj = {};
		if (isClassPanel()) {
			mediaObj.allowComment = document.getElementById('allowComment').checked;
			mediaObj.allowVote = document.getElementById('allowVote').checked;
			mediaObj.voteType = (mediaObj.allowVote) ? document.querySelector('input[name="voteTypeOption"]:checked').value : "";
		} 
		mediaObj.stickerArr = stickerArr.get();
		mediaObj.imageArr = imageArr.get();
		mediaObj.soundArr = soundArr.get();
		mediaObj.documentArr = documentArr.get();
		mediaObj.calendarEvent = template.calendarEvent.get();
		// log.info(mediaObj);
		//log.info("sendMsg:allowComment:" + mediaObj.allowComment);
		//log.info("sendMsg:allowVote:" + mediaObj.allowComment);
		//log.info("sendMsg:voteType:" + mediaObj.voteType);
		//if nothing is received from input
		if (msg === "" && (mediaObj.imageArr.length == 0)
			&& (mediaObj.soundArr.length == 0)
			&& (mediaObj.documentArr.length == 0)
			&& (mediaObj.calendarEvent == {})
			&& (mediaObj.stickerArr == {})
		) {
			toastr.warning("please input some message");
		}
		var addons = [];
		populateAddons(addons, mediaObj);
		// log.info(target);
		// log.info(addons);
		GeneralMessageSender(target[0], 'text', msg, addons, null, function () {
			//log.info('callback@GeneralMessageSender');
			Session.set("sendMessageSelectedClasses", {
				selectArrName: [],
				selectArrId: []
			});
			//input parameters clean up
			imageArr.set([]);
			soundArr.set([]);
			if(stickerArr.get().length>0)
			{
				StickerAwardCollector(target[0], stickerArr.get());
				stickerArr.set([]);
				Session.set('chosenStickerForUser', null);
			}
			documentArr.set([]);
			$(".msgBox").val("");
			template.calendarEvent.set({});
			hidePreview('all');
			sendBtnMediaButtonToggle();
			//force update autogrow
			document.getElementsByClassName("inputBox")[0].updateAutogrow();
			//scroll messagelist to bottom;
			window.setTimeout(scrollMessageListToBottom, 100);
		});
	},

	'keyup .inputBox': function () {
		//log.info("input box keyup");
		sendBtnMediaButtonToggle();
	},

	'paste .inputBox': function (e) {
		//log.info("input box paste");
		//http://stackoverflow.com/questions/9857801/how-to-get-the-new-value-of-a-textarea-input-field-on-paste
		window.setTimeout(sendBtnMediaButtonToggle, 100);
	}
});


var canShowStickerButton = function(){
	var userRolesInCurrentNamespace = Meteor.user().roles[UI._globalHelpers['getCurrentSchoolId']()];
	if(userRolesInCurrentNamespace.indexOf(Smartix.Accounts.School.STUDENT)!==-1)
	{
		Meteor.call('smartix:stickers/hasTradableStickers', function(err,res)
		{
				return showStickerButton.set(true);
		});
	}	
	else if(userRolesInCurrentNamespace.indexOf(Smartix.Accounts.School.TEACHER) !== -1)
	{
		return showStickerButton.set(true);
	}
	return;
}

var showStickers = function(event, template){
	var stickerDataContext = {stickerChosen: "chosenStickerForUser"};
	IonModal.open('StickersTab', stickerDataContext);
}

var setCalendar = function (event, sendMsgtemplate) {
	IonPopup.show({
		title: TAPi18n.__("SetEvent"),
		templateName: 'CalendarEvent',
		buttons: [
			{
				text: TAPi18n.__("Cancel"),
				type: 'button-grey',
				onTap: function () {
					IonPopup.close();
				}
			},
			{
				text: TAPi18n.__("Confirm"),
				type: 'button-positive',
				onTap: function (event, template) {
					//log.info($(template.firstNode).find('#event-name').val());
					// $(template.firstNode).find('.hidden').click();
					if ($(template.firstNode).find('#event-name').get(0).checkValidity() &&
						$(template.firstNode).find('#location').get(0).checkValidity() &&
						$(template.firstNode).find('#start-date').get(0).checkValidity() &&
						$(template.firstNode).find('#start-date-time').get(0).checkValidity() &&
						$(template.firstNode).find('#end-date').get(0).checkValidity() &&
						$(template.firstNode).find('#end-date-time').get(0).checkValidity()) {
					}
					else {
						toastr.info(TAPi18n.__("FillEventDetail"));
						return;
					}
					//sendMsgtemplate.calendarEvent.set({
					Template.instance().calendarEvent.set({
						eventName: $(template.firstNode).find('#event-name').val(),
						location: $(template.firstNode).find('#location').val(),
						startDate: $(template.firstNode).find('#start-date').val(),
						startDateTime: $(template.firstNode).find('#start-date-time').val(),
						endDate: $(template.firstNode).find('#end-date').val(),
						endDateTime: $(template.firstNode).find('#end-date-time').val()
					});
					//log.info(sendMsgtemplate.calendarEvent.get());
					IonPopup.close();
				}
			}

		]
	});
};

function populateAddons(addons, mediaObj) {
	//add images to addons one by one if any
	if (mediaObj.imageArr.length > 0) {
		//log.info('there is image');
		mediaObj.imageArr.map(function (eachImage) {
			addons.push({ type: 'images', fileId: eachImage });
		})
	}

	if (mediaObj.stickerArr.length > 0) {
		//log.info('there is image');
		mediaObj.stickerArr.map(function (eachSticker) {
			addons.push({ type: 'stickers', fileId: eachSticker });
		})
	}
	//add documents to addons one by one if any
	if (mediaObj.documentArr.length > 0) {
		//log.info('there is doc');
		mediaObj.documentArr.map(function (eachDocument) {
			addons.push({ type: 'documents', fileId: eachDocument });
		})
	}

	//add voice to addons one by one if any
	if (mediaObj.soundArr.length > 0) {
		log.info('there is voice');
		mediaObj.soundArr.map(function (eachDocument) {
			addons.push({ type: 'voice', fileId: eachDocument });
		})
	}

	//add calendar to addons one by one if any
	if (mediaObj.calendarEvent.eventName && mediaObj.calendarEvent.eventName != "") {
		//log.info('there is calendar');
		//log.info(mediaObj.calendarEvent);
		addons.push(populateCalendar(mediaObj));
	}

	//add comments to addons one by one if any
	if (mediaObj.allowComment) {
		//log.info('allowComment');
		addons.push({ type: 'comment', comments: [] });
	}
	//add poll to addons one by one if any
	if (mediaObj.allowVote) {
		var voteObj = {};
		addons.push(populateVote(voteObj, mediaObj));
	}
}

function populateCalendar(mediaObj) {
	return {
		type: 'calendar',
		eventName: mediaObj.calendarEvent.eventName,
		location: mediaObj.calendarEvent.location,
		startDate: mediaObj.calendarEvent.startDate + " " + mediaObj.calendarEvent.startDateTime,
		endDate: mediaObj.calendarEvent.endDate + " " + mediaObj.calendarEvent.endDateTime
	};
}

function populateVote(voteObj, mediaObj) {
	voteObj.type = "poll";
	voteObj.votes = [];
	//log.info('allowVote');
	//log.info(mediaObj.voteType);
	if (mediaObj.voteType == 'heartNoEvilStarQuestion') {
		voteObj.votes.push({
			option: 'heart',
			optionIconType: 'icon-emojicon',
			optionIconValue: 'e1a-hearts',
			users: []
		});
		voteObj.votes.push({
			option: 'noevil',
			optionIconType: 'icon-emojicon',
			optionIconValue: 'e1a-see_no_evil',
			users: []
		});
		voteObj.votes.push({
			option: 'question',
			optionIconType: 'icon-ionicon',
			optionIconValue: 'ion-help',
			users: []
		});
		voteObj.options = ['heart', 'noevil', 'question'];
	}
	else if (mediaObj.voteType == 'yesNo') {
		voteObj.votes.push({
			option: 'yes',
			optionIconType: 'icon-emojicon',
			optionIconValue: 'e1a-white_check_mark',
			users: []
		});
		voteObj.votes.push({
			option: 'no',
			optionIconType: 'icon-emojicon',
			optionIconValue: 'e1a-negative_squared_cross_mark',
			users: []
		});
		voteObj.options = ['yes', 'no'];
	}
	else if (mediaObj.voteType == 'likeDislike') {
		voteObj.votes.push({
			option: 'heart',
			optionIconType: 'icon-ionicon',
			optionIconValue: 'ion-thumbsup',
			users: []
		});
		voteObj.votes.push({
			option: 'noevil',
			optionIconType: 'icon-ionicon',
			optionIconValue: 'ion-thumbsdown',
			users: []
		});
		voteObj.options = ['like', 'dislike'];
	}
	else if (mediaObj.voteType == 'oneTwoThreeFour') {
		voteObj.votes.push({ option: 'one', optionIconType: 'icon-emojicon', optionIconValue: 'e1a-one', users: [] });
		voteObj.votes.push({ option: 'two', optionIconType: 'icon-emojicon', optionIconValue: 'e1a-two', users: [] });
		voteObj.votes.push({ option: 'three', optionIconType: 'icon-emojicon', optionIconValue: 'e1a-three', users: [] });
		voteObj.votes.push({ option: 'four', optionIconType: 'icon-emojicon', optionIconValue: 'e1a-four', users: [] });
		voteObj.options = ['one', 'two', 'three', 'four'];
	}
	else {
		//future extension point for futher customization.
		//VoteOptions will need to be defined by user.
	}
	return voteObj;
}

//for the separated send message page
Template.ionNavBar.events({
	'click .sendMsgBtn': function () {
		/*var target  = $(".js-example-basic-multiple").val();*/
		var target = Session.get('sendMessageSelectedClasses').selectArrId;
		//log.info(target);
		var msg = $(".msgBox").val();
		var mediaObj = {};
		mediaObj.imageArr = imageArr.get();
		mediaObj.soundArr = soundArr.get();
		mediaObj.documentArr = documentArr.get();
		//log.info(target.length);
		if (msg == "" && mediaObj.imageArr.length == 0 && 
		mediaObj.soundArr.length == 0 && mediaObj.documentArr.length == 0) {
			toastr.error(TAPi18n.__("EnterMessageBeforeSend"));
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
		}
		else {
			toastr.error(TAPi18n.__("Admin.SelectClass"));
		}
	}
});

function onSuccess(imageURI) {
	// var image = document.getElementById('myImage');
	// image.src = "data:image/jpeg;base64," + imageData;
	//log.info("onSuccess");
	// alert(imageData);
	window.resolveLocalFileSystemURL(imageURI,
		function (fileEntry) {
			// alert("got image file entry: " + fileEntry.fullPath);
			// log.info(fileEntry.)
			fileEntry.file(function (file) {
				// alert(file);
				log.info("resolveLocalFileSystemURL", file);
				var newFile = new FS.File(file);
				let panelId = Template.instance().chatOrClassCode.get();
				let panelCategory = Template.instance().panelCategory.get();
				newFile.metadata = {
					school: UI._globalHelpers['getCurrentSchoolName'](),
					category: panelCategory,
					id: panelId
				};
				newFile.owner = Meteor.userId();

				Images.insert(file, function (err, fileObj) {
					if (err) {
						// handle error
						log.error(err);
					}
					else {
						// alert(fileObj._id);
						var arr = imageArr.get();
						arr.push(fileObj._id);
						imageArr.set(arr);
						if (Meteor.user().firstPicture) {
							analytics.track("First Picture", {
								date: new Date()
							});
							Meteor.call("updateProfileByPath", 'firstPicture', false);
						}
						showPreview("image");
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
	toastr.error(TAPi18n.__("FailedBecause") + message);
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

var isClassPanel = function()
{
	return Template.instance().panelCategory.get() === 'class' ? true : false;
};


function onResolveSuccess(fileEntry) {
	let panelId = Template.instance().chatOrClassCode.get();
	let panelCategory = Template.instance().panelCategory.get();
	log.info('onResolveSuccess: ' + fileEntry.name);
	fileEntry.file(function (file) {
		var newFile = new FS.File(file);
		//newFile.attachData();
		//log.info(newFile);

		log.info("Setting sound metadata ");
		newFile.metadata = {
			school: UI._globalHelpers['getCurrentSchoolName'](),
			category: panelCategory,
			id: panelId
		};
		Sounds.insert(newFile, function (err, fileObj) {
			if (err) {
				//handle error
				log.error("insert error", err);
			}
			else {
				//handle success depending what you need to do
				//console.dir(fileObj);
				// var fileURL = {	"file": "/cfs/files/files/" + fileObj._id };
				//log.info(fileURL.file);
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
	//log.info("playAudio : " + url);
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
	my_media.play({ numberOfLoops: 1 });
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

function showPreview(filetype) {
	log.info("show preview:filetype:" + filetype);
	$('.preview' + '.' + filetype).show();
	var borrower = messageListHeightBorrower.get();
	//increase the height of input box panel
	if (filetype && filetype == "image") {
		//borrow 95px from messageList
		borrower.push({ type: filetype, height: 95 });
	}
	else if (filetype && filetype == "sticker" ) {
		//borrow 95px from messageList
		borrower.push({ type: filetype, height: 95 });
	}
	else if (filetype && filetype == "document") {
		//borrow 38px from messageList
		borrower.push({ type: filetype, height: 38 });
		//$('.messageList').css({'height':'calc(100% - 151px )'})
	}
	else if (filetype == "setting") {
		//borrow 20px from messageList
		borrower.push({ type: filetype, height: 20 });
	}
	else { //filetype == voice
		//borrow 67px from messageList
		borrower.push({ type: filetype, height: 67 });
		//$('.messageList').css({'height':'calc(100% - 180px )'})
	}
	messageListHeightBorrower.set(borrower);
	updateMessageListHeight();
	//http://stackoverflow.com/questions/10503606/scroll-to-bottom-of-div-on-page-load-jquery
	$('.messageList').scrollTop($('.messageList').prop("scrollHeight"));
}

function hidePreview(filetype) {
	//log.info("hide preview:filetype:" + filetype);
	var borrower = messageListHeightBorrower.get();
	if (filetype == "all") {
		borrower = [];
		if (canVote.get()) {
			borrower.push({ type: "vote-options", height: 20 });
		}
		$('.preview').hide();
	}
	else {
		lodash.remove(borrower, function (obj) {
			if (obj.type == filetype) {
				return true;
			}
		});
		$('.preview' + '.' + filetype).hide();
	}
	messageListHeightBorrower.set(borrower);
	updateMessageListHeight();
	//http://stackoverflow.com/questions/10503606/scroll-to-bottom-of-div-on-page-load-jquery
	$('.messageList').scrollTop($('.messageList').prop("scrollHeight"));
}

function sendBtnMediaButtonToggle() {
	if ($('.inputBox').val().length > 0 || imageArr.get().length > 0 || stickerArr.get().length > 0 || soundArr.get().length > 0) {
		$('.mediaButtonGroup').fadeOut(50, function () {
			$('.sendMsgBtn').fadeIn(50, function () {
			});
		});
	}
	else {
		$('.sendMsgBtn').fadeOut(50, function () {
			$('.mediaButtonGroup').fadeIn(50, function () {
			});
		});
	}
}

function scrollMessageListToBottom() {
	//scroll messagelist to bottom;
	var messageListDOM = document.getElementById("messageList");
	var messageListDOMToBottomScrollTopValue = messageListDOM.scrollHeight - messageListDOM.clientHeight;
	messageListDOM.scrollTop = messageListDOMToBottomScrollTopValue;
	$('.messageList').scrollTop($('.messageList').prop("scrollHeight"));
}

function updateMessageListHeight() {
	var totalExtraBorrow = 0;
	var totalBorrow;
	var calcValue;
	var borrower = messageListHeightBorrower.get();
	borrower.map(function (obj) {
		totalExtraBorrow = totalExtraBorrow + obj.height;
	});
	totalBorrow = messageListBaseBorrow + totalExtraBorrow;
	calcValue = "calc(100% - " + totalBorrow + "px)";
	document.getElementById('messageList').style.height = calcValue ;
}

function voteEnableCheck() {
	if ($('input#allowVote:checked').length > 0) {
		canVote.set(true);
		if (lodash.findIndex(borrower, { type: "vote-options" }) == -1) {
			var borrower = messageListHeightBorrower.get();
			borrower.push({ type: "vote-options", height: 20 });
			messageListHeightBorrower.set(borrower);
			updateMessageListHeight();
		}
	}
	else {
		canVote.set(false);
		var borrower = messageListHeightBorrower.get();
		lodash.remove(borrower, function (obj) {
			if (obj.type == "vote-options") {
				return true;
			}
		});
		messageListHeightBorrower.set(borrower);
		updateMessageListHeight();
	}
}