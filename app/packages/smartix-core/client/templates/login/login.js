/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* Login: Event Handlers */
/*****************************************************************************/

Template.Login.events({
  'click .gmailLoginBtn': function () {
    log.info("Meteor user /logged in ?");
    log.info( Meteor.user());
    //if (!
    //for details see, http://www.helptouser.com/code/29008008-meteor-js-google-account-filter-email-and-force-account-choser.html
    //and also https://github.com/meteor/meteor/wiki/OAuth-for-mobile-Meteor-clients
    
    Smartix.helpers.registerOrLoginWithGoogle();

  }
});

/*****************************************************************************/
/* Login: Helpers */
/*****************************************************************************/
Template.Login.helpers({});

/*****************************************************************************/
/* Login: Lifecycle Hooks */
/*****************************************************************************/
Template.Login.created = function () {
  // alert("created");
  if (Meteor.userId()) {
     //debugger;
     Router.go('TabClasses');
     
  }
};

Template.Login.rendered = function () {
  // videojs('bg-video').Background();
  // alert("rendered");
  
  /* Populate select dropdown list and then allow user to switch lang on web. TODO
  var languagesObj = TAPi18n.getLanguages();
  lodash.forOwn(languagesObj,function(eachLangObj,key){
      log.info(eachLangObj);
      log.info(key);
      $('#selectLangDropdownList').append($('<option>').text(eachLangObj.name).attr('value', key));
  });*/
  
};

Template.Login.destroyed = function () {
};
