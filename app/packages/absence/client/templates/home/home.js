Template.AttendanceHome.onCreated(function(){
    var self = this;
    this.subscribe('userRelationships', Meteor.userId());
    this.subscribe('usersFromRelationships', Meteor.userId());
    this.subscribe('mySchools',function(){
        self.schoolId = UI._globalHelpers['getCurrentSchoolId']();
        self.subscribe('smartix:absence/parentGetChildProcessed', self.schoolId);
    });
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
    },
    isAbsent: function(){
        return (this.clockIn === null) ? true : false;
    },
    isParent: function () {
        let currentUser = Meteor.user();
        schoolId = UI._globalHelpers['getCurrentSchoolId']();
        return (currentUser.roles[schoolId].indexOf(Smartix.Accounts.School.PARENT) !=-1)
    },
    
    isTeacherOrAdmin: function () {
        let currentUser = Meteor.user();
        schoolId = UI._globalHelpers['getCurrentSchoolId']();
        return (
            (currentUser.roles[schoolId].indexOf(Smartix.Accounts.School.TEACHER) !=-1) ||            
            (currentUser.roles[schoolId].indexOf(Smartix.Accounts.School.ADMIN)  !=-1) 
        )
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