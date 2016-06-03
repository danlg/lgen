/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* NotificationSetting: Event Handlers */
/*****************************************************************************/
Template.NotificationSetting.events({
  'change .cb': function (e) {

    var userObj = Meteor.user();

    var type = $(e.target).data('type');
    
    var enableToDisable ;
    if ($(e.target).is(':checked')) {
      enableOrDisable = true;
    } else {
      enableOrDisable = false;
    }
    
    if(type === 'email'){
      Meteor.call('emailNotificationToggle',enableOrDisable);
    }else if (type === 'push'){
      Meteor.call('pushNotificationToggle',enableOrDisable);      
    }

  }
});

/*****************************************************************************/
/* NotificationSetting: Helpers */
/*****************************************************************************/
Template.NotificationSetting.helpers({
  checked: function (type) {
    return lodash.get(Meteor.user(), type) ? "checked" : "";
  },
  isEmailVerified: function() {
        //if user is registered with meteor account
        if( Meteor.user() )//the user is logged on but can also use a google account
        {
            if(Meteor.user().emails) {
                if (typeof Meteor.user().emails[0].verified !== 'undefined') {
                    //if email is not yet verified
                  return Meteor.user().emails[0].verified;
                } else return true;//google
            } else return false;
        } else return true;
  }
});

/*****************************************************************************/
/* NotificationSetting: Lifecycle Hooks */
/*****************************************************************************/
Template.NotificationSetting.onCreated(function () {
});

Template.NotificationSetting.onRendered(function () {
});

Template.NotificationSetting.onDestroyed(function () {
});
