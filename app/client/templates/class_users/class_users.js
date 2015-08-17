var text = ReactiveVar('');
/*****************************************************************************/
/* ClassUsers: Event Handlers */
/*****************************************************************************/
Template.ClassUsers.events({
  'keyup .searchbar':function(el){
      text.set($(".searchbar").val());
  }
});

/*****************************************************************************/
/* ClassUsers: Helpers */
/*****************************************************************************/
Template.ClassUsers.helpers({
  usersProfile:function(){
    var users = Meteor.users.find({_id:{$nin:[Meteor.userId()]}}).fetch();
    return lodash.findByValuesNested(users,'profile','firstname',text.get())
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
