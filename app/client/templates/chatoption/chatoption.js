var selectedClass=[];
/*****************************************************************************/
/* Chatoption: Event Handlers */
/*****************************************************************************/
Template.Chatoption.events({
  'change .classCb':function(){
    selectedClass = [];
    $('.classCb:checked').each(function(){
        selectedClass.push($(this).val());
    })
  },
  'click .checkall':function(){
    $('.classCb').each(function(){
        $(this).attr('checked', 'checked');
    })
  }
});

/*****************************************************************************/
/* Chatoption: Helpers */
/*****************************************************************************/
Template.Chatoption.helpers({
  chatSetting:Schema.chatSetting,
  createdClassByMe:Classes.find(),
  chatSettingObj : Session.get('workHourTime'),
});

/*****************************************************************************/
/* Chatoption: Lifecycle Hooks */
/*****************************************************************************/
Template.Chatoption.created = function () {
};

Template.Chatoption.rendered = function () {
  Session.set('workHourTime', Meteor.user().profile.chatSetting );
};

Template.Chatoption.destroyed = function () {
};

Template.ionNavBar.events({
  'click .ChatoptionSave':function(e,template){
    AutoForm.submitFormById("#chatOptionUpdate");
    /*Router.go('Chatoption');*/
  }
});
