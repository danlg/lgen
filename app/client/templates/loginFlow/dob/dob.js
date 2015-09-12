/*****************************************************************************/
/* Dob: Event Handlers */
/*****************************************************************************/
Template.Dob.events({
  'click .Confirm':function (argument) {
    var user = Meteor.user();
    lodash.set(user,'profile.dob',$("#dobInput").val());
    Meteor.call("profileUpdateByObj", user, function(error, result){
      if(error){
        console.log("error", error);
      }else{
        Router.go('TabClasses');
      }

    });
  }
});

/*****************************************************************************/
/* Dob: Helpers */
/*****************************************************************************/
Template.Dob.helpers({
});

/*****************************************************************************/
/* Dob: Lifecycle Hooks */
/*****************************************************************************/
Template.Dob.created = function () {
};

Template.Dob.rendered = function () {
};

Template.Dob.destroyed = function () {
};
