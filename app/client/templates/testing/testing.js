/*****************************************************************************/
/* Testing: Event Handlers */
/*****************************************************************************/
Template.Testing.events({
  'click [data-action=showLoading]': function(event, template) {
    IonLoading.show({
      duration: 3000
    });
  },

  'click [data-action=showLoadingWithBackdrop]': function(event, template) {
    IonLoading.show({
      backdrop: false
    });

  },

  'click [data-action=showLoadingCustomTemplate]': function(event, template) {
    IonLoading.show({
      customTemplate: '<h3>Loading…</h3><p>Please wait while we upload your image.</p>',
      duration: 3000
    });
  },

  'click .stop': function() {
    IonLoading.hide();
  },
  'change .myFileInput': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      Images.insert(file, function(err, fileObj) {
        if (err) {
          // handle error
        } else {
          // handle success depending what you need to do
          var userId = Meteor.userId();
          var imagesURL = {
            'profile.image': '/cfs/files/images/' + fileObj._id
          };
          Meteor.users.update(userId, {
            $set: imagesURL
          });
        }
      });
    });
  },
  'change .myFileInputSound': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      Sounds.insert(file, function(err, fileObj) {
        if (err) {
          // handle error
        } else {
          // handle success depending what you need to do
          var userId = Meteor.userId();
          var imagesURL = {
            'profile.sound': '/cfs/files/sounds/' + fileObj._id
          };
          Meteor.users.update(userId, {
            $set: imagesURL
          });
        }
      });
    });
  }

});

/*****************************************************************************/
/* Testing: Helpers */
/*****************************************************************************/
Template.Testing.helpers({
  src:function (argument) {
    return Meteor.user().profile.image;
  },
  mp3Src:function (argument) {
    return Meteor.user().profile.sound;
  }
});

/*****************************************************************************/
/* Testing: Lifecycle Hooks */
/*****************************************************************************/
Template.Testing.created = function() {};

Template.Testing.rendered = function() {

  /*IonPopup.show({
      title: 'A Popup',
      template: 'Here\'s a quick popup.',
      buttons: [{
        text: 'Close me',
        type: 'button-positive',
        onTap: function() {
          IonPopup.close();
        }
      }]
    });*/

};

Template.Testing.destroyed = function() {};
