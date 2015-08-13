/*****************************************************************************/
/* EmailSignup: Event Handlers */
/*****************************************************************************/
Template.EmailSignup.events({});

/*****************************************************************************/
/* EmailSignup: Helpers */
/*****************************************************************************/
Template.EmailSignup.helpers({
  emailSignup:Schema.emailSignup
});

/*****************************************************************************/
/* EmailSignup: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailSignup.created = function() {};

Template.EmailSignup.rendered = function() {
  /*createVM.bind(this);
  createVM.role(this.data.role);*/

};

Template.EmailSignup.destroyed = function() {};

Template.ionNavBar.events({
  'click .createBtn': function() {
    /*var userObj =  createVM.toJS();
    Meteor.call('user/create', createVM.toJS(), function(err) {
      err ? alert(err) : Router.go('Home');
    });*/
    AutoForm.submitFormById("#signupform");
  }

})
