/*****************************************************************************/
/* ChatInvite: Event Handlers */
/*****************************************************************************/
Template.ChatInvite.events({
  'click .startChatBtn':function(){
    var chatArr =  $('.js-example-basic-multiple').val();
    Meteor.call('chat/create',chatArr,function(err,data){
          Router.go('ChatRoom',{chatRoomId:data});
      });

    /*console.log($('.js-example-basic-multiple').val());*/
  }
});

/*****************************************************************************/
/* ChatInvite: Helpers */
/*****************************************************************************/
Template.ChatInvite.helpers({
  'classesJoinedOwner':function(){
    var classesJoinedOwner = Meteor.users.find({_id:{$nin:[Meteor.userId()]}}).fetch();
    return classesJoinedOwner;
  }
});

/*****************************************************************************/
/* ChatInvite: Lifecycle Hooks */
/*****************************************************************************/
Template.ChatInvite.created = function () {
};

Template.ChatInvite.rendered = function () {
  $(".js-example-basic-multiple").select2({
    tags: true,
    tokenSeparators: [',', ' '],
    width:"100%"
    });
};

Template.ChatInvite.destroyed = function () {
};
