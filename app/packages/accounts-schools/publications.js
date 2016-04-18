Meteor.publish('userPendingApprovedSchools', function(){
   var currentUserId = this.userId;
   return Meteor.users.find({_id: currentUserId},{fields:{schools: 1}});   
});

Meteor.publish('allSchoolUsers', function (school) {
    // Check if the user has permission for this school
    Smartix.Accounts.isUserSchoolAdmin(school, this.userId);
    
    // Get the `_id` of the school from its username
    var schoolDoc = SmartixSchoolsCol.findOne({
        username: school
    });
    
    if(schoolDoc) {
        return Meteor.users.find({
            schools: schoolDoc._id
        });
    } else {
        this.ready();
    }
});

Meteor.publish('schoolUser', function (school, userId) {
    // Check if the user has permission for this school
    Smartix.Accounts.isUserSchoolAdmin(school, this.userId);
    
    // Get the `_id` of the school from its username
    var schoolDoc = SmartixSchoolsCol.findOne({
        username: school
    });
    
    if(schoolDoc) {
        return Meteor.users.find({
            _id: userId,
            schools: schoolDoc._id
        });
    } else {
        this.ready();
    }
});