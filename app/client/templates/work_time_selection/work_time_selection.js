var weeks = [];
var workHourTime = {};

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
        var from  = Session.get('optionObj').workHourTime.from;
        if(from===""||!from){
            var optionObj = Session.get('optionObj');
            from  = moment().format("09:00");
            optionObj.workHourTime.from = from;
            Session.set('optionObj',optionObj);
        }
        return from;
    },
    to:function (argument) {
        var to  = Session.get('optionObj').workHourTime.to;
        if(to===""||!to){
            var optionObj = Session.get('optionObj');
            to  = moment().format("17:00");
            optionObj.workHourTime.to = to;
            Session.set('optionObj',optionObj);
        }
        return to;
    }

});

/*****************************************************************************/
/* WorkTimeSelection: Lifecycle Hooks */
/*****************************************************************************/
Template.WorkTimeSelection.created = function () {

    var optionObj = Session.get('optionObj');

    if(Meteor.user()["profile.chatSetting.workHourTime"] ){
        optionObj.workHourTime = Meteor.user().profile.chatSetting.workHourTime;
        Session.set('optionObj',optionObj);
    }
    else if(!optionObj.workHourTime){
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

});
