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

Meteor.publish('allSchoolUsersPerRole', function (school) {
    // Get the `_id` of the school from its username
    var schoolDoc = SmartixSchoolsCol.findOne({
        username: school
    });
    
    //else, try to get by school id
    if(!schoolDoc){
            schoolDoc = SmartixSchoolsCol.findOne({
            _id: school
        });
    }
    
    if(!schoolDoc){
        console.log('allSchoolUsersPerRole: no school is found: are you in global or system namespace? they dont have school collection')
        return;
    }
    var allSchoolUsers = [];    
    //if user is a teacher:
    //can talk to another teacher
    //can talk to students who the teacher is teaching
    //can talk to parents whose students are taught by the teacher
    //can talk to students who the teacher is not teaching
    if (Roles.userIsInRole(this.userId, Smartix.Accounts.School.TEACHER, schoolDoc._id)) {

        var teachers = Roles.getUsersInRole(Smartix.Accounts.School.TEACHER, schoolDoc._id).fetch();
        var students = Roles.getUsersInRole(Smartix.Accounts.School.STUDENT, schoolDoc._id).fetch();

        var studentsWhoTaughtByTeacher = Smartix.Groups.Collection.find({ namespace: schoolDoc._id, admins: this.userId }).fetch();

        var parents = [];
        lodash.map(studentsWhoTaughtByTeacher, 'users').map(function (studentIDs) {

            studentIDs.map(function (studentID) {
                //console.log('studentID', studentID);
                var findParents = Relationships.find({ child: studentID, namespace: schoolDoc._id }).fetch();
                //console.log('findParents', findParents);
                findParents.map(function (relationship) {
                    parents.push(relationship.parent);
                });
            });
        });      
       
        allSchoolUsers = allSchoolUsers.concat( lodash.map(teachers,'_id') );
        allSchoolUsers = allSchoolUsers.concat( lodash.map(students,'_id') );
        allSchoolUsers = allSchoolUsers.concat( parents );
        //var parents = Roles.getUsersInRole('parent',schoolDoc._id).fetch();  
        
        console.log('allSchoolUsersForTeacher',allSchoolUsers);

        //if user is a parent:
        //can talk to another parent
        //can talk to parent's own student
        //can talk to teacher, who teach to parent's own student
    } else if (Roles.userIsInRole(this.userId, 'parent', schoolDoc._id)) {
        //TODO

        //if user is a student:
        //can talk to teacher who teach the student
        //can talk to student's own parent
    } else if (Roles.userIsInRole(this.userId, 'student', schoolDoc._id)) {
        //TODO

    }

    
    if(schoolDoc) {
        return Meteor.users.find(
            { _id: { $in: allSchoolUsers } }
        );
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