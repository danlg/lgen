Template.AttendanceRecordAdd.onCreated(function(){
    
    var self = this;

    self.subscribe('userRelationships', Meteor.userId());
    self.subscribe('mySchools');    
    self.subscribe('allSchoolUsersPerRole',Router.current().params.school);
    
});

Template.AttendanceRecordAdd.events({
   
   'click .apply-leave-btn':function(){
       var schoolDoc = SmartixSchoolsCol.findOne({
           username: Router.current().params.school
       });
       var applyLeaveObj ={
            namespace: schoolDoc._id,
            leaveReason: $('#leave-reason').val(),
            startDate:$('#start-date').val(),
            startDateTime:$('#start-date-time').val(),
            endDate:$('#end-date').val(),
            endDateTime:$('#end-date-time').val(),
            studentId: document.getElementById("children-id").value       
       }
       
       //console.log(applyLeaveObj);
       
       
       var transformObj = {
           namespace: applyLeaveObj.namespace,
           studentId: applyLeaveObj.studentId,
           reporterId: Meteor.userId(),
           dateFrom: moment( new Date( applyLeaveObj.startDate + " " + applyLeaveObj.startDateTime +" GMT+0800" ) ).unix(),
           dateTo: moment( new Date( applyLeaveObj.endDate + " " + applyLeaveObj.endDateTime +" GMT+0800" )     ).unix(),
           message : applyLeaveObj.leaveReason,           
           startDate :   new Date( applyLeaveObj.startDate + " " + applyLeaveObj.startDateTime +" GMT+0800" ).toUTCString() ,
           endDate:      new Date( applyLeaveObj.endDate + " " + applyLeaveObj.endDateTime +" GMT+0800" ).toUTCString()   ,   
        }
       
       //console.log(transformObj);
       
       if(transformObj.dateFrom > transformObj.dateTo){
           toastr.info('Leave start date needs to be earlier than Leave end date')
            return;
       }
       
       Meteor.call('smartix:absence/registerExpectedAbsence',transformObj);
       
       
    }
    
});

Template.AttendanceRecordAdd.helpers({
    getTodayDate : function(){
        var date = new Date();
        var formattedDate = moment(date).format('YYYY-MM-DD');
        return formattedDate;
    },
    getCurrentTime : function(){
        var date = new Date();
        var formattedTime = moment(date).format('HH:mm');
        return formattedTime;
    },
    getDefaultStartDateTime:function(){
      return "08:00";  
    },
    getDefaultEndDateTime:function(){
      return "17:00"
    },
    getAllChildrens:function(){

        var schoolDoc = SmartixSchoolsCol.findOne({
            username: Router.current().params.school
        });
            
        var childs = [];
        var findChilds = Smartix.Accounts.Relationships.Collection.find({ parent: Meteor.userId(), namespace: schoolDoc._id }).fetch();
        //console.log('findParents', findParents);
        findChilds.map(function (relationship) {
            childs.push(relationship.child);
        });
        
        return childs;     
    },
    getUserById: function(userId) {
        var targetUserObj = Meteor.users.findOne(userId);
        return targetUserObj;
    }
})