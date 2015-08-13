/*****************************************************************************/
/* ClassDetail: Event Handlers */
/*****************************************************************************/
Template.ClassDetail.events({
  'change .chooseType':function(evt){
      var type = $(evt.target).val();
      var msgId = $(evt.target).data('mgsid');

      var classObj = Router.current().data().classObj;

      

      Meteor.call("updateMsgRating",type,msgId,classObj)






  }
});

/*****************************************************************************/
/* ClassDetail: Helpers */
/*****************************************************************************/
Template.ClassDetail.helpers({

});

/*****************************************************************************/
/* ClassDetail: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassDetail.created = function () {
};

Template.ClassDetail.rendered = function () {
};

Template.ClassDetail.destroyed = function () {
};
