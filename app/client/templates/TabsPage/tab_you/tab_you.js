/*****************************************************************************/
/* TabYou: Event Handlers */
/*****************************************************************************/
Template.TabYou.events({
  'click .signOut':function(){
      Meteor.logout(
          function(err) {
              Router.go('login');
          }
      );
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
