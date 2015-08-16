/*****************************************************************************/
/* UserDetail: Event Handlers */
/*****************************************************************************/
Template.UserDetail.events({
});

/*****************************************************************************/
/* UserDetail: Helpers */
/*****************************************************************************/
Template.UserDetail.helpers({
  userPofile:function(){
    return Meteor.users.findOne({_id:Router.current().params._id})
  },
  hisJoinedClasses:Classes.find()
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
