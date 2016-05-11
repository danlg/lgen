Template.AttendaceList.helpers({
    getCurrentSchoolName: function() {
        return Router.current().params.school;
    },
    getAttendaceRecord:function(){
       var schoolDoc = SmartixSchoolsCol.findOne({
           username: Router.current().params.school
       });               
       
       return Smartix.Absence.Collections.expected.find({namespace:schoolDoc._id},{sort:{"dateFrom":-1}});
    },
    getUserById: function(userId) {
        var targetUserObj = Meteor.users.findOne(userId);
        return targetUserObj;
    },
    recentlyApproved:function(){
       var expectedId = this._id;
       var relatedNotification =  Notifications.findOne({eventType:'attendance',eventSubType:'attendanceApproved',expectedId: expectedId});
       return relatedNotification;
    },
    
})

Template.AttendaceList.onCreated(function(){
    var self = this;
    
    self.subscribe('userRelationships', Meteor.userId());
    self.subscribe('mySchools',function(){
       var schoolDoc = SmartixSchoolsCol.findOne({
           username: Router.current().params.school
       });        
      self.subscribe('smartix:absence/parentGetChildExpected',schoolDoc._id); 
    });    
    self.subscribe('allSchoolUsersPerRole',Router.current().params.school);
        
});

Template.AttendaceList.events({
    'click .approve-acknowledge-btn':function(event,template){
        Meteor.call('setNotificationAsRead', $(event.target).data('id') , function(err,result){
            toastr.info('School will know that you have confirmed it.')
        });
    }
})