/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* NotificationSetting: Event Handlers */
/*****************************************************************************/
Template.NotificationSetting.events({
  'change .cb': function (e) {

    var userObj = Meteor.user();

    var type = $(e.target).data('type');

    if ($(e.target).is(':checked')) {
      lodash.set(userObj, 'profile.' + type, true);
    } else {
      lodash.set(userObj, 'profile.' + type, false);
    }


    Meteor.call("profileUpdateByObj", userObj, function (error, result) {
      if (error) {
        log.error("error", error);
      } else {

        // if(type.toUpperCase()==="PUSH"){
        //
        //   var tag = lodash.get(userObj,'profile.push')? "push notification activated "
        //
        //   analytics.track(tag, {
        //     date: new Date(),
        //   });
        //
        // }


      }

    });

  }
});

/*****************************************************************************/
/* NotificationSetting: Helpers */
/*****************************************************************************/
Template.NotificationSetting.helpers({
  checked: function (type) {
    return lodash.get(Meteor.user(), 'profile.' + type) ? "checked" : "";
  },
  isEmailVerified: function(){
      
        //if user is registered with meteor account
        if(Meteor.user())
        {
            if(Meteor.user().emails){
                    if (typeof Meteor.user().emails[0].verified !== 'undefined') {
                        //if email is not yet verfied
                        if (Meteor.user().emails[0].verified == false) {
                            return false;
                        }else{
                            return true;
                        }
                }
            }
        }else{
            return true;
        }         
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
