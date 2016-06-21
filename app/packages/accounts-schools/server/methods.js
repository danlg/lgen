if(Meteor.isServer){
    Meteor.methods({
        'smartix:accounts-schools/createSchoolUser': function(email, options, schoolName, type, emailVerified, doNotifyEmail) {
            // Find school by username first
            var schoolDoc = SmartixSchoolsCol.findOne({
                shortname: schoolName
            });
            // In some occasion, it is easier to pass school id e.g when school is just inserted, of which id is returned from insert method
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

        'smartix:accounts-schools/deleteSchoolUsers':function(school,users){
            if(!Smartix.Accounts.School.isAdmin(school, Meteor.userId())
                && !Smartix.Accounts.System.isAdmin()){
                log.info('no right to delete school user')
                return;
            }            
            Smartix.Accounts.School.deleteSchoolUsers(users,school,Meteor.userId());
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
            //log.info(this.userId(),schoolId);
            return Meteor.users.update({
                _id: this.userId
            }, {
                $addToSet: {
                    schools: schoolId
                }
            });
        },

        'smartix:accounts-schools/revokeSchool':Smartix.Accounts.School.revokeSchool,

        'smartix:accounts-schools/isUserSchoolAdmin': function (namespace, user) {
            return Smartix.Accounts.School.isAdmin(namespace, user);
        },

        'smartix:accounts-schools/importStudents': function (schoolName, data, doNotifyEmail) {
            check(schoolName, String);
            check(data, [Object]);
            let namespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolName);
            if(namespace) {
                //var doNotifyEmail = true;
                return Smartix.Accounts.School.importStudent(namespace, data, this.userId, doNotifyEmail);
            } else {
                throw new Meteor.Error("non-existent-school", "The school with the school code " + schoolName + " does not exists.");
            }
        },

        'smartix:accounts-schools/importParents': function (schoolName, data, doNotifyEmail) {
            check(schoolName, String);
            check(data, [Object]);
            // doNotifyEmail is casted to a Boolean using `!!`
            let namespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolName);
            if(namespace) {
                return Smartix.Accounts.School.importParents(namespace, data, this.userId, !!doNotifyEmail);
            } else {
                throw new Meteor.Error("non-existent-school", "The school with the school code " + schoolName + " does not exists.");
            }
        },

        'smartix:accounts-schools/resendEmail': function(schoolName, userIds){
            let namespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolName);
            check(schoolName, String);
            check(userIds, [Object]);           
            if(namespace) {
                for (count in userIds)
                {
                    id = userIds[count]._id;
                    email = userIds[count].emails[0].address;
                    Smartix.Accounts.sendEnrollmentEmail(email, id, true);
                }
            }
            else {
                throw new Meteor.Error("non-existent-school", "The school" + schoolName + " does not exist");
            }
        },

        'smartix:accounts-schools/importTeachers': function (schoolName, data, doNotifyEmail) {
            check(schoolName, String);
            check(data, [Object]);
            let namespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolName);
            if(namespace) {
                //var doNotifyEmail = true;
                return Smartix.Accounts.School.importTeachers(namespace, data, this.userId, doNotifyEmail);
            } else {
                throw new Meteor.Error("non-existent-school", "The school with the school code " + schoolName + " does not exists.");
            }
        },

        'smartix:accounts-schools/createParent': function (schoolName, parentObj, doNotifyEmail) {
            check(schoolName, String);
            check(parentObj, Object);
            // doNotifyEmail is casted to a Boolean using `!!`
            let namespace = Smartix.Accounts.School.getNamespaceFromSchoolName(schoolName);
            log.info("smartix:accounts-schools/createParent",!!doNotifyEmail);
            if(namespace) {
                return Smartix.Accounts.School.createParentIndi(namespace, parentObj, this.userId, !!doNotifyEmail);
            } else {
                throw new Meteor.Error("non-existent-school", "The school with the school code " + schoolName + " does not exists.");
            }
        }
    });
}