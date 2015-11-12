var text = new ReactiveVar('');
var classObj;
var teacherName = ReactiveVar("");

var soundArr = ReactiveVar([]);
var isRecording = false;
var media = "";
var isPlayingSound = false;
var tempClassCode;
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
    log.info(text.get());
  },
  'click .list.card': function () {
    Router.go('ClassPanelMsgNotice', {msgCode: this.msgId});
  },
  'click .imgThumbs': function (e) {
    var imageFullSizePath = $(e.target).data('fullsizeimage');
    IonModal.open('imageModal', {src: imageFullSizePath});
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
  },
  isPlural: function (count) {
    return count > 1;
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
  tempClassCode = classObj.classCode;
  
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

