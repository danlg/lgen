Template.AttendanceList.onCreated(function(){
    var self = this;
    this.subscribe('userRelationships', Meteor.userId());
    this.subscribe('usersFromRelationships', Meteor.userId());
    this.subscribe('mySchools',function() {
        self.schoolId = UI._globalHelpers['getCurrentSchoolId']();
        self.subscribe('smartix:absence/parentGetChildExpected', self.schoolId);
    });    
});

Template.AttendanceList.helpers({
    getAttendanceRecord:function(){
       return Smartix.Absence.Collections.expected.find({namespace:UI._globalHelpers['getCurrentSchoolId']()},{sort:{"dateFrom":-1}});
    },

    getUserById: function(userId) {
        var targetUserObj = Meteor.users.findOne(userId);
        return targetUserObj;
    },

    recentlyApproved:function(){
       var expectedId = this._id;
       var relatedNotification =  Notifications.findOne({eventType:'attendance',eventSubType:'attendanceApproved',expectedId: expectedId});
       return relatedNotification;
    }
});

Template.AttendanceList.onDestroyed(function(){
    Meteor.call('setAttendanceAsRead',this.schoolId, 'attendanceApproved');        
});

Template.AttendanceList.events({
    'click .approve-acknowledge-btn':function(event,template){
        Meteor.call('setNotificationAsRead', $(event.target).data('id') , function(err,result){
            toastr.info(TAPi18n.__("SchoolNotified"));
        });
    }
});