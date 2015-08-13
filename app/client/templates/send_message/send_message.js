


Session.setDefault("isSelecting", false)

/*****************************************************************************/
/* SendMessage: Event Handlers */
/*****************************************************************************/
Template.SendMessage.events({
  'focus #senderInput':function(){



     Session.set("isSelecting", true);
  }
});

/*****************************************************************************/
/* SendMessage: Helpers */
/*****************************************************************************/
Template.SendMessage.helpers({
  messageBox:function(){
    return Session.get("isSelecting")?"hidden":"";
  },
  addClassBtnStatus:function(){
    return Session.get("isSelecting")?"hidden":"";
  },
  doneClassBtnStatus:function(){
    return Session.get("isSelecting")?"":"hidden";
  },
  checkbox:function(){
    return Session.get("isSelecting")?"":"hidden";
  },

});

/*****************************************************************************/
/* SendMessage: Lifecycle Hooks */
/*****************************************************************************/
Template.SendMessage.created = function () {
};

Template.SendMessage.rendered = function () {
  $(".js-example-basic-multiple").select2({
    tags: true,
    tokenSeparators: [',', ' '],
    placeholder:"email/class name",
    width:"100%"
    });
};

Template.SendMessage.destroyed = function () {
};

Template.ionNavBar.events({
  'click .msgDoneClassBtn':function(e,template){
      Session.set("isSelecting", false);
    },
  'click .sendMsgBtn':function(){
    var target  = $(".js-example-basic-multiple").val();
    var msg  = $(".msgBox").val();
    Meteor.call('sendMsg',target,msg,function(){
      Router.go("Classes");
      });
  }
});
