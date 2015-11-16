Template.Feedback.events({});

/* Lifecycle Hooks */
Template.Feedback.created = function () {
};

Template.Feedback.rendered = function () {
};

Template.Feedback.destroyed = function () {
};

Template.ionNavBar.events({
  'click .feedbackSend': function (e, template) {
    IonLoading.show({
      backdrop: true
    });
    Meteor.call("feedback", $(".feedbackContent").val(), function (err, result) {
      IonLoading.hide();
      if (err)
        alert(err.reason);
      else {
        alert(TAPi18n.__("Thanks_for_sharing"));
      }
    });
  }
});
