/*****************************************************************************/
/* Lang: Event Handlers */
/*****************************************************************************/
Template.Language.events({
  'click .button': function (event) {
    var lang = $(event.target).data('lang');
    Session.setPersistent('lang', lang);
    // TAPi18n.setLanguage(lang);
  }
});

/*****************************************************************************/
/* Lang: Helpers */
/*****************************************************************************/
Template.Language.helpers({});

/*****************************************************************************/
/* Lang: Lifecycle Hooks */
/*****************************************************************************/
Template.Language.created = function () {
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
        alert('Error getting language\n');
      }
    );
    // 	navigator.globalization.getLocaleName(
    // 		function (locale) {alert('locale: ' + locale.value + '\n');},
    // 		function () {alert('Error getting locale\n');}
    // )	;
  }
};

Template.Language.rendered = function () {



  /*Parse.initialize("f8PjTETlRT71zC3Wls1QW12sucgCimOET0qdcbtt", "6jVbg8jQ8UgJncS2KAOb3AqDHnqk2CzqA7ngP839");

   var GameScore = Parse.Object.extend("GameScore");
   var gameScore = new GameScore();

   gameScore.set("score", 1337);
   gameScore.set("playerName", "Sean Plott");
   gameScore.set("cheatMode", false);

   gameScore.save(null, {
   success: function(gameScore) {
   // Execute any logic that should take place after the object is saved.
   alert('New object created with objectId: ' + gameScore.id);
   },
   error: function(gameScore, error) {
   // Execute any logic that should take place if the save fails.
   // error is a Parse.Error with an error code and message.
   alert('Failed to create new object, with error code: ' + error.message);
   }
   });*/
};

Template.Language.destroyed = function () {
};
