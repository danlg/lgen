/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var classObj;
//var classObjReactive = ReactiveVar({});
var teacherName = ReactiveVar("");
var teacherAvatar = ReactiveVar("");
var teacherAvatarType = ReactiveVar("");

var isRecording = false;
var media = "";
var isPlayingSound = false;
var isAtTop = ReactiveVar(true);
//var initialLoadItems = ReactiveVar(20);
var loadedItems = ReactiveVar(10);
var loadExtraItems = 5;
var localClassMessagesCollection = new Meteor.Collection(null);

/* ClassDetail: Lifecycle Hooks */
Template.ClassDetail.onCreated(function () {
	//log.info(Router.current().params.classCode);
	var classcode = Router.current().params.classCode;
	var classObj = Smartix.Groups.Collection.findOne({
		type: 'class',
		classCode: classcode
	});
	var self = this;
	this.autorun(function () {
		self.subscribe('smartix:messages/groupMessages', classObj._id);
		self.subscribe('images', UI._globalHelpers['getCurrentSchoolName'](), 'class', classcode);
		self.subscribe('documents', UI._globalHelpers['getCurrentSchoolName'](), 'class', classcode);
		self.subscribe('sounds', UI._globalHelpers['getCurrentSchoolName'](), 'class', classcode);
	});
});

Template.ClassDetail.destroyed = function () {
	//initialLoadItems.set(20);
	loadedItems.set(10);
	loadExtraItems = 5;
	Meteor.call('setAllClassMessagesAsRead', classObj.classCode);
	localClassMessagesCollection = null;
};

/* ClassDetail: Event Handlers */
Template.ClassDetail.events({
	'click .tab-item': function (e) {
		var msgId = $(e.target.parentNode).data("msgid");
		var action = $(e.target.parentNode).data("action");
		if (msgId && action) {
			// log.info("clickvotebtn:",classObj);
			Meteor.call('smartix:messages-addons-poll/castVote', msgId, action, function (error, result) {
			});
		}
	},
	'click .imgThumbs': function (e) {
		e.preventDefault();
		var imageFullSizePath = $(e.target).data('fullsizeimage');
		IonModal.open('imageModal', {
			src: imageFullSizePath
		});
	},
	'click .playBtn': function (e) {
		if (!isPlayingSound) {
			isPlayingSound = true;
			var playname = $(e.target).data('clipid');
			//  $(e.target).attr('class','icon ion-stop');
			$(e.target).attr('class', 'button button-icon icon ion-stop ');

			// alert("startPlay");
			Smartix.helpers.playAudio(Sounds.findOne(playname).url(), function (argument) {
				$(e.target).attr('class', 'button button-icon icon ion-play playBtn');
				isPlayingSound = false;
			});
		}
	},
	'click .content .item .content a': function (e) {
		Smartix.FileHandler.openFile(e);
		e.preventDefault();
	},
	'click .content .item .document a': function (e) {
		Smartix.FileHandler.openFile(e);
		e.preventDefault();
	},
	'click .add-comment-annoucement': function (e) {
		//log.info(e);
		var text = $(e.target).parent().find('.add-comment-annoucement-textbox').val();
		var msgId = $(e.target).data().msgid;
		Meteor.call('smartix:messages-addons-comment/addNewComment', msgId, text);

	},
	'click .commentToggleBtn': function (e) {
		toggleCommentSection(e);
	},
	'click .comment-counter': function (e) {
		toggleCommentSection(e);
	},
	'click .load-prev-msg': function () {
		loadedItems.set(loadedItems.get() + loadExtraItems);
	},
	'click .add-to-calendar': function (event) {
		var startDate = this.startDate;
		var endDate = this.endDate;
		var eventName = this.eventName;
		var location = this.location;
		var description = $(event.target).data('description');

		Smartix.Messages.Addons.Calendar.addEvent(eventName, location, description, startDate, endDate, function () {
			toastr.info('Event added to your calendar');
		});
	}
});

/*****************************************************************************/
/* ClassDetail: Helpers */
/*****************************************************************************/
Template.ClassDetail.helpers({
	classObj: function () {
		var latestClassObj = Smartix.Groups.Collection.findOne({
			type: 'class',
			classCode: Router.current().params.classCode
		});
		classObj = latestClassObj;
		return classObj;
	},
	className: function () {
		return classObj.className;
	},
	getClassName: function () {
		return Smartix.Groups.Collection.findOne({classCode: Router.current().params.classCode}).className;
	},
	actions: function () {
		return ["star", "checked", "close", "help"];
	},
	isNotEmpty: function (action) {
		return action.length > 0;
	},
	isSelectAction: function (action) {
		//return "";
		return lodash.includes(lodash.map(action, "_id"), Meteor.userId()) ? "colored" : "";
	},

	getMessagesObj: function () {
		//debugger;
		var currentClassObj = Smartix.Groups.Collection.findOne({
			type: 'class',
			classCode: Router.current().params.classCode
		});
		var msgCount = Smartix.Messages.Collection.find({
			group: currentClassObj._id
		}).count();
		var skipMsg = msgCount - loadedItems.get();
		//skip amount cannot be a negative value
		if (skipMsg < 0) {
			skipMsg = 0;
		}
		var limitMsg = loadedItems.get();
		//store the latest timestamp of msg we are processing. msg are processsging in time in ascending order. Earlier msg is processed first.
		var latestDayInMessages = "";
		var classMessages = Smartix.Messages.Collection.find({
			group: currentClassObj._id
		}, {
			sort: {"createdAt": 1},
			skip: skipMsg,
			limit: limitMsg,
			transform: function (eachMessage) {
				//if it is first msg, need to show the date timestamp on top of it
				if (latestDayInMessages === "") {
					eachMessage.isFirstMsgInOneDay = true;
					latestDayInMessages = eachMessage.createdAt;
					//if a msg is later than the timestamp in latestDayInMessages and they are not at the same date, this msg should display date timestamp on top of it
				}
				else if ((latestDayInMessages < eachMessage.createdAt) && (latestDayInMessages.toDateString() !== eachMessage.createdAt.toDateString() )) {
					eachMessage.isFirstMsgInOneDay = true;
					latestDayInMessages = eachMessage.createdAt;
				}
				else {
					eachMessage.isFirstMsgInOneDay = false;
				}
				return eachMessage;
			}
		});
		//log.info('lodaedItems',loadedItems.get());
		return classMessages;
	},

	teacherName: function () {
		return teacherName.get();
	},

	// isVoteOptionWithIcon:function(voteOptionIconString){
	//     if(voteOptionIconString){
	//         return true;
	//     }else{
	//         return false;
	//     }
	// },

	getNameById: function (userId) {
		var userObj = Meteor.users.findOne(userId);
		return userObj._id == Meteor.userId() ? "You" : userObj.profile.firstName + " " + userObj.profile.lastName;
	},

	isLoadMoreButtonShow: function () {
		var currentClassObj = Smartix.Groups.Collection.findOne({
			type: 'class',
			classCode: Router.current().params.classCode
		});

		var msgCount = Smartix.Messages.Collection.find({
			group: currentClassObj._id
		}).count();

		if (loadedItems.get() >= msgCount) {
			return "hidden";
		}
		else {
			return "";
		}
	}
});


