Meteor.publish('mySchools', function() {
    if (this.userId) {
        var currentUserId = this.userId;
        var currentUser = Meteor.users.findOne({ _id: currentUserId });
        if (currentUser.roles) {
            var schoolIds = Object.keys(currentUser.roles);
            return SmartixSchoolsCol.find({ _id: { $in: schoolIds } });
        }
    }
});

Meteor.publish('allSchools',function(){
    //TODO 
});

Meteor.publish('activeSchools',function(){
    //TODO    
});