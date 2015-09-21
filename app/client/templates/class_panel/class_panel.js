var text = new ReactiveVar('');
var classObj;
var teacherName = ReactiveVar("");
var isRecording = false;
var media = "";
var isPlayingSound = false;
/*****************************************************************************/
/* ClassPanel: Event Handlers */
/*****************************************************************************/
Template.ClassPanel.events({
  'change .chooseType': function (evt) {
    var type = $(evt.target).val();
    var msgId = $(evt.target).data('mgsid');
    var classObj = Router.current().data().classObj;
    Meteor.call("updateMsgRating", type, msgId, classObj);
  },
  'keyup .search': function () {
    text.set($('.search').val());
    /*console.log(text.get());*/
  },
  // 'click .playBtn':function (e) {
  //   if(!isPlayingSound){
  //     isPlayingSound=true;
  //     var playname=$(e.target).data('clipid');
  //    //  $(e.target).attr('class','icon ion-stop');
  //     $(e.target).attr('class','button button-icon icon ion-stop ');
  //
  //    // alert("startPlay");
  //     playAudio(Sounds.findOne(playname).url(),function (argument) {
  //       $(e.target).attr('class','button button-icon icon ion-play playBtn');
  //       isPlayingSound=false;
  //     });
  //   }
  // },
  'click .list.card': function () {
    Router.go('ClassPanelMsgNotice', {msgCode: this.msgId});
  },
  // 'click .imgThumbs':function (e) {
  //   e.preventDefault();
  //   var imageFullSizePath = $(e.target).data('fullsizeimage');
  //   IonModal.open('imageModal',{src:imageFullSizePath});
  // }
});

/*****************************************************************************/
/* ClassPanel: Helpers */
/*****************************************************************************/
Template.ClassPanel.helpers({
  classObj: function () {
    classObj = Classes.findOne();
    return classObj;
  },
  classCode: function () {
    return Classes.findOne().classCode;
  },
  isNotEmpty: function (action) {
    return action.length > 0;
  },
  createBy: function () {
    return classCode.createBy;
  },
  teacherName: function () {
    return teacherName.get();
  },
  className: function () {
    return classObj.className;
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
/* ClassPanel: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassPanel.created = function () {
};

Template.ClassPanel.rendered = function () {
  Meteor.call('getFullNameById', classObj.createBy, function (err, data) {
    return teacherName.set(data);
  });

};

Template.ClassPanel.destroyed = function () {
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
  my_media.play({numberOfLoops: 1});
}
