var joinform;
var leaveform;
/*****************************************************************************/
/* JoinClass: Event Handlers */
/*****************************************************************************/
Template.JoinClass.events({
  'click .joinBtn':function(){
    $(joinform).submit();
  },
  'click .leaveBtn':function(){
    $(leaveform).submit();
  }
});

/*****************************************************************************/
/* JoinClass: Helpers */
/*****************************************************************************/
Template.JoinClass.helpers({

});

/*****************************************************************************/
/* JoinClass: Lifecycle Hooks */
/*****************************************************************************/
Template.JoinClass.created = function () {
};

Template.JoinClass.rendered = function () {
  joinform = this.$("#joinClassForm");
  leaveform = this.$("#leaveClassForm");



};

Template.JoinClass.destroyed = function () {
};

Template.ionNavBar.events({
  'click .doneClassBtn':function(e,template){
      Router.go("Classes");
    }
  });
