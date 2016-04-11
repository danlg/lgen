/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* TabClasses: Event Handlers */
/*****************************************************************************/

Template.TabClasses.events({});

/*****************************************************************************/
/* TabClasses: Helpers */
/*****************************************************************************/
Template.TabClasses.helpers({
  notCreateEmptyList: function () {
    return Smartix.Groups.Collection.find({
        type: 'class',
        admins: Meteor.userId()
    }).count() > 0
  },
  notJoinedEmptyList: function () {
    return Smartix.Groups.Collection.find({
        type: 'class',
        users: Meteor.userId()
    }).count() > 0
  },
  joinedClass: function () {
    return Smartix.Groups.Collection.find({
        type: 'class',
        users: Meteor.userId()
    }, {
        sort:{
            "lastUpdatedAt":-1
        }
    });
  },

  canCreateClass: function () {
     
    var currentSchoolId =  Session.get('pickedSchoolId') ;
    
    //global only have single role => user , so chat option is always available
    if(!currentSchoolId || currentSchoolId == 'global'){
        return true;
    } else {
        //In a school context, only teacher or parent can have chat option
        if( lodash.includes( Roles.getRolesForUser( Meteor.userId(), currentSchoolId ) , 'teacher' ) || 
            lodash.includes( Roles.getRolesForUser( Meteor.userId(), currentSchoolId ) , 'parent' ) 
          ){
            return true;
        } else {
            return false;
        }
    }
  },

  createdClass: function () {
    return Smartix.Groups.Collection.find({
    admins: Meteor.userId()
    }, {
        sort: {
            "lastUpdatedAt": -1
        }

    });
  },

  classAvatarIcon: function() {
    var ava =  (this.classAvatar) ? true : false;
    if (ava) {
      return "e1a-" + this.classAvatar;
    }
    else{ //default
      return "e1a-green_apple";
    }
  },
  'newMessageCounter':function(classCode){
   // log.info(chatroomId);
   var newMessageCount =  Notifications.find({"eventType" : "newclassmessage",'classCode':classCode,'hasRead':false}).count();
      
   if(newMessageCount > 0 ){
       return '<span class="badge" style="background-color: #ef473a;color: #fff;">'+ newMessageCount +'</span>'
   }
  },
  'newCommentCounter':function(classCode){
   // log.info(chatroomId);
   var newMessageCount =  Notifications.find({"eventType" : "newclasscomment",'classCode':classCode,'hasRead':false}).count();
      
   if(newMessageCount > 0 ){
       return '<span class="badge" style="background-color: #ef473a;color: #fff;">'+ newMessageCount +'</span>'
   }
  },
  'lasttextTime':function(lastUpdatedAtDate){
    if (lastUpdatedAtDate){  
      return moment(lastUpdatedAtDate).fromNow();
    }
    else
      return "";      
  }

});

/*****************************************************************************/
/* TabClasses: Lifecycle Hooks */
/*****************************************************************************/
Template.TabClasses.created = function () {
};

Template.TabClasses.rendered = function () {


  //if user is registered with meteor account <-- this logic is disabled so new user is easier to get started
  /*if (typeof Meteor.user().emails[0].verified !== 'undefined') {
    //if email is not yet verfied
    if (Meteor.user().emails[0].verified == false) {
      Router.go('EmailVerification');
      
      return;
    }
  }*/
  
  //we do not need to show the tour as it is shown before login
  //if sign up by google oauth or user's email is already verified
  if(typeof Meteor.user().emails[0].verified == 'undefined'
    || Meteor.user().emails[0].verified)
  {
    if (Meteor.isCordova) {
      //set the flag to true. there is no need to pop this up if user is already using the mobile app
      Meteor.users.update(Meteor.userId(), { $set: { "profile.hybridapppromote": true } });
    }
    else {
      if (Meteor.user().profile.hybridapppromote == false) {
        //promote the app once if they havent try the hybrid apps
        IonPopup.alert({
          title: TAPi18n.__("DoYouKnow"),
          template: TAPi18n.__("WeHaveAppVersion") + ' \
        <b><a href="'+ Meteor.settings.public.APP_STORE_URL + '">App Store</a></b> \
         ,  <b><a href="'+ Meteor.settings.public.GOOGLE_PLAY_URL + '">Google Play</a></b>!',//TODO: actual google play or app store link
          okText: TAPi18n.__("OKayGotIt")
        });

        //set the flag to true so it would not show again
        Meteor.users.update(Meteor.userId(), { $set: { "profile.hybridapppromote": true } });
      }
    }
  }
  HowToInviteTour();
};

var HowToInviteTour = function () {
  Meteor.call('getUserCreateClassesCount', function (err, count) {
    var createdClassCount = count;
    log.info(createdClassCount);
    var hasSeenHowToInviteTour = Session.get("hasSeenHowToInviteTour");
    log.info(" has user seen the tour? " + hasSeenHowToInviteTour);
    if (createdClassCount == 1 && !hasSeenHowToInviteTour ) {
      IonPopup.show({
        title: TAPi18n.__("Congratulations"),
        template: TAPi18n.__("InviteTeacherToLearnHowToAdd"),
        buttons: [
          {
            text: 'OK',
            type: 'button-positive',
            onTap: function () {
              IonPopup.close();
              Router.go('HowToInviteShort',{classCode: Classes.findOne().classCode });
            }
          },
          {
            text: 'Later', type: 'button-light',
            onTap: function () {
              IonPopup.close();
            }
          }
        ]
      });
    }
  });
};

Template.TabClasses.destroyed = function () {
};
