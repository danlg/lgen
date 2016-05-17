Smartix = Smartix || {};

Smartix.Messages = Smartix.Messages || {};

Smartix.Messages.Addons = Smartix.Messages.Addons || {};

Smartix.Messages.Addons.ValidTypes = Smartix.Messages.Addons.ValidTypes || [];

Smartix.Messages.Addons.Calendar = {};

Smartix.Messages.Addons.Calendar.Type = 'calendar';

Smartix.Messages.Addons.ValidTypes.push(Smartix.Messages.Addons.Calendar.Type);

Smartix.Messages.Addons.Calendar.Schema = new SimpleSchema({
    type:{
        type:String
    },
    eventName: {
        type: String
    },
    location: {
        type: String
    },
    startDate:{
        type: Date
    },
    endDate:{
        type: Date
    } 
});

Smartix.Messages.Addons.Calendar.updateNewCalendar = function (messageId, CalendarObj) {
    // Update the message
    Smartix.Messages.Collection.update({
        _id: messageId
    }, {
        $pull: {
            addons: {
                type: Smartix.Messages.Addons.Calendar.Type
            }
        }
    }, function (error, n) {
        if(!error) {
            Smartix.Messages.Collection.update({
                _id: messageId
            }, {
                $push: CalendarObj
            });
        }
    });
}

Smartix.Messages.Addons.Calendar.addEvent = function(title,eventLocation,notes,startDate,endDate,callback){
    if(Meteor.isCordova){
        window.plugins.calendar.createEvent(title,eventLocation,notes,startDate,endDate
        ,function(){
        //success callback
        if(callback){
        callback();
        }
        },function(){
        //fail callback
        log.info('Cannot add event to calendar');
        });
    }else{
     log.info('This environment does not support add calendar');
    }
}