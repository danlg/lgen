/*****************************************************************************/
/* TabYou: Event Handlers */
/*****************************************************************************/
Template.TabYou.events({
  'click .signOut':function(){
      Meteor.logout(function(){
        Router.go('language');
        })
  }
});

/*****************************************************************************/
/* TabYou: Helpers */
/*****************************************************************************/
Template.TabYou.helpers({
});

/*****************************************************************************/
/* TabYou: Lifecycle Hooks */
/*****************************************************************************/
Template.TabYou.created = function () {
};

Template.TabYou.rendered = function () {
};

Template.TabYou.destroyed = function () {
};
