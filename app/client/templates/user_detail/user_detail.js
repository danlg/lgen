/*****************************************************************************/
/* UserDetail: Event Handlers */
/*****************************************************************************/
Template.UserDetail.events({
  'click .talkToBtn':function (e) {
    var targetIds=[Router.current().params._id];
    Meteor.call('chat/create',targetIds,function(err,data){
          Router.go('ChatRoom',{chatRoomId:data});
      });
  }
});

/*****************************************************************************/
/* UserDetail: Helpers */
/*****************************************************************************/
Template.UserDetail.helpers({
  userPofile:function(){
    return Meteor.users.findOne({_id:Router.current().params._id})
  },
  hisJoinedClasses:Classes.find(),
  userId:function (argument) {
    return Router.current().params._id;
  }

});

/*****************************************************************************/
/* UserDetail: Lifecycle Hooks */
/*****************************************************************************/
Template.UserDetail.created = function () {
};

Template.UserDetail.rendered = function () {
};

Template.UserDetail.destroyed = function () {
};
