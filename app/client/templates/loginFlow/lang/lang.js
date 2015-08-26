/*****************************************************************************/
/* Lang: Event Handlers */
/*****************************************************************************/
Template.Lang.events({
});

/*****************************************************************************/
/* Lang: Helpers */
/*****************************************************************************/
Template.Lang.helpers({
});

/*****************************************************************************/
/* Lang: Lifecycle Hooks */
/*****************************************************************************/
Template.Lang.created = function () {
};

Template.Lang.rendered = function () {

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

Template.Lang.destroyed = function () {
};