Template.ClassDetail.onRendered( function() {
	Meteor.call('getFullNameById', classObj.admins[0], function (err, data) {
		return teacherName.set(data);
	});
	Meteor.call('getAvatarById', classObj.admins[0], function (err, data) {
		//log.info(data);
		return teacherAvatar.set(data);
	});
	Meteor.call('getAvatarTypeId', classObj.admins[0], function (err, data) {
		//log.info(data);
		return teacherAvatarType.set(data);
	});
	//greet first-time user
	if (Meteor.user().firstClassJoined) {
		IonPopup.alert({
			title: TAPi18n.__("Congratulations"),
			template: TAPi18n.__("JoinedFirstClass"),
			okText: TAPi18n.__("OKay")
		});
		//set the flag to false so it would not show again
		Meteor.call('smartix:accounts/setFirstClassJoined');
	}

	$(".class-detail").scroll(function () {
		if ($('.class-detail').scrollTop() > 75) {
			isAtTop.set(false);
		}
		else {
			isAtTop.set(true);
		}
	});

	var classDetailClass = document.getElementsByClassName("class-detail")[0];
	/****track if there are any new messages *********/
	var initialClassObj = Smartix.Groups.Collection.findOne({
		type: 'class',
		classCode: Router.current().params.classCode
	});
	var initialCount = Smartix.Messages.Collection.find({group: initialClassObj._id}).count();

	//http://stackoverflow.com/questions/32461639/how-to-execute-a-callback-after-an-each-is-done
	this.autorun(function () {
		var latestClassObj = Smartix.Groups.Collection.findOne({
			type: 'class',
			classCode: Router.current().params.classCode
		});
		// we need to register a dependency on the number of documents returned by the
		// cursor to actually make this computation rerun everytime the count is altered
		var latestCount = Smartix.Messages.Collection.find({group: initialClassObj._id}).count();

		Tracker.afterFlush(function () {
			if (latestCount > initialCount) {

				//scroll to bottom
				var classMessageListToBottomScrollTopValue = classDetailClass.scrollHeight - classDetailClass.clientHeight;
				classDetailClass.scrollTop = classMessageListToBottomScrollTopValue;

				initialCount = latestCount;
			}
		}.bind(this));
	}.bind(this));
	/****track if there are any new messages - END *********/
	var template = this;
	//scroll to bottom
	this.autorun(function () {
		if (template.subscriptionsReady()) {
			Tracker.afterFlush(function () {

				var imgReadyChecking = function () {
					var hasAllImagesLoaded = true;
					$('img').each(function () {
						if (this.complete) {
							//log.info('loaded');
						}
						else {
							//log.info('not loaded');
							hasAllImagesLoaded = false;
						}
					});

					if (hasAllImagesLoaded) {
						//log.info('scroll to bottom');
						//need to wrap the code inside autorun and subscriptionready
						//see http://stackoverflow.com/questions/32291382/when-the-page-loads-scroll-down-not-so-simple-meteor-js
						var classMessageListToBottomScrollTopValue = classDetailClass.scrollHeight - classDetailClass.clientHeight;
						//log.info(classMessageListToBottomScrollTopValue);
						classDetailClass.scrollTop = classMessageListToBottomScrollTopValue;

					}
					else {
						//if not all images is fully loaded, scroll bottom would not work.
						//so we set a timer to do the imgReadyChecking again later
						setTimeout(imgReadyChecking, 1000);
					}
				};
				//run immediately for the first time
				imgReadyChecking();
			});
		}
	});
});

function playAudio(url, callback) {
	// Play the audio file at url
	log.info(callback);
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
	my_media.play({
		numberOfLoops: 1
	});
}


function toggleCommentSection(e) {
	var commentSection = $(e.target).parent().parent().find('section.commentSection');
	if (commentSection.hasClass('hidden')) {
		commentSection.removeClass('hidden')
	}
	else {
		commentSection.addClass('hidden');
	}
}

function showCommentSection(e) {
	var commentSection = $(e.target).parent().parent().find('section.commentSection');
	if (commentSection.hasClass('hidden')) {
		commentSection.removeClass('hidden')
	}
}