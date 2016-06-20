/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/* Lang: Event Handlers */
Template.Language.events({
  'click .button': function (event) {
    var lang = $(event.target).data('lang');
    Session.setPersistent('lang', lang);
    // TAPi18n.setLanguage(lang);
  }
});

/* Lang: Helpers */
Template.Language.helpers({});

/* Lang: Lifecycle Hooks */
Template.Language.onCreated( function() {
  Session.setDefaultPersistent("lang", "en");
  if (Meteor.isCordova) {
    navigator.globalization.getPreferredLanguage(
      function (language) {
        // alert('language: ' + language.value + '\n');
        var pattern = /-.*/g;
        log.info(language);
        var lang = language.value.replace(pattern, "");
        Session.setPersistent('lang', lang);
        //TODO set default language to English

        TAPi18n.setLanguage(lang);
        Router.go('Login');

      },
      function () {
        toastr.error('Error getting language\n');
      }
    );
    // 	navigator.globalization.getLocaleName(
    // 		function (locale) {alert('locale: ' + locale.value + '\n');},
    // 		function () {alert('Error getting locale\n');}
    // )	;
  }
});


Template.Language.onRendered( function() {
});

Template.Language.destroyed = function () {
};
