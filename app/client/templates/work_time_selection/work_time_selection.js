var weeks = [];
var workHourTime = {};
var from;
var to;
/*****************************************************************************/
/* WorkTimeSelection: Event Handlers */
/*****************************************************************************/
Template.WorkTimeSelection.events({
  'change .timeCb':function(){
    weeks=[];
    $('.timeCb:checked').each(function(){
      weeks.push($(this).val())
    })

    workHourTime.weeks = weeks;
    Session.set('workHourTime', workHourTime );
  },
  'change .from':function(){
    from = $('.from').val();
    workHourTime.from = from;
    Session.set('workHourTime', workHourTime );

  },
  'change .to':function(){
    to = $('.to').val();
    workHourTime.to = to;
    Session.set('workHourTime', workHourTime );
  }
});

/*****************************************************************************/
/* WorkTimeSelection: Helpers */
/*****************************************************************************/
Template.WorkTimeSelection.helpers({
  checked:function(week){
    return lodash.includes(weeks,week)?"checked":"";
  }
});

/*****************************************************************************/
/* WorkTimeSelection: Lifecycle Hooks */
/*****************************************************************************/
Template.WorkTimeSelection.created = function () {
  weeks = function(){
    if(!lodash.has(Meteor.user()["profile.chatSetting.workHourTime.weeks"]))
      return []
    else
      Meteor.user().profile.chatSetting.workHourTime.weeks;
  }
};

Template.WorkTimeSelection.rendered = function () {

};

Template.WorkTimeSelection.destroyed = function () {
};

Template.ionNavBar.events({
  'click .WorkTimeSelectionSaveBtn':function(e,template){
    Router.go('Chatoption');
  }
});
