Template.AttendanceHome.onCreated(function(){
    var self = this;
    this.subscribe('userRelationships', Meteor.userId());
    this.subscribe('mySchools',function(){
        self.schoolId = UI._globalHelpers['getCurrentSchoolId']();
        self.subscribe('smartix:absence/parentGetChildProcessed', self.schoolId);
    });
    this.subscribe('allSchoolUsersPerRole',UI._globalHelpers['getCurrentSchoolName']());
});

Template.AttendanceHome.helpers({
    getProcessId:function(){
      return this._id;  
    },
    attendanceRecordProcessedRequests:function(){
       return Smartix.Absence.Collections.processed.find({namespace:UI._globalHelpers['getCurrentSchoolId'](),status:'missing'});
    },
    getUserById: function(userId) {
        var targetUserObj = Meteor.users.findOne(userId);
        return targetUserObj;
    }
});

Template.AttendanceHome.onDestroyed(function(){
    //log.info(this.schoolId);
    Meteor.call('setAttendanceAsRead',this.schoolId, 'attendanceToParent');        
});

Template.AttendanceHome.events({
   
   'click .i-dont-know-btn':function(event,template){
     var processId = $(event.target).data('id');  
     //TODO: do something
    } 
});