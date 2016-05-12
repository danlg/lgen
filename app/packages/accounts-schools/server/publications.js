Meteor.publish('userPendingApprovedSchools', function(){
   var currentUserId = this.userId;
   return Meteor.users.find({_id: currentUserId},{fields:{schools: 1}});   
});

Meteor.publish('allSchoolUsers', function (schoolId) {
    let schoolUsersCursor = Smartix.Accounts.School.getAllSchoolUsers(schoolId, this.userId);
    
    if(schoolUsersCursor) {
        return schoolUsersCursor;
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
        log.info('allSchoolUsersPerRole: no school is found: are you in global or system namespace? they dont have school collection')
        return;
    }
    
    var allSchoolUsers = []; 
    //if user is a teacher:
    //can talk to another teacher
    //can talk to students who the teacher is teaching
    //can talk to parents whose students are taught by the teacher
    //can talk to students who the teacher is not teaching
    if (Roles.userIsInRole(this.userId, Smartix.Accounts.School.TEACHER, schoolDoc._id)) {
        
        //can talk to another teacher
        let teachers = Roles.getUsersInRole(Smartix.Accounts.School.TEACHER, schoolDoc._id).fetch();
        
        //can talk to students who the teacher is teaching
        //can talk to students who the teacher is not teaching
        let students = Roles.getUsersInRole(Smartix.Accounts.School.STUDENT, schoolDoc._id).fetch();
        
        //can talk to parents whose students are taught by the teacher
        let studentsWhoTaughtByTeacher = Smartix.Groups.Collection.find({ namespace: schoolDoc._id, admins: this.userId }).fetch();
        let parents = [];
        lodash.map(studentsWhoTaughtByTeacher, 'users').map(function (studentIDs) {

            studentIDs.map(function (studentID) {
                //console.log('studentID', studentID);
                let findParents = Smartix.Accounts.Relationships.Collection.find({ child: studentID, namespace: schoolDoc._id }).fetch();
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
        
        //console.log('allSchoolUsersForTeacher',allSchoolUsers);
        

    }
    
    //if user is a parent:
    //can talk to another parent
    //can talk to parent's own childs
    //can talk to teacher, who teach to parent's own student    
    if (Roles.userIsInRole(this.userId, 'parent', schoolDoc._id)) {
        
        //can talk to another parent
        let parents = Roles.getUsersInRole(Smartix.Accounts.School.PARENT, schoolDoc._id).fetch();
        
        //can talk to parent's own student
        let childs = [];
        let findChilds = Smartix.Accounts.Relationships.Collection.find({ parent: this.userId, namespace: schoolDoc._id }).fetch();
        //console.log('findParents', findParents);
        findChilds.map(function (relationship) {
            childs.push(relationship.child);
        });        
        
        //can talk to teacher, who teach to parent's own student
        let groupsStudentsIn = Smartix.Groups.Collection.find({ namespace: schoolDoc._id, users: { $in: childs }  }).fetch();        
        let teachers = [];
        teachers = lodash.flatten( lodash.map(groupsStudentsIn, 'admins') );
        
        allSchoolUsers = allSchoolUsers.concat( lodash.map(parents,'_id') );
        allSchoolUsers = allSchoolUsers.concat( childs );
        allSchoolUsers = allSchoolUsers.concat( teachers );        
        
                

    } 
    
    //if user is a student:
    //can talk to teacher who teach the student
    //can talk to student's own parent    
    if (Roles.userIsInRole(this.userId, 'student', schoolDoc._id)) {
        
        //can talk to teacher who teach the student
        //already implemented by pub smartix:classes/adminsOfJoinedClasses
        
        //can talk to students' own parent
        let studentID = this.userId;
        let parents = [];
        let findParents = Smartix.Accounts.Relationships.Collection.find({ child: studentID, namespace: schoolDoc._id }).fetch();
        findParents.map(function (relationship) {
            parents.push(relationship.parent);
        });
        
        allSchoolUsers = allSchoolUsers.concat(parents);
           
    }

    // Returns a cursor of all users in the `allSchoolUsers` array
    if(schoolDoc) {
        return Meteor.users.find(
            { _id: { $in: allSchoolUsers } }, {
                fields: { 
                    'profile.firstName': 1,
                    'profile.lastName': 1,
                    'emails.0.address': 1,
                    'roles':1
                }
            }
        );
    } else {
        this.ready();
    }
});

Meteor.publish('schoolUser', function (school, userId) {
    // Check if the user has permission for this school
    Smartix.Accounts.School.isAdmin(school, this.userId);
    
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

Meteor.publish('schoolAdmins', function (schoolNamespace) {
    // Check if the user has permission for this school
    Smartix.Accounts.School.isAdmin(schoolNamespace, this.userId);
    
    return Roles.getUsersInRole('admin', schoolNamespace);

});