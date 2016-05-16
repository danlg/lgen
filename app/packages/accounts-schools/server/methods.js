if(Meteor.isServer){
    Meteor.methods({
        'smartix:accounts-schools/createSchoolUser': function(email, options, schoolName, type, emailVerified, doNotifyEmail) {
            // Find school by username first
            var schoolDoc = SmartixSchoolsCol.findOne({
                username: schoolName
            });
            
            // In some occasion, it is easier to pass school id
            // e.g when school is just inserted, of which id is returned from insert method
            if(!schoolDoc) {
                schoolDoc = SmartixSchoolsCol.findOne({
                    _id: schoolName
                });   
            }
            
            if (schoolDoc) {
                return Smartix.Accounts.createUser(email, options, schoolDoc._id, type, this.userId, emailVerified, doNotifyEmail);
            } else {
                return false;
            }
        },
        'smartix:accounts-schools/assignSchoolRole': function(school, users, roles){
            if(!Smartix.Accounts.School.isAdmin(school)
                && !Smartix.Accounts.System.isAdmin()){
                return;
            }
            
            Roles.addUsersToRoles(users, roles, school);                
        }, 
        'smartix:accounts-schools/retractSchoolRole': function(school, users, roles){
            if(!Smartix.Accounts.School.isAdmin(school)
                && !Smartix.Accounts.System.isAdmin()){
                return;
            }
            
            Roles.removeUsersFromRoles(users, roles, school);            
        },
        'smartix:accounts-schools/editSchoolRole': function(school, users, roles){
            if(!Smartix.Accounts.School.isAdmin(school)
                && !Smartix.Accounts.System.isAdmin()) {
                return;
            }
            Roles.setUserRoles(users, roles, school);  
        },     
        'smartix:accounts-schools/approveSchool': function(schoolId){
            //console.log(this.userId(),schoolId);
            return Meteor.users.update({
                _id: this.userId
            }, {
                $addToSet: {
                    schools: schoolId
                }
            });
        }, 
        'smartix:accounts-schools/revokeSchool':function(schoolId){
            return Meteor.users.update({
                _id: this.userId
            }, {
                $pull: {
                    schools: schoolId
                }
            });
        },
        'smartix:accounts-schools/isUserSchoolAdmin': function (namespace, user) {
            return Smartix.Accounts.School.isAdmin(namespace, user);
        },
        'smartix:accounts-schools/importStudents': function (schoolName, data) {
            check(schoolName, String);
            check(data, [Object]);
            
            let namespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolName);
            if(namespace) {
                var doNotifyEmail = true;
                return Smartix.Accounts.School.importStudent(namespace, data, this.userId, doNotifyEmail);
            } else {
                throw new Meteor.Error("non-existent-school", "The school with the school code " + schoolName + " does not exists.");
            }
            
        },
        'smartix:accounts-schools/importParents': function (schoolName, data) {
            
            check(schoolName, String);
            check(data, [Object]);
            
            let namespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolName);
            if(namespace) {
                return Smartix.Accounts.School.importParents(namespace, data, this.userId);
            } else {
                throw new Meteor.Error("non-existent-school", "The school with the school code " + schoolName + " does not exists.");
            }
            
        },
        'smartix:accounts-schools/importTeachers': function (schoolName, data) {
            
            check(schoolName, String);
            check(data, [Object]);
            
            let namespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolName);
            if(namespace) {
                return Smartix.Accounts.School.importTeachers(namespace, data, this.userId);
            } else {
                throw new Meteor.Error("non-existent-school", "The school with the school code " + schoolName + " does not exists.");
            }
            
        }
    });
}