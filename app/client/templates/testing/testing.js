/*****************************************************************************/
/* Testing: Event Handlers */
/*****************************************************************************/
Template.Testing.events({
  'click .mail':function(){
    Meteor.call('simplemail',function(err){
        err?console.log(err):"";
      });
  }
});

/*****************************************************************************/
/* Testing: Helpers */
/*****************************************************************************/
Template.Testing.helpers({
});

/*****************************************************************************/
/* Testing: Lifecycle Hooks */
/*****************************************************************************/
Template.Testing.created = function () {
};

Template.Testing.rendered = function () {


};

Template.Testing.destroyed = function () {
};
