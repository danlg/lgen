/*****************************************************************************/
/* EmailSignup: Event Handlers */
/*****************************************************************************/
Template.EmailSignup.events({});

/*****************************************************************************/
/* EmailSignup: Helpers */
/*****************************************************************************/
Template.EmailSignup.helpers({
  emailSignup:function (argument) {
    Schema.emailSignup.i18n("schemas.emailSignup");
    return Schema.emailSignup;
  },
  isStudent:function(){
    return Router.current().params.role === "Student";
  }
});

/*****************************************************************************/
/* EmailSignup: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailSignup.created = function() {
  $("body").removeClass('modal-open');
};

Template.EmailSignup.rendered = function() {
  /*createVM.bind(this);
  createVM.role(this.data.role);*/

};

Template.EmailSignup.destroyed = function() {};

Template.ionNavBar.events({
  'click .createBtn': function() {
    /*var userObj =  createVM.toJS();
    Meteor.call('user/create', createVM.toJS(), function(err) {
      err ? alert(err) : Router.go('TabChat');
    });*/

      AutoForm.submitFormById("#signupform");



  }

})
