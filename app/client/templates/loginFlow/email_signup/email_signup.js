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
};

Template.EmailSignup.destroyed = function () {
};

Template.ionNavBar.events({
  'click .createBtn':function(){
    var userObj = {};
    userObj.profile={
      firstname : createVM.toJS().first,
      lastname : createVM.toJS().last
    };
    userObj.email = createVM.toJS().email;
    userObj.password = createVM.toJS().password;

    console.log(userObj);
    Accounts.createUser(userObj,loginCallBack)
  }
})

function loginCallBack(err){
  err?alert(err):Router.go('home');
}
