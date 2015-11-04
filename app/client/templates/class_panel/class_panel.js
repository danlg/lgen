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
  'click .list.card': function () {
    Router.go('ClassPanelMsgNotice', {msgCode: this.msgId});
  },
  'click .sendBtn': function (event,template) {
    
    var selectedClassCodes = [];
    selectedClassCodes.push(template.currentClassCode.get());
    var target = selectedClassCodes;
    
    log.info(target);
    var msg = $(".inputBox").val();
    
    //todo: acquire image and sound arr from user input
    var mediaObj = {};
    mediaObj.imageArr = {};
    mediaObj.soundArr = {};

    if (target.length > 0) {
      Meteor.call('sendMsg', target, msg, mediaObj, function () {
        /*Session.set("sendMessageSelectedClasses", {
          selectArrName: [],
          selectArrId: []
        });
        Router.go('TabClasses');*/
      });
    } else {
      alert("no class select!");
    }
  }
 
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
  
  this.currentClassCode = new ReactiveVar( classObj.classCode );
  
  Meteor.call('getUserCreateClassesCount', function (err, count) {

    var createdClassCount = count;
    log.info(createdClassCount);
    var hasSeenTheTour = Session.get("hasSeenTheTourForStudent");
    log.info(" has user seen the tour? " + hasSeenTheTour);
    if (createdClassCount == 1 && hasSeenTheTour != true) {

      
      IonPopup.show({
        title: TAPi18n.__("Congratulations"),
        template: TAPi18n.__("InviteTeacherToLearnHowToAdd"),
        buttons: [
          {
            text: 'OK',
            type: 'button-positive',
            onTap: function () {
              IonPopup.close();
              Router.go('InviteUser');
            }
          },
          {
            text: 'Later',
            type: 'button-light',
            onTap: function () {
              IonPopup.close();
            }
          }
        ]
      });

    }

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
