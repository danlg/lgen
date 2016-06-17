/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var text = ReactiveVar('');
// var classObj = ReactiveVar({});
/*****************************************************************************/
/* ClassUsers: Event Handlers */
/*****************************************************************************/
Template.ClassUsers.onCreated(function(){
        var self = this;
        self.subscribe('smartix:classes/classByClassCode', Router.current().params.classCode);
        self.subscribe('smartix:classes/allUsersWhoHaveJoinedYourClasses');
        self.subscribe('smartix:classes/distributionListsOfClass', Router.current().params.classCode);
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
    var classObj = Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    });
    var userArray = classObj.users;
    //select users from Meteor who is not current user and has joined this class
    var users = Meteor.users.find({$and: [{_id: { $ne: Meteor.userId()}}, {_id: {$in: userArray}}] }, 
                {sort: { 'profile.lastName': 1, 'profile.firstName': 1}} ).fetch();    
    return users;
  },
  distributionList:function(){
        var classObj = Smartix.Groups.Collection.findOne({
            type: 'class',
            classCode: Router.current().params.classCode
        });
        var distributionListArray = classObj.distributionLists;
        var distributionLists = Smartix.Groups.Collection.find({
                    _id: {$in: distributionListArray},
                    type: 'distributionList'
        });
        return distributionLists;
    },
  
  usersInList: function(listId){
      var userArray = listId.users;
      var users = Meteor.users.find({$and: [{_id: { $ne: Meteor.userId()}}, {_id: {$in: userArray}}] } ).fetch();    
      return users;
  },
  
  isDistribution: function()
  {
    var classObj = Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    });
    return (classObj.distributionLists ?  true : false);
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
    var classObj = Smartix.Groups.Collection.find({
        type: 'class',
        classCode: Router.current().params.classCode
    }).fetch();
    var userArray = classObj.users;
    //select users from Meteor who is not current user and has joined this class
    return Meteor.users.find({$and: [{_id: { $ne: Meteor.userId()}}, {_id: {$in: userArray}}] }).count() == 0 ;
  },

  classObj: function (argument) {
    return Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    });
  },

  allUsersCount: function(){
      var allUsersCount = Meteor.users.find({
        _id: {$nin: [Meteor.userId()]}}
        ).count();
     if (allUsersCount.length < 1) {
       return false;
     } else {
       return allUsersCount;
     } 
  },

  isPlural: function (count) {
    return count > 1;
  }
});

/*****************************************************************************/
/* ClassUsers: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassUsers.created = function () {
  // classObj.set(Smartix.Groups.Collection.findOne({type: 'class', classCode:Router.current().params.classCode}));
};

Template.ClassUsers.rendered = function () {
  text.set("");
};

Template.ClassUsers.destroyed = function () {
};
