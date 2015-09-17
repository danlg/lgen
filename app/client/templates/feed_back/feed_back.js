/*****************************************************************************/
/* FeedBack: Event Handlers */
/*****************************************************************************/
Template.FeedBack.events({

});

/*****************************************************************************/
/* FeedBack: Helpers */
/*****************************************************************************/
Template.FeedBack.helpers({});

/*****************************************************************************/
/* FeedBack: Lifecycle Hooks */
/*****************************************************************************/
Template.FeedBack.created = function() {};

Template.FeedBack.rendered = function() {};

Template.FeedBack.destroyed = function() {};


Template.ionNavBar.events({
  'click .feedbackSend': function(e, template) {
    IonLoading.show({
      backdrop:true
    });
    Meteor.call("FeedBack", $(".feedbackContent").val(), function(err,result) {
      IonLoading.hide();
      if(err)
        alert(err.reason);
      else{
        alert("Thanks for sharing!");
      }
    });
  }
});
