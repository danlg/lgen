var weeks = [];
var workHourTime = {};
// var from;
// var to;
/*****************************************************************************/
/* WorkTimeSelection: Event Handlers */
/*****************************************************************************/
Template.WorkTimeSelection.events({
  'change .timeCb':function(){
    weeks=[];
    $('.timeCb:checked').each(function(){
      weeks.push($(this).val());
    });

    workHourTime.weeks = weeks;
    // Session.set('workHourTime', workHourTime );


    var optionObj = Session.get('optionObj');
    optionObj.workHourTime.weeks =  weeks;
    Session.set('optionObj',optionObj);

  },
  'change .from':function(){
    var optionObj = Session.get('optionObj');
    var from = $('.from').val();
    optionObj.workHourTime.from = from;
    Session.set('optionObj',optionObj);

  },
  'change .to':function(){
    var optionObj = Session.get('optionObj');
    var to = $('.to').val();
    optionObj.workHourTime.to = to;
    Session.set('optionObj',optionObj);
  }
  // 'focus #fromInput':function (argument) {
  //     $(".formplacehoder").hide();
  // },
  // 'blur #fromInput':function (argument) {
  //   if($("#fromInput").val()==="")
  //     $(".formplacehoder").show();
  // },
  // 'focus #toInput':function (argument) {
  //     $(".toplacehoder").hide();
  // },
  // 'blur #toInput':function (argument) {
  //   if($("#fromInput").val()==="")
  //     $(".toplacehoder").show();
  // }
});

/*****************************************************************************/
/* WorkTimeSelection: Helpers */
/*****************************************************************************/
Template.WorkTimeSelection.helpers({
  checked:function (week) {
    var weeks  = Session.get('optionObj').workHourTime.weeks;
    return lodash.includes(weeks,week)?"checked":"";
  },
  from:function (argument) {
    return Session.get('optionObj').workHourTime.from;
  },
  to:function (argument) {
    return Session.get('optionObj').workHourTime.to;
  }
  // checked:function(week){
  //   return lodash.includes(weeks,week)?"checked":"";
  // },
  // workHourTimeObj:function(){
  //   if(Meteor.user().profile.chatSetting.workHourTime != undefined)
  //     return Meteor.user().profile.chatSetting.workHourTime
  //   else
  //     return {}
  // }

});

/*****************************************************************************/
/* WorkTimeSelection: Lifecycle Hooks */
/*****************************************************************************/
Template.WorkTimeSelection.created = function () {

    var optionObj = Session.get('optionObj');

    if(Meteor.user()["profile.chatSetting.workHourTime"] ){
      optionObj.workHourTime = Meteor.user().profile.chatSetting.workHourTime;
      Session.set('optionObj',optionObj);
    }else if(!optionObj.workHourTime){
      var workHourTime={};
      workHourTime.from ="";
      workHourTime.to ="";
      workHourTime.weeks =[];
      optionObj.workHourTime= workHourTime;
      Session.set('optionObj',optionObj);
    }


};

Template.WorkTimeSelection.rendered = function () {

};

Template.WorkTimeSelection.destroyed = function () {
};

Template.ionNavBar.events({
  // 'click .WorkTimeSelectionSaveBtn':function(e,template){
  //   Router.go('Chatoption');
  // }
});
