/*****************************************************************************/
/* TabClasses: Event Handlers */
/*****************************************************************************/

function createdClassImpl() {
  return Classes.find({createBy: Meteor.userId()});
}

Template.TabClasses.events({});

/*****************************************************************************/
/* TabClasses: Helpers */
/*****************************************************************************/
Template.TabClasses.helpers({
  notCreateEmptyList: function () {
    return Classes.find({createBy: Meteor.userId()}).count() > 0
  },
  notJoinedEmptyList: function () {
    return Classes.find({joinedUserId: {$in: [Meteor.userId()]}}).count() > 0
  },
  joinedClass: function () {
    return Classes.find({joinedUserId: {$in: [Meteor.userId()]}});
  },

  isTeacher: function () {
    return Meteor.user().profile.role === "Teacher";
  },

  createdClass: createdClassImpl,

  classavatar_icon: function() {
    var ava =  (this.classavatar) ? true : false;
    if (ava) {
      return "e1a-" + this.classavatar;
    }
    else{ //default
      return "e1a-green_apple";
    }
  }


});

/*****************************************************************************/
/* TabClasses: Lifecycle Hooks */
/*****************************************************************************/
Template.TabClasses.created = function () {
};

Template.TabClasses.rendered = function () {
  

  if (Meteor.isCordova) {
    //set the flag to true. there is no need to pop this up if user is already using the mobile app
    Meteor.users.update(Meteor.userId(), { $set: { "profile.hybridapppromote": true } });
  } else {

    if (Meteor.user().profile.hybridapppromote == false){
      //promote the app once if they havent try the hybrid apps 
      IonPopup.alert({
        title: TAPi18n.__("DoYouKnow"),
        template: TAPi18n.__("WeHaveAppVersion") + ' \
        <b><a href="'+Meteor.settings.public.APP_STORE_URL+'">App Store</a></b> \
         ,  <b><a href="'+Meteor.settings.public.GOOGLE_PLAY_URL+'">Google Play</a></b>!',//TODO: actual google play or app store link
        okText: TAPi18n.__("OKayGotIt")
      });    
      
      //set the flag to true so it would not show again
      Meteor.users.update(Meteor.userId(), { $set: { "profile.hybridapppromote": true } });
    }
  }

};

Template.TabClasses.destroyed = function () {
};
