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
    } 
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