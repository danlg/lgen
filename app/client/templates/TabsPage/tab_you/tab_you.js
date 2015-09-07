/*****************************************************************************/
/* TabYou: Event Handlers */
/*****************************************************************************/
Template.TabYou.events({
  'click .signOut':function(){
      Meteor.logout(function(){
        Router.go('language');
      });
  },
  'click .loveLG':function (argument) {

      var text ="";
    if(Meteor.user().profile.role=="Parent"){
      text= "Hey!\r\n \r\n  My teachers have been using the Little Genius app to message our class before assignments are due, share photos and update us with last minute changes. You should tell your teachers about it! It\'s really helpful and free.\r\nHere is the link: https:\/\/www.littlegenius.io?rid="+Meteor.userId()+"\r\n";
      window.plugins.socialsharing.share(text, 'Little Genius', null , null );
    }

    if(Meteor.user().profile.role==="Teacher"){
      text = "Hey!\r\n \r\n  I have been using Little Genius to text my students and parents without sharing my personal phone number.\r\n  You have to try it! It saves time, students love it and it is free! \r\n  Here is the link: https:\/\/www.littlegenius.io?rid="+Meteor.userId()+"\r\n \r\n";
      window.plugins.socialsharing.share(text, 'Little Genius', null , null );
    }

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
