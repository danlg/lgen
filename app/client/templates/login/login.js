/*****************************************************************************/
/* Login: Event Handlers */
/*****************************************************************************/

Template.Login.events({
  'click .gmailLoginBtn': function() {

    var option ={};
    option.forceApprovalPrompt=true;
    option.loginStyle="popup";


    Meteor.loginWithGoogle(option,function(err) {
      if (err)
        alert(err.reason);
      else {
        if (Meteor.user().profile.role !== "")
          Router.go('TabClasses');
        else
        // Router.go('role');
          IonModal.open('_modal');
      }

    });
  }
});

/*****************************************************************************/
/* Login: Helpers */
/*****************************************************************************/
Template.Login.helpers({});

/*****************************************************************************/
/* Login: Lifecycle Hooks */
/*****************************************************************************/
Template.Login.created = function() {};

Template.Login.rendered = function() {
  // videojs('bg-video').Background();
};

Template.Login.destroyed = function() {};
