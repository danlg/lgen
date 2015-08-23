Session.setDefault("sendMessageSelectedClasses", {selectArrName:[],selectArrId:[]});
/*var arr = [];*/
/*var selectArr = ReactiveVar("");
var selecting = ReactiveVar(false);*/

/*****************************************************************************/
/* SendMessage: Event Handlers */
/*****************************************************************************/
Template.SendMessage.events({
  /*'focus #senderInput':function(){
     selecting.set(true);
  },*/
  /*'change .targetCB':function(){
    arr = [];
    $(".targetCB:checked").each(function(index,el){
      arr.push($(el).attr("data-className"));
    })
    selectArr.set(lodash(arr).toString());
  }*/
});

/*****************************************************************************/
/* SendMessage: Helpers */
/*****************************************************************************/
Template.SendMessage.helpers({
  messageBox:function(){
    return "";
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
  isSelect:function(classCode){
      return classCode == Router.current().params.classCode?"selected":"";
  },
  selectArr:function(){
    return [];
  },
  searchObj:function(){

    if(lodash.has(Router.current().params,'classCode')){
      if(!lodash.isUndefined(Router.current().params.classCode)){
          console.log(Classes.find({classCode:Router.current().params.classCode}).fetch());
          var getDefaultClass=Classes.findOne({classCode:Router.current().params.classCode});
          console.log(getDefaultClass);
          var obj= {selectArrName:[getDefaultClass.className],selectArrId:[getDefaultClass.classCode]};

          Session.set("sendMessageSelectedClasses",obj);
      }
    }

    return Session.get('sendMessageSelectedClasses');



  },
  arrToString:function(arr){
    return lodash(arr).toString();
  }


});

/*****************************************************************************/
/* SendMessage: Lifecycle Hooks */
/*****************************************************************************/
Template.SendMessage.created = function () {


};

Template.SendMessage.rendered = function () {
  /*$(".js-example-basic-multiple").select2({
    tags: true,
    tokenSeparators: [',', ' '],
    placeholder:"email/class name",
    width:"100%"
    });*/



};

Template.SendMessage.destroyed = function () {
};

Template.ionNavBar.events({
  'click .sendMsgBtn':function(){
    /*var target  = $(".js-example-basic-multiple").val();*/
    var target  = Session.get('sendMessageSelectedClasses').selectArrId;
    var msg  = $(".msgBox").val();
    if(target!=""){
      Meteor.call('sendMsg',target,msg,function(){
        Session.set("sendMessageSelectedClasses",{selectArrName:[],selectArrId:[]});
        Router.go("Classes");
      });
    }else{
      alert("no class select!")
    }
  }
});
