/*****************************************************************************/
/* Login: Event Handlers */
/*****************************************************************************/
Template.Login.events({
  'click .gmailLoginBtn':function(){
      Meteor.loginWithGoogle(function(err){
        if(err)
          alert(err);
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
};

Template.Login.destroyed = function () {
};
