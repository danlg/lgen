/*****************************************************************************/
/* MyAccount: Event Handlers */
/*****************************************************************************/
Template.MyAccount.events({});

/*****************************************************************************/
/* MyAccount: Helpers */
/*****************************************************************************/
Template.MyAccount.helpers({
  current: function () {
    return Meteor.user();
  },
  email: function () {
    /*console.log(_.deep(Meteor.user(),'firstname'));*/
    return Meteor.user().emails[0].address;
  },
  editprofile: Schema.editprofile,
  profile: function () {
    return Meteor.user().profile;
  }

});

/*****************************************************************************/
/* MyAccount: Lifecycle Hooks */
/*****************************************************************************/
Template.MyAccount.created = function () {
};

Template.MyAccount.rendered = function () {
};

Template.MyAccount.destroyed = function () {
};

Template.ionNavBar.events({
  'click .editAccountBtn': function () {
    AutoForm.submitFormById("#editprofile");
  }
});
