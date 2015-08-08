/*****************************************************************************/
/* ClassUsers: Event Handlers */
/*****************************************************************************/
Template.ClassUsers.events({
});

/*****************************************************************************/
/* ClassUsers: Helpers */
/*****************************************************************************/
Template.ClassUsers.helpers({
  usersProfile : function(){
    return Meteor.users.find({_id:{$in:this.classObj.joinedUserId}}).fetch()
  }
});

/*****************************************************************************/
/* ClassUsers: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassUsers.created = function () {
};

Template.ClassUsers.rendered = function () {
};

Template.ClassUsers.destroyed = function () {
};
