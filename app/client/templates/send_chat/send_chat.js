/*****************************************************************************/
/* SendChat: Event Handlers */
/*****************************************************************************/
Template.SendChat.events({
});

/*****************************************************************************/
/* SendChat: Helpers */
/*****************************************************************************/
Template.SendChat.helpers({
  'classesJoinedOwner':function(){
    var classesJoined =  Classes.find({joinedUserId:{$in:[Meteor.userId()]}}).fetch();
    var classesJoinedId= lodash.map(classesJoined,'createBy');
    var classesJoinedOwner = Meteor.users.find({_id:{$in:classesJoinedId}}).fetch();
    return classesJoinedOwner;
  }
});

/*****************************************************************************/
/* SendChat: Lifecycle Hooks */
/*****************************************************************************/
Template.SendChat.created = function () {
};

Template.SendChat.rendered = function () {
  $(".js-example-basic-multiple").select2({
    tags: true,
    tokenSeparators: [',', ' '],
    width:"100%"
    });
};

Template.SendChat.destroyed = function () {
};
