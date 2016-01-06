/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var classObj;
var teacherName = ReactiveVar("");
var isRecording = false;
var media = "";
var isPlayingSound = false;
/*****************************************************************************/
/* ClassDetail: Event Handlers */
/*****************************************************************************/
Template.ClassDetail.events({
  'click .tab-item': function (e) {
    var msgId = $(e.target.parentNode).data("msgid");
    var action = $(e.target.parentNode).data("action");
    IonLoading.show();
    Meteor.call('updateMsgRating', action, msgId, classObj, function (argument) {
      IonLoading.hide();
    });
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
      playAudio(Sounds.findOne(playname).url(), function (argument) {
        $(e.target).attr('class', 'button button-icon icon ion-play playBtn');
        isPlayingSound = false;
      });
    }
  },
  'click .content .item .content a': function (e) {
      Application.FileHandler.openFile(e);
      e.preventDefault();
  },
  'click .content .item .document a': function (e) {
      Application.FileHandler.openFile(e);
      e.preventDefault();
  }
});

/*****************************************************************************/
/* ClassDetail: Helpers */
/*****************************************************************************/
Template.ClassDetail.helpers({
  classObj: function () {
    classObj = Classes.findOne({classCode: Router.current().params.classCode});
    return classObj;
  },
  className: function () {
    return classObj.className;
  },
  getClassName: function () {
    return Classes.findOne({classCode: Router.current().params.classCode}).className;
  },
  actions: function () {
    return ["star", "checked", "close", "help"];
  },
  isNotEmpty: function (action) {
    return action.length > 0;
  },
  createBy: function () {
    return classCode.createBy;
  },
  isSelectAction: function (action) {
    return lodash.includes(lodash.map(action, "_id"), Meteor.userId()) ? "colored" : "";
  },
  getMessagesObj: function () {
    var classObj = Classes.findOne({classCode: Router.current().params.classCode});
    if (classObj.messagesObj.length > 0) {
      return classObj.messagesObj;
    } else {
      return false;
    }
  },
  teacherName: function () {
    return teacherName.get();
  },
  havePic: function () {
    return this.imageArr.length > 0;
  },
  getImage: function () {
    var id = this.toString();
    return Images.findOne(id);
  },
  haveSound: function () {
    return this.soundArr.length > 0;
  },
  getSound: function () {
    var id = this.toString();
    return Sounds.findOne(id);
  },
  haveDocument: function () {
    //existing message may not have documentArr attribute
    if(this.documentArr){
        return this.documentArr.length > 0;
    }else{
        return false;
    }
  },
  getDocument: function () {
    var id = this.toString();
    return Documents.findOne(id);
  }
});

/*****************************************************************************/
/* ClassDetail: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassDetail.created = function () {
};

Template.ClassDetail.rendered = function () {
  Meteor.call('getFullNameById', classObj.createBy, function (err, data) {
    return teacherName.set(data);
  });

  //greet first-time user
  if(Meteor.user().profile.firstclassjoined){
     IonPopup.alert({
      title: TAPi18n.__("Congratulations"),
      template: TAPi18n.__("JoinedFirstClass"),
      okText: TAPi18n.__("OKay")
    });
    //set the flag to false so it would not show again
    Meteor.users.update(Meteor.userId(), {$set: {"profile.firstclassjoined": false}}); 
  }
  
};

Template.ClassDetail.destroyed = function () {

};

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
