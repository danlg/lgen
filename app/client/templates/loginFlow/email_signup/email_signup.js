/*****************************************************************************/
/* EmailSignup: Event Handlers */
/*****************************************************************************/
Template.EmailSignup.events({
});

/*****************************************************************************/
/* EmailSignup: Helpers */
/*****************************************************************************/
Template.EmailSignup.helpers({
});

/*****************************************************************************/
/* EmailSignup: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailSignup.created = function () {
};

Template.EmailSignup.rendered = function () {
   createVM.bind(this);
   createVM.role(this.data.role);
};

Template.EmailSignup.destroyed = function () {
};

Template.ionNavBar.events({
  'click .createBtn':function(){
    var userObj = {};
    userObj.profile={
      firstname : createVM.toJS().first,
      lastname : createVM.toJS().last,
      role    : createVM.toJS().role
    };
    userObj.email = createVM.toJS().email;
    userObj.password = createVM.toJS().password;

    Accounts.createUser(userObj,loginCallBack)
  }
})

function loginCallBack(err){
  err?alert(err):Router.go('home');
}
