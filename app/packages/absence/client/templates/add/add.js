Template.AttendanceRecordAdd.onCreated(function(){
    
    var self = this;

    self.subscribe('userRelationships', Meteor.userId());
    self.subscribe('mySchools');    
    self.subscribe('allSchoolUsersPerRole',Router.current().params.school);
    
});

Template.AttendanceRecordAdd.events({
   
   'click .apply-leave-btn':function(){
       var applyLeaveObj ={
            leaveReason: $('#leave-reason').val(),
            startDate:$('#start-date').val(),
            startDateTime:$('#start-date-time').val(),
            endDate:$('#end-date').val(),
            endDateTime:$('#end-date-time').val()        
       }
       
       console.log(applyLeaveObj);
       
       
       var transformObj = {
           leaveReason : applyLeaveObj.leaveReason,
           startDateUnixTime: moment( new Date( applyLeaveObj.startDate + " " + applyLeaveObj.startDateTime +" GMT+0800" ) ).unix(),
           endDateUnixTime: moment( new Date( applyLeaveObj.endDate + " " + applyLeaveObj.endDateTime +" GMT+0800" )     ).unix(),
           startDate :   new Date( applyLeaveObj.startDate + " " + applyLeaveObj.startDateTime +" GMT+0800" ).toUTCString() ,
           endDate:      new Date( applyLeaveObj.endDate + " " + applyLeaveObj.endDateTime +" GMT+0800" ).toUTCString()      
       }
       
       console.log(transformObj);
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