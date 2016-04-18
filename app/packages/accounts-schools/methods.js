if(Meteor.isServer){
    Meteor.methods({
        'smartix:accounts-schools/createSchoolUser': function(schoolName, options){
            //find school by username first
            var schoolDoc = SmartixSchoolsCol.findOne({
                username: schoolName
            });
            
            //in some occasion, it is easier to pass school id. e.g when school is just inserted, of which id is returned from insert method
            if(!schoolDoc){
                schoolDoc = SmartixSchoolsCol.findOne({
                    _id: schoolName
                });   
            }
            
            if (schoolDoc) {
                return Smartix.Accounts.School.createUser(schoolDoc._id, options);
            } else {
                return false;
            }
        },
        'smartix:accounts-schools/assignSchoolRole':function(school,users,roles){
            if(!Smartix.Accounts.isUserSchoolAdmin(school) && !Smartix.Accounts.isUserSystemAdmin()){
                return;
            }
            
            Roles.addUsersToRoles(users,roles,school);                
        }, 
        'smartix:accounts-schools/retractSchoolRole':function(school,users,roles){
            if(!Smartix.Accounts.isUserSchoolAdmin(school) && !Smartix.Accounts.isUserSystemAdmin()){
                return;
            }
            
            Roles.removeUsersFromRoles(users,roles,school);            
        },
        'smartix:accounts-schools/editSchoolRole':function(school,users,roles){
            if(!Smartix.Accounts.isUserSchoolAdmin(school) && !Smartix.Accounts.isUserSystemAdmin()){
                return;
            }
            Roles.setUserRoles(users,roles,school);  
        },     
        'smartix:accounts-schools/approveSchool':function(schoolId){
            var updateCount = Meteor.users.update(Meteor.userId(),{ $addToSet: { schools: schoolId } });
            return updateCount;    
        }, 
        'smartix:accounts-schools/revokeSchool':function(schoolId){
            
            var updateCount = Meteor.users.update(Meteor.userId(),{ $pull: { schools: schoolId } });
            return updateCount;                              
        },
        'smartix:accounts-schools/isUserSchoolAdmin': function (namespace, user) {
            return Smartix.Accounts.isUserSchoolAdmin(namespace, user);
        }
    });
}