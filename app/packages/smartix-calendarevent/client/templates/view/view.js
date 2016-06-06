Template.CalendarDisplay.helpers({
    isAllDayEvent: function(){
        //log.info('isAllDayEvent', 'startDate:',this.startDate,'endDate:', this.endDate);
        return (this.startDate.getTime() === this.endDate.getTime())
    },
    calendarTime:function(date){   
        return moment(date).calendar();
    },  
});