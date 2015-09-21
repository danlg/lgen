var classObj;
var isRecording = false;
var media = "";
var isPlayingSound = false;
/*****************************************************************************/
/* ClassPanelMsgNotice: Event Handlers */
/*****************************************************************************/
Template.ClassPanelMsgNotice.events({
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
  }
});

/*****************************************************************************/
/* ClassPanelMsgNotice: Helpers */
/*****************************************************************************/
Template.ClassPanelMsgNotice.helpers({
  classObj: function () {
    classObj = Classes.findOne();
    return classObj;
  },
  msgObj: function () {
    var msgArr = Classes.findOne().messagesObj;
    var filtedArr = lodash.findByValues(msgArr, "msgId", Router.current().params.msgCode);
    return filtedArr[0];
  },
  className: function () {
    return classObj.className;
  },
  isNotEmpty: function (action) {
    return action.length > 0;
  },
  getName: function (userObj) {
    return userObj._id == Meteor.userId() ? "You" : userObj.profile.firstname + " " + userObj.profile.lastname;
  },
  star: function () {
    return Classes.findOne().messagesObj.star;
  },
  allMan: function () {
    var msgArr = Classes.findOne().messagesObj;
    var arr = [];
    var filtedArr = lodash.findByValues(msgArr, "msgId", Router.current().params.msgCode);

    arr.push(filtedArr[0].star);
    arr.push(filtedArr[0].close);
    arr.push(filtedArr[0].help);
    arr.push(filtedArr[0].checked);

    return lodash.flatten(arr);
  },
  geticon: function (userObj) {
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
  }
});

/*****************************************************************************/
/* ClassPanelMsgNotice: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassPanelMsgNotice.created = function () {
};

Template.ClassPanelMsgNotice.rendered = function () {
};

Template.ClassPanelMsgNotice.destroyed = function () {
};

function playAudio(url, callback) {
  // Play the audio file at url
  // console.log(callback);
  var my_media = new Media(url,
    // success callback
    function () {
      console.log("playAudio():Audio Success");
      callback();
      console.log("calledback");
    },
    // error callback
    function (err) {
      console.log("playAudio():Audio Error: " + err);
    }
  );
  // Play audio
  my_media.play({
    numberOfLoops: 1
  });
}
