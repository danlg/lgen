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
    },
    'click .createChatBtn':function(){
        var selectedChatIds = [];
        var checkboxes = $("input[type='checkbox']");
        checkboxes.map(function(){
            //only add the user id if the checkbox is checked
            if(this.checked){
                selectedChatIds.push(this.value);                
            }

        })
        Meteor.call('chatCreate', selectedChatIds, function (err, data) {
         Router.go('ChatRoom', {chatRoomId: data});
        });        
    }
});
Template.GroupChatInviteChooser.helpers({
  'joinedClassPeople': function () {
    
    var targetClass = Classes.findOne({classCode: Router.current().params.classCode});
    //log.info(targetClass);
    var result =  Meteor.users.find({
        _id :{ $in:  targetClass.joinedUserId}
    });
    
    log.info(result);
    return result;
  }
});