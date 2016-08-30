Template.NewsgroupsNewsView.onCreated(function(){
   var self = this;
   var schoolName =  UI._globalHelpers['getCurrentSchoolName']()
   if(schoolName)
    {
        self.subscribe('newsgroupsForUser',null,null,schoolName);
        self.subscribe('newsForUser',null,null,schoolName);
    }
   });    
    
Template.NewsgroupsNewsView.helpers({
    getNews:function(){
        return Smartix.Messages.Collection.find(
            {_id: Router.current().params.msgid}
        );         
        
    },
    getGroupName:function(groupId){
        //log.info('getGroupName',groupId);
       return Smartix.Groups.Collection.findOne(groupId).name;
    }  
});

Template.NewsgroupsNewsView.events({
    'click .add-to-calendar':function(event){
        var startDate = this.startDate;
        var endDate = this.endDate;
        var eventName = this.eventName;
        var location = this.location;
        var description = $(event.target).data('description');
        Smartix.Messages.Addons.Calendar.addEvent(eventName,location,description,startDate,endDate,function(){
            toastr.info(TAPi18n.__("EventAddCalendar"));
        });
    },
    'click .content .item .content a': function (e) {
        Smartix.FileHandler.openFile(e);
        e.preventDefault();
    },
    'click .content .item .document a': function (e) {
        Smartix.FileHandler.openFile(e);
        e.preventDefault();
    } 
});

Template.NewsgroupsNewsView.onDestroyed(function(){
 Meteor.call('setAllNewsAsRead',Session.get('pickedSchoolId'));
});

