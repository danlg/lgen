Template.NewsgroupsNewsList.onCreated(function(){
    var self = this;
    var schoolId = UI._globalHelpers['getCurrentSchoolId']();
    if(schoolId){
        self.autorun(function(){
            self.subscribe('newsgroupsForUser',null,null,schoolId);
            self.subscribe('newsForUser',null,null,schoolId);
        }); 
    }
});

Template.NewsgroupsNewsList.helpers({
    getNews:function(){
        return Smartix.Messages.Collection.find(
            { },
            { sort: { createdAt: -1} } );//for news, sorted by most recent first
    },

    getGroupName:function(groupId){
        //log.info('getGroupName',groupId);
       return Smartix.Groups.Collection.findOne(groupId).name;
    }
});

Template.NewsgroupsNewsList.events({
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

Template.NewsgroupsNewsList.onDestroyed(function(){
    Meteor.call('setAllNewsAsRead',Session.get('pickedSchoolId'));
});

