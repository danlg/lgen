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

Meteor.publish('userStatus', function(schoolId) {
    //log.info("userStatus", schoolId);
    //let options = { online: false };// we filter status on client side
    let schoolUsersStatusCursor = Smartix.Accounts.School.getAllSchoolUsersStatus(
        schoolId,
        this.userId
        //, options 
    );
    if (schoolUsersStatusCursor) {
        //log.info("userStatus.count", schoolUsersStatusCursor.count());
        //log.info("userStatus.fetch", schoolUsersStatusCursor.fetch());
        return schoolUsersStatusCursor;
    }
    else {
        this.ready();
    }
});


var getContactsForAdmins = function(userId, schoolDoc)
{
    if ( Roles.userIsInRole(userId, Smartix.Accounts.School.ADMIN, schoolDoc._id) ) {
        let allUsers = Meteor.users.find(
            {schools: schoolDoc._id}, { '_id': 1}
        ).fetch();
        return lodash.map(allUsers,'_id')
    }
};

var getContactsForTeachers = function(userId, schoolDoc)
{
    if (Roles.userIsInRole(userId, Smartix.Accounts.School.TEACHER, schoolDoc._id)
    //if user is in global, check if user
    || Roles.userIsInRole(userId, 'user', schoolDoc._id)) {
        //can talk to students who the teacher is teaching
        //let students = Roles.getUsersInRole(Smartix.Accounts.School.STUDENT, schoolDoc._id).fetch();
        let teachers = [];//it is actual the class owner if role 'user'
        let admins   = [];
        let classesTaughtByTeacher = Smartix.Groups.Collection.find({ namespace: schoolDoc._id, admins: userId }).fetch();
        let studentsWhoTaughtByTeacher = [];
        let parents = [];

        //can talk to parents whose students are taught by the teacher if there is a relationship
        //none for 'global' school / 'user' role will not go inside this loop
        lodash.map(classesTaughtByTeacher, 'users').map(function (studentIDs) {
            studentIDs.map(function (studentID) {
                studentsWhoTaughtByTeacher.push(studentID);
                let findParents = Smartix.Accounts.Relationships.Collection.find({ child: studentID, namespace: schoolDoc._id }).fetch();
                //log.info('findParents', findParents);
                if(findParents)
                {
                    findParents.map(function (relationship) {
                        parents.push(relationship.parent);
                    });
                }
            });
        });
        //find other teachers, admins and students in distributionLists
        // teacher to teacher is only for "real" school
        if(schoolDoc._id !== 'global')
        {
            teachers = Roles.getUsersInRole(Smartix.Accounts.School.TEACHER, schoolDoc._id).fetch();
            admins = Roles.getUsersInRole(Smartix.Accounts.School.ADMIN, schoolDoc._id).fetch();        
            //get students and parents from distributionLists
            lodash.map(classesTaughtByTeacher, 'distributionLists').map(function (listIds) {
                if(listIds){
                    listIds.map(function(listId){
                        if(listId)
                        {
                            let listOfStudents = Smartix.Groups.Collection.find({ namespace: schoolDoc._id, _id: listId }).fetch();
                            lodash.map(listOfStudents, 'users').map(function(studentIDs)
                            {
                                studentIDs.map(function (studentID) {
                                    studentsWhoTaughtByTeacher.push(studentID);
                                    let findParents = Smartix.Accounts.Relationships.Collection.find({ child: studentID, namespace: schoolDoc._id }).fetch();
                                    findParents.map(function (relationship) {
                                        parents.push(relationship.parent);
                                    });
                                });
                            });
                        }
                    });
                }
            });
        }
        let allUsers = [];
        allUsers = allUsers.concat( lodash.map(teachers,'_id') );
        allUsers = allUsers.concat( lodash.map(admins,'_id') );
        allUsers = allUsers.concat( lodash.map(studentsWhoTaughtByTeacher) );
        allUsers = allUsers.concat( parents );
        return allUsers;
    }
    //var parents = Roles.getUsersInRole('parent',schoolDoc._id).fetch();
    //log.info('allSchoolUsersForTeacher',allSchoolUsers);
};

