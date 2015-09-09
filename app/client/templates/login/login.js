/*****************************************************************************/
/* Login: Event Handlers */
/*****************************************************************************/

Template.Login.events({
  'click .gmailLoginBtn':function(){
      Meteor.loginWithGoogle(function(err){
        if(err)
          alert(err.reason);
        else {
          if(Meteor.user().profile.role!=="")
            Router.go('TabClasses');
          else
            Router.go('role');
        }

      });
  }
});

/*****************************************************************************/
/* Login: Helpers */
/*****************************************************************************/
Template.Login.helpers({
});

/*****************************************************************************/
/* Login: Lifecycle Hooks */
/*****************************************************************************/
Template.Login.created = function () {

};

Template.Login.rendered = function () {
 // videojs('bg-video').Background();
};

Template.Login.destroyed = function () {
};
