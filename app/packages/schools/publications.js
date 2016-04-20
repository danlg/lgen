
Meteor.publish('schoolInfo', function (schoolName) {
    if(Smartix.Accounts.School.isMember(this.userId)) {
        return SmartixSchoolsCol.find({
            username: schoolName
        });
    } else {
        this.ready();
    }
});

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
    if( Roles.userIsInRole( this.userId ,'admin','system') ){
        return SmartixSchoolsCol.find();    
    }
});

Meteor.publish('activeSchools',function(){
    if( Roles.userIsInRole( this.userId ,'admin','system') ){
        return SmartixSchoolsCol.find({active:true});    
    }   
});