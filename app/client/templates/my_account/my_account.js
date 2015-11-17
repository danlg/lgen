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
  }
  , email: function () {
    //log.info(_.deep(Meteor.user(),'firstname'));
    return Meteor.user().emails[0].address;
  }
  , editprofile: Schema.editprofile
  , profile: function () {
    return Meteor.user().profile;
  }
  , getFirstNamePlaceHolder: function(){
    return TAPi18n.__("FirstNamePlaceHolder");
  }
  , getLastNamePlaceHolder: function(){
    return TAPi18n.__("LastNamePlaceHolder");
  }
  , getEmailPlaceHolder: function(){
    return TAPi18n.__("EmailPlaceHolder");
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
