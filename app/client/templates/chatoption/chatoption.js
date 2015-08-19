/*var selectedClass=[];*/
Session.setDefault('selectedClass',[]);
Session.setDefault('workhourcheck',null);

/*****************************************************************************/
/* Chatoption: Event Handlers */
/*****************************************************************************/
Template.Chatoption.events({
  'change .classCb':function(){
    selectedClass = [];
    $('.classCb:checked').each(function(){
        selectedClass.push($(this).val());
    })
    Session.set('selectedClass',selectedClass);
  },
  'click .checkall':function(){
    $('.classCb').each(function(){
        $(this).attr('checked', 'checked');
    })
  },
  'change #checkworkhour':function(){
      $(".workHourTimeCol").toggle();
      Session.set('workhourcheck',$("#checkworkhour")[0].checked);
  }
});

/*****************************************************************************/
/* Chatoption: Helpers */
/*****************************************************************************/
Template.Chatoption.helpers({
  chatSetting:Schema.chatSetting,
  createdClassByMe:Classes.find(),
  chatSettingObj : function(){
    return Session.get('workHour');
  },
  ishide:function(){

    if(Session.get('workhourcheck')!=null)
      return Session.get('workhourcheck')?"":"shouldhide";

    if(!lodash.has(Meteor.user()["profile.chatSetting.workHour"])){
      return "shouldhide";
    }else{
      return Meteor.user().profile.chatSetting.workHour?"":"shouldhide";
    }

  },
  workhourcheck:function(){
    return Session.get('workhourcheck');
  }

});

/*****************************************************************************/
/* Chatoption: Lifecycle Hooks */
/*****************************************************************************/
Template.Chatoption.created = function () {
  Session.set('workHour', Meteor.user().profile.chatSetting );

  if(Session.get('workhourcheck')==null){
    if(!lodash.has(Meteor.user()["profile.chatSetting.workHour"])){
      Session.set('workhourcheck',false)
    }else{
      Session.set('workhourcheck',Meteor.user().profile.chatSetting.workHour);
    }
  }

};

Template.Chatoption.rendered = function () {
};

Template.Chatoption.destroyed = function () {
  
};

Template.ionNavBar.events({
  'click .ChatoptionSave':function(e,template){
    AutoForm.submitFormById("#chatOptionUpdate");
  }
});
