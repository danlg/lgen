/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

//import moment from 'moment';

var currentClassCode;
var loadedItems = ReactiveVar(10);
var loadExtraItems = 5;

/* ClassPanel: Event Handlers */
Template.ClassPanel.events({
	'keyup .search': function () {
		text.set($('.search').val());
		//log.info(text.get());
	},

	'click .list .card': function (e) {
		//Router.go('MessageExtraInfo', {msgCode: this.msgId});
		if (e.target.tagName == 'A' || e.target.tagName == "IMG" || e.target.tagName == "BUTTON") {
			//do nothing if user click on a link or an image or a button
		}
		else {
			//log.info(e);
			if ($(e.currentTarget).children('.extraInfo').hasClass('expand')) {
				$(e.currentTarget).children('.extraInfo').removeClass('expand');
			}
			else {
				$(e.currentTarget).children('.extraInfo').addClass('expand');
				window.setTimeout(function () {
					document.getElementById("messageList").scrollTop = document.getElementById("messageList").scrollTop
						+ $(e.currentTarget).offset().top - 115;
				}, 1000);
			}
		}
	},

	'click .imgThumbs': function (e) {
		var imageFullSizePath = $(e.target).data('fullsizeimage');
		IonModal.open('imageModal', {src: imageFullSizePath});
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

	'click .messageList .item .content a': function (e) {
		Smartix.FileHandler.openFile(e);
		e.preventDefault();
	},

	'click .messageList .item .bubble a': function (e) {
		Smartix.FileHandler.openFile(e);
		e.preventDefault();
	},

	'click .commentShownToggle': function (e) {
		var actionObj = $(e.target).data();
		var classObj = Smartix.Groups.Collection.findOne({
			type: 'class',
			classCode: Router.current().params.classCode
		});
		if (actionObj.action == 'hide') {
			log.info("hide comment id:" + actionObj.commentindex + " " + actionObj.msgid);
			Meteor.call('showHideComment', false, actionObj.msgid, actionObj.commentindex);
		}
		else {
			log.info("show comment id:" + actionObj.commentindex + " " + actionObj.msgid);
			Meteor.call('showHideComment', true, actionObj.msgid, actionObj.commentindex);
		}
	},

	'click .comment-counter': function (e) {
		if ($(e.currentTarget).parents(".list .card").children('.extraInfo').hasClass('expand')) {
			$(e.currentTarget).parents(".list .card").children('.extraInfo').removeClass('expand');
		}
		else {
			$(e.currentTarget).parents(".list .card").children('.extraInfo').addClass('expand');
			window.setTimeout(function () {
				document.getElementById("messageList").scrollTop = document.getElementById("messageList").scrollTop
					+ $(e.currentTarget).offset().top - 115;
			}, 1000);
		}
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

/* ClassPanel: Helpers */
Template.ClassPanel.helpers({
	classObj: function () {
		var classObj = Smartix.Groups.Collection.findOne({
			type: 'class',
			classCode: Router.current().params.classCode
		});
		return classObj;
	},

	classMessages: function () {
		var classObj = Smartix.Groups.Collection.findOne({
			type: 'class',
			classCode: Router.current().params.classCode
		});
		if (!classObj) {
			return;
		}
		var msgCount = Smartix.Messages.Collection.find({
			group: classObj._id
		}).count();
		var skipMsg = msgCount - loadedItems.get();
		//skip amount cannot be a negative value
		if (skipMsg < 0) {
			skipMsg = 0;
		}
		var limitMsg = loadedItems.get();
		//sort classMessages from oldest to newest => createdAt: 1
		var latestDayInMessages = "";
		var classMessages = Smartix.Messages.Collection.find({
				group: classObj._id
			},
			{
				sort: {createdAt: 1},
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
					//log.info(transformCount,' ',eachMessage.data.content ,' ',eachMessage.createdAt);
					return eachMessage;
				}
			});
		//log.info('classMessages',classMessages);
		return classMessages;
	},

	classCode: function () {
		return Router.current().params.classCode
	},

	className: function () {
		return classObj.className;
	},

	attachImages: function () {
		var imageObjects = lodash.filter(this.addons, function (addon) {
			return addon.type == 'images';
		});
		return lodash.map(imageObjects, 'fileId');
	},

	getImage: function () {
		var id = this.toString();
		return Images.findOne(id);
	},

	attachVoices: function () {
		var voiceObjects = lodash.filter(this.addons, function (addon) {
			return addon.type === 'voice';
		});
		return lodash.map(voiceObjects, 'fileId');
	},

	getSound: function () {
		var id = this.toString();
		return Sounds.findOne(id);
	},

	attachDocuments: function () {
		var docObjs = lodash.filter(this.addons, function (addon) {
			return addon.type === 'documents';
		});
		return lodash.map(docObjs, 'fileId');
	},

	getDocument: function () {
		var id = this.toString();
		return Documents.findOne(id);
	},

	attachVotes: function () {
		var voteObjs = lodash.filter(this.addons, function (addon) {
			return addon.type === 'poll';
		});
		return voteObjs;
	},

	isPlural: function (count) {
		return count > 1;
	},

	isZero: function (count) {
		return count === 0;
	},

	showByDefaultIfWithComments: function () {
		var commentObj = lodash.find(this.addons, {type: 'comment'});
		if (commentObj && commentObj.comments.length > 0) {
			return "expand";
		}
		else {
			return "";
		}
	},

	attachCalendar: function () {
		var calendarObjs = lodash.filter(this.addons, function (addon) {
			return addon.type === 'calendar';
		});
		return calendarObjs;
	},

	isLoadMoreButtonShow: function () {
		var currentClassObj = Smartix.Groups.Collection.findOne({
			type: 'class',
			classCode: Router.current().params.classCode
		});
		if (currentClassObj)  {
			var msgCount = Smartix.Messages.Collection.find({
				group: currentClassObj._id
			}).count();
			if (loadedItems.get() >= msgCount) {
				return "hidden";
			}
		}
		else {
			return "";
		}
	},

	attachComment: function () {
		var commentObjs = lodash.filter(this.addons, function (addon) {
			return addon.type === 'comment';
		});
		return commentObjs;
	}
});

/* ClassPanel: Lifecycle Hooks */
Template.ClassPanel.onCreated(function(){
    currentClassCode = Router.current().params.classCode;
    var self = this;
    log.info("Template.ClassPanel.onCreated", UI._globalHelpers['getCurrentSchoolName']());
    self.subscribe('images', UI._globalHelpers['getCurrentSchoolName'](), 'class', currentClassCode);
    self.subscribe('documents', UI._globalHelpers['getCurrentSchoolName'](), 'class', currentClassCode);
    self.subscribe('sounds');
    self.subscribe('smartix:classes/allUsersWhoHaveJoinedYourClasses');
    self.subscribe('smartix:classes/associatedClasses',function(){
        var classObj = Smartix.Groups.Collection.findOne({
            type: 'class',
            classCode: Router.current().params.classCode
        });
        self.subscribe('smartix:messages/groupMessages',classObj._id);
    });
});

Template.ClassPanel.rendered = function () {
	//log.info('rendered',this.subscriptionsReady());
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
						//scroll messagelist to bottom;
						var messageListDOM = document.getElementById("messageList");
						var messageListDOMToBottomScrollTopValue = messageListDOM.scrollHeight - messageListDOM.clientHeight;
						messageListDOM.scrollTop = messageListDOMToBottomScrollTopValue;
						//$('#messageList').animate({scrollTop:messageListDOMToBottomScrollTopValue}, 300);
					}
					else {
						//log.info('run next time');
						//if not all images is fully loaded, scroll bottom would not work.
						//so we set a timer to do the imgReadyChecking again later
						setTimeout(imgReadyChecking, 1000);
					}
				};
				//run for the first time
				imgReadyChecking();
			});
		}
	});
	// Session.set('hasFooter',false);
};

Template.ClassPanel.destroyed = function () {
	loadedItems.set(10);
	loadExtraItems = 5;
	Meteor.call('setAllClassCommentsAsRead', currentClassCode);
	//  Session.set('hasFooter',true);
	/* loadedItems.set(10);
	 loadExtraItems = 5;
	 localClassMessagesCollection = null;*/
};