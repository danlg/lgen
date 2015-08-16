/*****************************************************************************/
/* ClassPanel: Event Handlers */
/*****************************************************************************/
Template.ClassPanel.events({

    'change .chooseType':function(evt){
        var type = $(evt.target).val();
        var msgId = $(evt.target).data('mgsid');

        var classObj = Router.current().data().classObj;



        Meteor.call("updateMsgRating",type,msgId,classObj)






    }
});

/*****************************************************************************/
/* ClassPanel: Helpers */
/*****************************************************************************/
Template.ClassPanel.helpers({
  classObj:function(){
    return Classes.findOne();
  },
  classCode:function(){
    return Classes.findOne().classCode;
  }
});

/*****************************************************************************/
/* ClassPanel: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassPanel.created = function () {
};

Template.ClassPanel.rendered = function () {
};

Template.ClassPanel.destroyed = function () {
};
