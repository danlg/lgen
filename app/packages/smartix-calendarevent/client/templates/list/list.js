//TODO:

//1. get all messages that have calendar addons that user is in the group
//db.getCollection('smartix:messages').find({'addons.type':'calendar',group:{ $in: usergroups}})

//2. display them like the list view shown in github

Template.CalendarListView.onCreated(function(){
   
   var self = this;
   self.subscribe('newsgroupsForUser',null,null,Session.get('pickedSchoolId'),function(){
      self.subscribe('newsForUser',null,null,Session.get('pickedSchoolId'));
   });    

});

Template.CalendarListView.helpers({
    
    getEvents:function(){
        var newsgroups =  Smartix.Groups.Collection.find({ type: 'newsgroup', users: Meteor.userId() }).fetch(); 
        var newsgroupsIds = lodash.map(newsgroups,'_id');
        
        //sort by event startDate in ascending order. Older events is displayed first.
        //TODO. only showing incoming / ongoing event, filter out past event
        
        return Smartix.Messages.Collection.find({$or:[
            {
                'addons.type':'calendar',
                group: { $in: newsgroupsIds },
                hidden : false,
                deletedAt:"",

            },
            {
                'addons.type':'calendar',
                group: { $in: newsgroupsIds },
                hidden: false,
                deletedAt: { $exists: false },
                 
            }
        ]}
        , {sort: {'addons.calendar.startDate': 1 } }
        );  
                
    },
    getGroupName:function(groupId){
        console.log('getGroupName',groupId);
       return Smartix.Groups.Collection.findOne(groupId).name;
    },
    getCalendar:function(){
        var calendarObjs =lodash.filter(this.addons, function(addon) { return addon.type =='calendar'; });
        return calendarObjs[0];       
    },
    calendarTime:function(date){   
        return moment(date).calendar();
    },
    isAllDayEvent: function(){
        console.log('isAllDayEvent', 'startDate:',this.startDate,'endDate:', this.endDate);
        return (this.startDate.getTime() === this.endDate.getTime())
    }
    
});

Template.CalendarListView.events({

  'click .add-to-calendar':function(event){
      var startDate = this.startDate;
      var endDate = this.endDate;
      var eventName = this.eventName;
      var location = this.location;
      var description = $(event.target).data('description');
      
      Smartix.Messages.Addons.Calendar.addEvent(eventName,location,description,startDate,endDate,function(){
         toastr.info('Event added to your calendar'); 
      });
  }    
    
});