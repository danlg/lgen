/*****************************************************************************/
/* Login: Event Handlers */
/*****************************************************************************/
Template.Login.events({
  'click .gmailLoginBtn':function(){
      Meteor.loginWithGoogle(function(err){
          err?alert(err):Router.go('role');
        })
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
};

Template.Login.destroyed = function () {
};
