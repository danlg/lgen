/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/* ChatRoom: Lifecycle Hooks */
var currentChatroomId;

Template.ChatRoom.onCreated( function () {
	this.loadedItems = new ReactiveVar(10);
	this.loadExtraItems = 5;
	let chatRoomId = Router.current().params.chatRoomId;
		this.subscribe('chatRoomWithUser', chatRoomId);
	var self = this;
	this.autorun(function () {
		self.subscribe('smartix:messages/groupMessages', chatRoomId);
		self.subscribe('images', UI._globalHelpers['getCurrentSchoolName'](), 'chat', chatRoomId);
		self.subscribe('documents', UI._globalHelpers['getCurrentSchoolName'](), 'chat', chatRoomId);
		self.subscribe('sounds', UI._globalHelpers['getCurrentSchoolName'](), 'chat', chatRoomId);
	});
});

Template.ChatRoom.onRendered( function() {
	currentChatroomId = Router.current().params.chatRoomId;

	// initiae initial count with 0
	var initialCount = 0;
	var template = this;
	//http://stackoverflow.com/questions/32461639/how-to-execute-a-callback-after-an-each-is-done
	this.autorun(function () {
		//wait for subscriptions to load the chat_room page and then initiate scroll
		if (template.subscriptionsReady()) {
			var chatroomList = template.$('.chatroomList');
			var latestCount = Smartix.Messages.Collection.find({group: currentChatroomId}).count();

			Tracker.afterFlush(function () {
				if (latestCount > initialCount) {
					//scroll to bottom
					var lastImageElement = $(".image-bubble img").last().get(0);
					if (lastImageElement) {
						lastImageElement.alt = "Loading";
						lastImageElement.title = "Loading";
						lastImageElement.width = "300";
						lastImageElement.style.width = "300px";
						$(".image-bubble img").last().on('load', function () {
							lastImageElement.width = lastImageElement.naturalWidth;
							lastImageElement.height = lastImageElement.naturalHeight;
							lastImageElement.style.width = lastImageElement.naturalWidth + "px";
							lastImageElement.style.height = lastImageElement.naturalHeight + "px";
							var chatroomListToBottomScrollTopValue = chatroomList.scrollHeight - chatroomList.clientHeight;
							chatroomList.scrollTop = chatroomListToBottomScrollTopValue;
						});
					}
					var chatroomListToBottomScrollTopValue = chatroomList.scrollHeight - chatroomList.clientHeight;
					chatroomList.scrollTop = chatroomListToBottomScrollTopValue;
					$('.new-message-bubble').remove();
					var newMessageBubbleText = '<div class="new-message-bubble"> <div class=""><i class="icon ion-android-arrow-dropdown">' +
						'</i>' + TAPi18n.__("NewMessages") + '<i class="icon ion-android-arrow-dropdown"></i> </div> </div>';
					window.setTimeout(function () {
						$('i.ion-record').first().parents('div.item').before(newMessageBubbleText);
					}, 500);
					initialCount = latestCount;
				}
			}.bind(this));
		}
	}.bind(this));
	/****track if there are any new messages - END *********/
	//scroll to bottom
	//log.info("Before autorun", chatroomList);
	this.autorun(function () {
		if (template.subscriptionsReady()) {
			Tracker.afterFlush(function () {
				//log.info("Tracker.afterFlush:scrollToBottom", chatroomList);
				scrollToBottom(chatroomList);
				if ($('img')) {
					//run immediately for the first time
					imgReadyChecking();
				}
			}.bind(this));
		}
	}.bind(this));
	var newMessageBubbleText = '<div class="new-message-bubble"> <div class="">' +
		'<i class="icon ion-android-arrow-dropdown"></i>' + TAPi18n.__("NewMessages") + 
		'<i class="icon ion-android-arrow-dropdown"></i> </div> </div>';
	$('i.ion-record').first().parents('div.item').before(newMessageBubbleText);
});

var scrollToBottom = function (list) {
	var chatroomListToBottomScrollTopValue = list.scrollHeight - list.clientHeight;
	list.scrollTop = chatroomListToBottomScrollTopValue;
};

var imgReadyChecking = function () {
	var hasAllImagesLoaded = true;
	$('img').each(function () {
		if (this.complete) {
		}
		else {
			hasAllImagesLoaded = false;
		}
	});
	if (hasAllImagesLoaded) {
		window.setTimeout(function () {
			var chatroomListToBottomScrollTopValue = chatroomList.scrollHeight - chatroomList.clientHeight;
			chatroomList.scrollTop = chatroomListToBottomScrollTopValue;
		}, 200);
	}
	else {
		setTimeout(imgReadyChecking, 1000);
	}
};

Template.ChatRoom.destroyed = function () {

	//log.info('destroy chat room!');
	//var chatRoomId = Router.current().params.chatRoomId;
	// hasRead => false to true (start)
	this.loadedItems.set(10);
	this.localChatMessagesCollection = null;
	Meteor.call('setAllChatMessagesAsRead', currentChatroomId);

	// hasRead => false to true (end)
};