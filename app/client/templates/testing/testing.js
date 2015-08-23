/*****************************************************************************/
/* Testing: Event Handlers */
/*****************************************************************************/
Template.Testing.events({
  'click [data-action=showLoading]': function (event, template) {
    IonLoading.show({
      duration: 3000
    });
  },

  'click [data-action=showLoadingWithBackdrop]': function (event, template) {
    IonLoading.show({
      backdrop: false
    });

  },

  'click [data-action=showLoadingCustomTemplate]': function (event, template) {
    IonLoading.show({
      customTemplate: '<h3>Loading…</h3><p>Please wait while we upload your image.</p>',
      duration: 3000
    });
  },

  'click .stop':function(){
    IonLoading.hide();
  }

});

/*****************************************************************************/
/* Testing: Helpers */
/*****************************************************************************/
Template.Testing.helpers({
});

/*****************************************************************************/
/* Testing: Lifecycle Hooks */
/*****************************************************************************/
Template.Testing.created = function () {
};

Template.Testing.rendered = function () {

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

Template.Testing.destroyed = function () {
};