var getContactsForParents = function(userId, schoolDoc)
{
    //if user is a parent:
    //can talk to another parent    //can talk to parent's own childs
    //can talk to teacher, who teach to parent's own student 
    if (Roles.userIsInRole(userId, Smartix.Accounts.School.PARENT, schoolDoc._id)) {
        // let parents = Roles.getUsersInRole(Smartix.Accounts.School.PARENT, schoolDoc._id).fetch();
        //can talk to parent's own student
        let admins = Roles.getUsersInRole(Smartix.Accounts.School.ADMIN, schoolDoc._id).fetch();
        let childs = [];
        let findChilds = Smartix.Accounts.Relationships.Collection.find({ parent: userId, namespace: schoolDoc._id }).fetch();
        //log.info('findParents', findParents);
        findChilds.map(function (relationship) {
            childs.push(relationship.child);
        });
        //can talk to teacher, who teach to parent's own student
        let distributionLists = [];
        childs.map(function(childId)
        {
            distributionLists.push(Smartix.DistributionLists.getDistributionListsOfUser(childId));
        });
        let groupsStudentsIn = Smartix.Groups.Collection.find({ namespace: schoolDoc._id,            
            $or: [{
                    users: { $in: childs }
                }, {
                    distributionLists: {
                        $in: distributionLists
                    }
                }]
            , type: 'class'  }).fetch();        
        let teachers = [];
        teachers = lodash.flatten( lodash.map(groupsStudentsIn, 'admins') );
        let parents = [];
        lodash.map(groupsStudentsIn, 'users').map(function (studentIDs) {
            studentIDs.map(function (studentID) {
                //log.info('studentID', studentID);
                let findParents = Smartix.Accounts.Relationships.Collection.find({ child: studentID, namespace: schoolDoc._id }).fetch();
                //log.info('findParents', findParents);
                findParents.map(function (relationship) {
                    parents.push(relationship.parent);
                });
            });
        });
        let allUsers = [];
        allUsers = allUsers.concat( parents );
        allUsers = allUsers.concat( childs );
        allUsers = allUsers.concat( teachers );
        allUsers = allUsers.concat( lodash.map(admins,'_id') )
        return allUsers;
    }
};

var getContactsForStudents = function(userId, schoolDoc)
{
    //can talk to teacher who teach the student
    //can talk to students' own parent
    if (Roles.userIsInRole(userId, Smartix.Accounts.School.STUDENT, schoolDoc._id) 
    //if user is in global, check for teachers of class
    || Roles.userIsInRole(userId, 'user', schoolDoc._id)) {
        let studentID = userId;
        let teacherOfClass = [];
        let findAdminsOfClass = Smartix.Class.AdminsOfJoinedClasses(studentID, schoolDoc.username);
        findAdminsOfClass.map(function(teacher)
        {
            teacherOfClass.push(teacher._id);
        })
        let parents = [];
        let findParents = Smartix.Accounts.Relationships.Collection.find({ child: studentID, namespace: schoolDoc._id }).fetch();
        findParents.map(function (relationship) {
            parents.push(relationship.parent);
        });
        let allUsers = [];
        allUsers = allUsers.concat(teacherOfClass);
        allUsers = allUsers.concat(parents);
        return allUsers;
    }
};

Meteor.publish('allSchoolUsersPerRole', function (school) {
    // Get the `_id` of the school from its username
    var schoolDoc = SmartixSchoolsCol.findOne({
        shortname: school
    });
    //else, try to get by school id
    if(!schoolDoc){
            schoolDoc = SmartixSchoolsCol.findOne({
            _id: school
        });
    }
    if(!schoolDoc){
        log.info('allSchoolUsersPerRole: no school is found: are you in global or system namespace? they dont have school collection');
        return;
    }
    var allSchoolUsers = [];
    allSchoolUsers = allSchoolUsers.concat(getContactsForAdmins(this.userId, schoolDoc));
    allSchoolUsers = allSchoolUsers.concat(getContactsForTeachers(this.userId, schoolDoc));
    allSchoolUsers = allSchoolUsers.concat(getContactsForParents(this.userId, schoolDoc));
    allSchoolUsers = allSchoolUsers.concat(getContactsForStudents(this.userId, schoolDoc));
    // Returns a cursor of all users in the `allSchoolUsers` array
    if(schoolDoc) {
        // log.info("allSchoolUsers", allSchoolUsers);
        return Meteor.users.find(
            { 
                _id: { $in: allSchoolUsers }, 
                emails : {$exists:true}, $where:'this.emails.length>0'
            }
            , {
                    'profile.firstName': 1,
                    'profile.lastName': 1,
                    'profile.avatarType': 1,
                    'profile.avatarValue': 1,
                    'proflle.chatSetting' : 1,
                    'emails.0.address': 1,
                    'roles':1
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
        shortname: school
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

Meteor.publish('schoolStudents', function (schoolNamespace) {
    // Check if the user has permission for this school
    Smartix.Accounts.School.isAdmin(schoolNamespace, this.userId);
    
    return Roles.getUsersInRole(Smartix.Accounts.School.STUDENT, schoolNamespace);

});