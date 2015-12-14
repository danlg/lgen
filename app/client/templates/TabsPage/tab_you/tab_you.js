/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Template.TabYou.events({
  'click .signOut': function () {
    log.info("logout:" + Meteor.userId());
    Meteor.logout(
      function (err) {
        Router.go('Login');
      }
    );
  },

  'click .love': function (argument) {
    if (Meteor.isCordova) {
      switch (Meteor.user().profile.role) {
        //TODO localization English hardcoded for recommendation, with template i18n, see doc on how to insert variable
        case "Teacher":
          var text = "Hey! \r\n\r\nI have been using Little Genius to text my students and parents without sharing my " +
            "personal phone number.\r\nYou have to try it! It saves time, students love it and it is free! " +
            "\r\nHere is the link: " + Meteor.settings.public.SHARE_URL + "?rid=" + Meteor.userId();
          break;
        case "Student":
          var text = "Hey!\r\n\r\nMy teachers have been using the Little Genius app to message our class before " +
            "assignments are due, share photos and update us with last minute changes. You should tell your teachers about it! " +
            "It\'s really helpful and free.\r\nHere is the link: " + Meteor.settings.public.SHARE_URL + "?rid=" + Meteor.userId() + "\"\r\n";
          break;
        case "Parent":
          var text = "Hey!\r\n\r\nOur school teachers have been using the Little Genius app to message our class before " +
            "assignments are due, share photos and update us with last minute changes. You should tell your school teachers about it! " +
            "It\'s really helpful and free.\r\nHere is the link: " + Meteor.settings.public.SHARE_URL + "?rid=" + Meteor.userId() + "\"\r\n";
          break;

        default:
      }
      window.plugins.socialsharing.share(text, null, null, null);
      analytics.track("Referral", {
        date: new Date(),
        userId: Meteor.userId()
      });
      Meteor.call("addReferral", Meteor.userId(), function (error, result) {
        if (error) {
          log.error("error", error);
        }
      });
    }//end of isCordova
  }
});

/*****************************************************************************/
/* TabYou: Helpers */
/*****************************************************************************/
Template.TabYou.helpers({

});

/*****************************************************************************/
/* TabYou: Lifecycle Hooks */
/*****************************************************************************/
Template.TabYou.created = function () {
};

Template.TabYou.rendered = function () {

};

Template.TabYou.destroyed = function () {
};
