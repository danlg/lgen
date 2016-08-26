/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

Template.ClassAttendance.onCreated(function(){
    var self = this;
    this.autorun(function(){
      self.subscribe('smartix:classes/classByClassCode', Router.current().params.classCode);
      self.subscribe('smartix:classes/classMembers', Router.current().params.classCode);
    })
});

Template.ClassAttendance.onRendered( function() {
});

Template.ClassAttendance.destroyed = function () { };

Template.ClassUsers.events({
 
});

/*****************************************************************************/
/* ClassUsers: Helpers */
/*****************************************************************************/
Template.ClassAttendance.helpers({
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
  
  isEmoji: function(userObj)
  {
      return (userObj.profile.avatarType === 'emoji') ? true : false;
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
  
  emptyList: function () {
    //select users from Meteor who is not current user and has joined this class
    return Meteor.users.find().count() === 0 ;
  },

  classObj: function () {
    return Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    });
  }
});