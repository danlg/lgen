/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

var targetStringVar = ReactiveVar([]);
var targetString = [];
var targetIds = ReactiveVar([]);
var searchString = ReactiveVar("");

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
        
        var selectedChatIds = [];
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
        Meteor.call('chatCreate', selectedChatIds, function (err, data) {
         Router.go('ChatRoom', {chatRoomId: data});
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
});
Template.GroupChatInviteChooser.helpers({
  'joinedClassPeople': function () {
    
    var targetClass = Classes.findOne({classCode: Router.current().params.classCode});
    //log.info(targetClass);
    var result =  Meteor.users.find({
        _id :{ $in:  targetClass.joinedUserId}
    });
    
    //log.info(result);
    return result;
  }
});

Template.GroupChatInviteWrapper.helpers({
  shouldhide: function () {
      log.info("here");
    var selectedChatIds = targetIds.get();     
    log.info(selectedChatIds.length)
    return selectedChatIds.length > 0 ? "" : "hide";
  }   
    
});