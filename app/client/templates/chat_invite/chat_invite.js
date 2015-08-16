/*****************************************************************************/
/* ChatInvite: Event Handlers */
/*****************************************************************************/
Template.ChatInvite.events({
  'click .startChatBtn':function(){
    /*var chatArr =  $('.js-example-basic-multiple').val();*/
    Meteor.call('chat/create',chatArr,function(err,data){
          Router.go('ChatRoom',{chatRoomId:data});
      });

    /*console.log($('.js-example-basic-multiple').val());*/
  },
  /*'change .teacher':function(){
      chatArr=[];
    $(".teacher:checked").each(function(index,el){
      var id = $(el).val();
      console.log(id);
      console.log( _.find(classesJoinedOwner, { _id: id }) )
    })
  }*/


});

/*****************************************************************************/
/* ChatInvite: Helpers */
/*****************************************************************************/
Template.ChatInvite.helpers({
  /*'classesJoinedOwner':function(){
    classesJoinedOwner = Meteor.users.find({_id:{$nin:[Meteor.userId()]}}).fetch();
    return classesJoinedOwner;
  },
  'chatArr':function(){
    return Session.get('chatArr');
  }*/
});

/*****************************************************************************/
/* ChatInvite: Lifecycle Hooks */
/*****************************************************************************/
Template.ChatInvite.created = function () {
  /*this.vm = new ViewModel({
    chatArr: [],
    classesJoinedOwner : function(){return Meteor.users.find({_id:{$nin:[Meteor.userId()]}}) }
  })*/
};

Template.ChatInvite.rendered = function () {
  /*$(".js-example-basic-multiple").select2({
    tags: true,
    tokenSeparators: [',', ' '],
    width:"100%"
    });*/

};

Template.ChatInvite.destroyed = function () {
};



Template.ChatInvite.onRendered('ChatInvite',{
  classesJoinedOwner : function(){return Meteor.users.find({_id:{$nin:[Meteor.userId()]}}) }
},this);

/*Template.checkbox.onRendered( function(data) {
  console.log(data)
});*/
