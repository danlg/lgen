/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

Template.TabClasses.events({});

Template.TabClasses.onCreated( function() {
    this.subscribe('joinedClasses');
});

Template.TabClasses.helpers({
  notCreateEmptyList: function () {
    return Smartix.Groups.Collection.find({
        admins: Meteor.userId()
    }).count() > 0;
  },

  notJoinedEmptyList: function () {
    return ( Smartix.Groups.Collection.find({
          admins :{  $nin : [Meteor.userId()] }
    }).count() > 0 ) ;
    //return (joinedClasses.length >= 1) ;
  },

  joinedClass: function () {
    //   let tester = Meteor.call('Smartix.DistributionLists.getDistributionListsOfUser', Meteor.user());
    //   log.info(tester);
    var joinedClasses = Smartix.Groups.Collection.find
    (
        {
            admins :{  $nin : [Meteor.userId()] }
        },
        {
            sort   :{  "lastUpdatedAt":-1 }
        }
    ).fetch();
    if (joinedClasses.length < 1) {
       return false;
     } else {
       return joinedClasses;
     }
   },

  canCreateClass: function () {
    var currentSchoolId =  Session.get('pickedSchoolId') ;
    //global only have single role => user , so chat option is always available
    if(!currentSchoolId || currentSchoolId === 'global'){
        return true;
    } else {
      if(Meteor.user() && Meteor.user().roles && Meteor.user().roles[currentSchoolId]){
        var userRolesInCurrentNamespace = Meteor.user().roles[currentSchoolId];
        //student cannot create class
        return (
            userRolesInCurrentNamespace.indexOf(Smartix.Accounts.School.ADMIN)!==-1 ||
            userRolesInCurrentNamespace.indexOf(Smartix.Accounts.School.PARENT)!==-1 ||
            userRolesInCurrentNamespace.indexOf(Smartix.Accounts.School.TEACHER)!==-1
        );
      }
    }
  },

  createdClass: function () {
    return Smartix.Groups.Collection.find({
          admins: Meteor.userId(),
          namespace: Session.get('pickedSchoolId'),
          type:'class'
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

  'newMessageCounter':function(groupId){
       // log.info(chatroomId);
       var newMessageCount =  Notifications.find({"eventType" : "newclassmessage",'groupId':groupId,'hasRead':false}).count();

       if(newMessageCount > 0 ){
           return '<span class="badge" style="background-color: #ef473a;color: #fff;">'+ newMessageCount +'</span>'
       }
  },

  'newCommentCounter':function(groupId){
     // log.info(chatroomId);
     var newMessageCount =  Notifications.find({"eventType" : "newclasscomment",'groupId':groupId,'hasRead':false}).count();

     if(newMessageCount > 0 ){
         return '<span class="badge" style="background-color: #ef473a;color: #fff;">'+ newMessageCount +'</span>'
     }
  },

  'lasttextTime':function(lastUpdatedAtDate){
      return lastUpdatedAtDate ? moment(lastUpdatedAtDate).fromNow() : "";
   }
});

Template.TabClasses.onRendered( function() {
  //we do not need to show the tour as it is shown before login
  //if sign up by google oauth or user's email is already verified
  if(Meteor.user() && Meteor.user().emails && Meteor.user().emails[0].verified)
  {
      if (Meteor.user() && Meteor.user().hybridAppPromote == false) {
        if(!Meteor.isCordova){
          //promote the app once if they havent try the hybrid apps
          IonPopup.alert({
            title: TAPi18n.__("DoYouKnow"),
            template: TAPi18n.__("WeHaveAppVersion") + ' \
          <b><a href="'+ Meteor.settings.public.APP_STORE_URL + '">App Store</a></b> \
          ,  <b><a href="'+ Meteor.settings.public.GOOGLE_PLAY_URL + '">Google Play</a></b>!',//TODO: actual google play or app store link
            okText: TAPi18n.__("OKayGotIt")
          });
        }
        //set the flag to true so it would not show again
       Meteor.call('smartix:accounts/setHybridAppPromote');
      }
  }
  HowToInviteTour();
});

var HowToInviteTour = function () {
  //TODO: less annoying
  Meteor.call('getUserCreateClassesCount', function (err, count) {
    var createdClassCount = count;
    //log.info(createdClassCount);
    var hasSeenHowToInviteTour = Session.get("hasSeenHowToInviteTour");
    log.info("has user seen the tour? ", hasSeenHowToInviteTour);
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
              Router.go('HowToInviteShort',{classCode: Smartix.Groups.Collection.findOne({type:"class"}).classCode });
            }
          },
          {
            text: 'Later', type: 'button-light',
            onTap: function () {
              Session.set("hasSeenHowToInviteTour",true);
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