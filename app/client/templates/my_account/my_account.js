/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* MyAccount: Event Handlers */
/*****************************************************************************/
Template.MyAccount.events({
  
    'click #pick-an-icon-btn':function(){
      var parentDataContext= {iconListToGet:"iconListForYou",sessionToBeSet:"chosenIconForYou"};
      IonModal.open("YouIconChoose", parentDataContext);
    }

});

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
  , getOrganizationPlaceHolder: function(){
    return TAPi18n.__("OrganizationPlaceHolder");
  }
  , getCityPlaceHolder: function(){
    return TAPi18n.__("CityPlaceHolder");
  }
  , getEmailPlaceHolder: function(){
    return TAPi18n.__("EmailPlaceHolder");
  }

  , getYouAvatar:function(){
    var chosenIcon = Session.get('chosenIconForYou');
    if(chosenIcon){
      return chosenIcon;
    }
  }

});

/*****************************************************************************/
/* MyAccount: Lifecycle Hooks */
/*****************************************************************************/
Template.MyAccount.created = function () {
  
  if(Meteor.user() && Meteor.user().profile){
    if(Meteor.user().profile.useravatar){
      Session.set('chosenIconForYou', Meteor.user().profile.useravatar)
    }
  } 
};

Template.MyAccount.rendered = function () {
};

Template.MyAccount.destroyed = function () {
  delete Session.keys['chosenIconForYou'];
};

Template.ionNavBar.events({
  'click .editAccountBtn': function () {
    AutoForm.submitFormById("#editprofile");
  }
});
