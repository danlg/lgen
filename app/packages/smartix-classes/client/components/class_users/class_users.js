/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var text = ReactiveVar('');
// var classObj = ReactiveVar({});
/*****************************************************************************/
/* ClassUsers: Event Handlers */
/*****************************************************************************/
Template.ClassUsers.onCreated(function(){
        this.subscribe('smartix:classes/classByClassCode', Router.current().params.classCode);
        this.subscribe('smartix:classes/classMembers', Router.current().params.classCode);
});


Template.ClassUsers.events({
  'keyup .searchbar': function (el) {
    text.set($(".searchbar").val());
  },
  'click .user-item':function(e){
      //log.info(this);
      //log.info(e);
      var userid = this._id;
      var userFullname = this.profile.firstName + " " + this.profile.lastName;
      var classObj = Smartix.Groups.Collection.findOne({
          type: 'class',
          classCode: Router.current().params.classCode
        });
          
      if($(e.target).hasClass('remove-member-btn') ){
          //log.info('btn');
            //TAPi18n.__("Congratulations"),
            //prompt for remove user confirmation
            IonPopup.show({
                title:  TAPi18n.__("TheFollowingMemberWouldBeRemoved") +": "+ userFullname,
                buttons: [
                {
                    text: TAPi18n.__("Confirm"),
                    type: 'button-assertive',
                    onTap: function () {
                    IonPopup.close();

                        //remove this memeber here
                        Meteor.call("class/deleteUser", classObj,userid , function () {
                            toastr.success("success removed!");
                        });                   
                    }
                },
                {
                    text: TAPi18n.__("Cancel"), type: 'button',
                    onTap: function () {
                    IonPopup.close();
                    }
                }
                ]
            });            
         
      }else{
          //log.info('panel');
          Router.go('UserDetail',{_id : userid, classCode : classObj.classCode, classId : classObj._id});
          
      }
  }
});

/*****************************************************************************/
/* ClassUsers: Helpers */
/*****************************************************************************/
Template.ClassUsers.helpers({
  usersProfile: function () {
    //uses data from subscription otherClassmates
    //select users from Meteor who is not current user and has joined this class
      var allUsers = Meteor.users.find({},{sort: { 'profile.lastName': 1, 'profile.firstName': 1}}).fetch();
      if (allUsers.length < 1) {
        return false;
      } else {
        return allUsers;
      } 
  },

  isIndividualUser: function(userId)
  {
    var classObj = Smartix.Groups.Collection.findOne({
        type: 'class',
    });
    if(classObj){
      var userArray = classObj.users;
      return lodash.includes(userArray, userId);
    }
    else
      return;
  },
  
  isAdmin: function(userId)
  {
    var classObj = Smartix.Groups.Collection.findOne({
        type: 'class',
    });
    if(classObj){
      var userArray = classObj.admins;
      return lodash.includes(userArray, userId);
    }
    else
      return;
  },

  isSearched: function (userObj) {
    var name = Smartix.helpers.getFullNameByProfileObj(userObj.profile);
    if (text.get() === "") {
      return true;
    } else {
      return lodash.includes(name.toUpperCase(), text.get().toUpperCase());
    }
  },

  emptyList: function () {
    //select users from Meteor who is not current user and has joined this class
    return Meteor.users.find().count() == 0 ;
  },

  classObj: function (argument) {
    return Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    });
  },

  allUsersCount: function(){
      var allUsersCount = Meteor.users.find().fetch();
      if (allUsersCount.length < 1) {
        return false;
      } else {
        return allUsersCount.length;
      } 
  },

  isPlural: function (count) {
    return count > 1;
  }
});


Template.ClassUsers.onRendered( function() {
  text.set("");
});

Template.ClassUsers.destroyed = function () {
};
