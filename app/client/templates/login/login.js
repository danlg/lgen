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
            Router.go('TabChat');
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
  /*console.log(Meteor.user());*/
  console.log(token);
  console.log(token.gcm);
};

Template.Login.destroyed = function () {
};
