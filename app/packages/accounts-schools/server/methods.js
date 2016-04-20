if(Meteor.isServer){
    Meteor.methods({
        'smartix:accounts-schools/createSchoolUser': function(email, options, schoolName, type) {
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
                return Smartix.Accounts.createUser(email, options, schoolDoc._id, type, this.userId);
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
            return Meteor.users.update({
                _id: this.userId()
            }, {
                $addToSet: {
                    schools: schoolId
                }
            });
        }, 
        'smartix:accounts-schools/revokeSchool':function(schoolId){
            return Meteor.users.update({
                _id: this.userId()
            }, {
                $pull: {
                    schools: schoolId
                }
            });
        },
        'smartix:accounts-schools/isUserSchoolAdmin': function (namespace, user) {
            return Smartix.Accounts.School.isAdmin(namespace, user);
        }
    });
}