
var text =  new ReactiveVar('');
var classObj;
var teacherName = ReactiveVar("");
/*****************************************************************************/
/* ClassPanel: Event Handlers */
/*****************************************************************************/
Template.ClassPanel.events({

    'change .chooseType':function(evt){
        var type = $(evt.target).val();
        var msgId = $(evt.target).data('mgsid');

        var classObj = Router.current().data().classObj;



        Meteor.call("updateMsgRating",type,msgId,classObj)






    },
    'keyup .search':function(){
        text.set($('.search').val());
        /*console.log(text.get());*/
    }
});

/*****************************************************************************/
/* ClassPanel: Helpers */
/*****************************************************************************/
Template.ClassPanel.helpers({
  classObj:function(){
    classObj=Classes.findOne();
    return classObj;
  },
  classCode:function(){
    return Classes.findOne().classCode;
  },
  isNotEmpty:function(action){
    return action.length>0;
  },
  createBy:function(){
    return classCode.createBy;
  },
  teacherName:function(){


    return teacherName.get();

  },
  className:function(){
    return classObj.className;
  },





});

/*****************************************************************************/
/* ClassPanel: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassPanel.created = function () {
};

Template.ClassPanel.rendered = function () {
  Meteor.call('getFullNameById',classObj.createBy,function(err,data){
      return teacherName.set(data);
  });

};

Template.ClassPanel.destroyed = function () {
};
