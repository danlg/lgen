/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

var targetStringVar = ReactiveVar([]);
var targetString = [];
var targetIds = ReactiveVar([]);
var searchString = ReactiveVar("");

Template.GroupChatInviteChooser.onCreated(function(){
  Meteor.subscribe('smartix:classes/otherClassmates', Router.current().params.classCode);
});

Template.GroupChatInviteChooser.events({
    'click .checkAllBtn':function(e){
        var checkboxes = $("input[type='checkbox']");
        var checkAllBtn = $(e.target);
        if(checkAllBtn.hasClass('IsChecked')) {                 
          checkboxes.prop('checked', false);
          checkAllBtn.removeClass('IsChecked');
        } else {        
          checkboxes.prop('checked', true);
          checkAllBtn.addClass('IsChecked');
        }     
        var checkboxes = $("input[type='checkbox']");
        checkboxes.map(function(){
            //only add the user id if the checkbox is checked
            if(this.checked){
                selectedChatIds.push(this.value);                
            }
        }); 
        targetIds.set(selectedChatIds);                  
    },
    'click .createChatBtn':function(){
        var selectedChatIds = targetIds.get();
        var chatObjExtra = {
            chatRoomAvatar: Session.get('chosenIconForGroupChat'),
            chatRoomName: document.getElementById("group-chatroom-name").value,
            chatRoomModerator: Meteor.userId()
        };
        
        Meteor.call('chatCreate', selectedChatIds, chatObjExtra, Router.current().params.school,  function (err, data) {
         Router.go('ChatRoom', {chatRoomId: data});
         targetIds.set([]); 
         Session.set('chosenIconForGroupChat','');
        });        
    },
    'change .targetCB': function (e) {
        log.info('change');
        var selectedChatIds = [];
        var checkboxes = $("input[type='checkbox']");
        checkboxes.map(function(){
            //only add the user id if the checkbox is checked
            if(this.checked){
                selectedChatIds.push(this.value);                
            }
        }); 
        targetIds.set(selectedChatIds);
        log.info(targetIds.get());
    },
    'click #pick-an-icon-btn':function(){
      var parentDataContext= {iconListToGet:"iconListForClass",sessionToBeSet:"chosenIconForGroupChat"};
      IonModal.open("ClassIconChoose", parentDataContext);
    }    
});
Template.GroupChatInviteChooser.helpers({
  'joinedClassPeople': function () {
     var joinedClassPeople = Meteor.users.find({_id: {$nin: [Meteor.userId()]}}, {sort: { 'profile.lastName': 1, 'profile.firstName': 1}}).fetch();
     if (joinedClassPeople.length < 1) {
       return false;
     } else {
       return joinedClassPeople;
     }
  }
});

Template.GroupChatInviteWrapper.helpers({
  shouldDisplay: function () {
      //log.info("here");
    var selectedChatIds = targetIds.get();     
    //log.info(selectedChatIds.length)
    return selectedChatIds.length > 1 ? "" : "hide";
  } , getYouAvatar:function(){
    var chosenIcon = Session.get('chosenIconForGroupChat');
    if(chosenIcon){
      return chosenIcon;
    }
  } 
    
});

Template.GroupChatInviteChooserEachPerson.helpers({
    'isEmoji': function (userId) {
        if(Meteor.users.findOne(userId).profile.avatarType)
            return (Meteor.users.findOne(userId).profile.avatarType==="emoji") ? true: false;   
        else 
            return true;
    }
});

Template.GroupChatInviteChooser.destroyed = function () {
 targetStringVar = ReactiveVar([]);
 targetString = [];
 targetIds = ReactiveVar([]);
 searchString = ReactiveVar("");   
};