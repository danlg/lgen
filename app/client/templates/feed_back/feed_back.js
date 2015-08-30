/*****************************************************************************/
/* FeedBack: Event Handlers */
/*****************************************************************************/
Template.FeedBack.events({
  'click .feedbackSend':function (argument) {
    Meteor.call("FeedBack",$(".feedbackContent"),function (argument) {
      alert("Thanks for Share!");
    });
  }
});

/*****************************************************************************/
/* FeedBack: Helpers */
/*****************************************************************************/
Template.FeedBack.helpers({
});

/*****************************************************************************/
/* FeedBack: Lifecycle Hooks */
/*****************************************************************************/
Template.FeedBack.created = function () {
};

Template.FeedBack.rendered = function () {
};

Template.FeedBack.destroyed = function () {
};
