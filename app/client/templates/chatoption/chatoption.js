/*var selectedClass=[];*/
// Session.setDefault('selectedClass',[]);
// Session.setDefault('workhourcheck',false);


/*****************************************************************************/
/* Chatoption: Event Handlers */
/*****************************************************************************/
Template.Chatoption.events({
  // 'change .classCb':function(){
  //   selectedClass = [];
  //   $('.classCb:checked').each(function(){
  //       selectedClass.push($(this).val());
  //   });
  //   Session.set('selectedClass',selectedClass);
  // },
  // 'click .checkall':function(){
  //   $('.classCb').each(function(){
  //       $(this).attr('checked', 'checked');
  //   });
  // },
  // 'change #checkworkhour':function(){
  //     $(".workHourTimeCol").toggle();
  //     Session.set('workhourcheck',$("#checkworkhour")[0].checked);
  // }
  'change input':function (argument) {
    var insertDocObj = AutoForm.getFormValues("chatOptionUpdate").insertDoc;
    Session.set("optionObj", insertDocObj );
  }
});

/*****************************************************************************/
/* Chatoption: Helpers */
/*****************************************************************************/
Template.Chatoption.helpers({
  chatSetting:Schema.chatSetting,
  createdClassByMe:Classes.find(),
  optionObj:function (argument) {
    // return AutoForm.getFormValues('chatOptionUpdate');
    return Session.get('optionObj');
  },
  ishide:function (argument) {
    // if(lodash.has(Session.get('optionObj').workHour)&& Session.get('optionObj').workHour )
    //   return "";
    // else
    //   return "shouldhide";
    return Session.get('optionObj').workHour?"":"shouldhide";
  }
  // chatSettingObj : function(){
  //   return Session.get('workHour');
  // },
  // ishide:function(){
  //
  //   if(Session.get('workhourcheck'))
  //     return Session.get('workhourcheck')?"":"shouldhide";
  //
  //   if(!lodash.has(Meteor.user()["profile.chatSetting.workHour"])){
  //     return "shouldhide";
  //   }else{
  //     return Meteor.user().profile.chatSetting.workHour?"":"shouldhide";
  //   }
  //
  // },
  // workhourcheck:function(){
  //   return Session.get('workhourcheck');
  // }

});

/*****************************************************************************/
/* Chatoption: Lifecycle Hooks */
/*****************************************************************************/
Template.Chatoption.created = function () {

    Session.setDefault("optionObj",{});
    if(Meteor.user().profile.chatSetting){
      var newOptionObj = lodash.assign(Meteor.user().profile.chatSetting,Session.get("optionObj"));
      Session.set("optionObj", newOptionObj);
    }
  // Session.set('workHour', Meteor.user().profile.chatSetting );
  //
  // if(Session.get('workhourcheck')){
  //   if(!lodash.has(Meteor.user()["profile.chatSetting.workHour"])){
  //     Session.set('workhourcheck',false);
  //   }else{
  //     Session.set('workhourcheck',Meteor.user().profile.chatSetting.workHour);
  //   }
  // }

};

Template.Chatoption.rendered = function () {
};

Template.Chatoption.destroyed = function () {

};

Template.ionNavBar.events({
  'click .ChatoptionSave':function(e,template){

  },
  'click .ChatoptionCancel':function (argument) {
    AutoForm.submitFormById("#chatOptionUpdate");
  }
});
