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
        console.log("error", error);
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
