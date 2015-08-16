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
});

/*****************************************************************************/
/* WorkTimeSelection: Lifecycle Hooks */
/*****************************************************************************/
Template.WorkTimeSelection.created = function () {
};

Template.WorkTimeSelection.rendered = function () {

};

Template.WorkTimeSelection.destroyed = function () {
};

Template.ionNavBar.events({
  'click .WorkTimeSelectionSaveBtn':function(e,template){
    workHourTime.from =  
    console.log(Session.get('workHourTime'));
    Router.go('Chatoption');
  }
});
