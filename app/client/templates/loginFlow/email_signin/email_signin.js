/*****************************************************************************/
/* EmailSignin: Event Handlers */
/*****************************************************************************/
Template.EmailSignin.events({
});

/*****************************************************************************/
/* EmailSignin: Helpers */
/*****************************************************************************/
Template.EmailSignin.helpers({
});

/*****************************************************************************/
/* EmailSignin: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailSignin.created = function () {
};

Template.EmailSignin.rendered = function () {
  loginVM.bind(this);
};

Template.EmailSignin.destroyed = function () {
};

Template.ionNavBar.events({
    'click .loginBtn':function(){
      var loginObj = loginVM.toJS();
      Meteor.loginWithPassword(loginObj.email,loginObj.pwd,function(err){
        err?alert(err):Router.go('TabClasses');
        });
    }
});
