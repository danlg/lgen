
Meteor.publish('schoolInfo', function (schoolName) { 
    check(schoolName, String);
    // Get school object
    let schoolObj = SmartixSchoolsCol.findOne({
        shortname: schoolName
    });
    if(schoolObj) {
        if(Smartix.Accounts.School.isMember(this.userId, schoolObj._id)) {
            return SmartixSchoolsCol.find({
                shortname: schoolName
            });
        }
    }
    this.ready();  
});

Meteor.publish('mySchools', function() {
    this.unblock();
    if (this.userId) {
        var currentUserId = this.userId;
        var currentUser = Meteor.users.findOne({ _id: currentUserId });
        if (currentUser.roles) {
            var schoolIds = Object.keys(currentUser.roles);
            return SmartixSchoolsCol.find({ _id: { $in: schoolIds } });
        }
    }
    this.ready();
});

Meteor.publish('allSchools',function(){
    if( Roles.userIsInRole( this.userId ,'sysadmin', 'global') || Roles.userIsInRole( this.userId ,'sales', 'global') ){
        return SmartixSchoolsCol.find();  
    }   
});

Meteor.publish('activeSchools',function(){
    if( Roles.userIsInRole( this.userId ,'sysadmin', 'global') ){
        return SmartixSchoolsCol.find({active:true});    
    }
});