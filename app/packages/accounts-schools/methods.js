if(Meteor.isServer){
    Meteor.methods({
        'smartix:accounts-schools/createSchoolUser':function(school,options){
            if(!Smartix.Accounts.isUserSchoolAdmin(school) && !Smartix.Accounts.isUserSystemAdmin()){
                console.log(NOT_AUTH);
                return;
            }
            
            if(!lodash.includes(SCHOOL_ROLES,options.role)){
                console.log(NOT_VALID_ROLE);
                return;
            }
            
            if(options.email){
                var existUser = Meteor.users.findOne({'emails.0.address':options.email})
                if(existUser){
                    //console.log(TRY_ADD_ROLE_TO_EXISTING_USR)
                    Roles.addUsersToRoles(existUser,options.role,school);     
                }else{
                    var id =  Accounts.createUser({
                        email: options.email,
                        password: options.password,
                        profile: options.profile,
                        username: Smartix.Accounts.helpers.generateUniqueUserName(options.profile.firstname,options.profile.lastname)
                    });
                    
                    Roles.addUsersToRoles(id,options.role,school);    
                }
            }
            
        },
        'smartix:accounts-schools/assignSchoolRole':function(school,users,roles){
            if(!Smartix.Accounts.isUserSchoolAdmin(school)  && !Smartix.Accounts.isUserSystemAdmin()){
                return;
            }
            
            Roles.addUsersToRoles(users,roles,school);                
        }, 
        'smartix:accounts-schools/retractSchoolRole':function(school,users,roles){
            if(!Smartix.Accounts.isUserSchoolAdmin(school)  && !Smartix.Accounts.isUserSystemAdmin()){
                return;
            }
            
            Roles.removeUsersFromRoles(users,roles,school);            
        },
        'smartix:accounts-schools/editSchoolRole':function(school,users,roles){
            if(!Smartix.Accounts.isUserSchoolAdmin(school)  && !Smartix.Accounts.isUserSystemAdmin()){
                return;
            }
            Roles.setUserRoles(users,roles,school);  
        },     
        'smartix:accounts-schools/approveSchool':function(schoolId){
            Meteor.users.update(Meteor.userId(),{ $addToSet: { schools: schoolId } });            
        }, 
        'smartix:accounts-schools/revokeSchool':function(schoolId){
            
            Meteor.users.update(Meteor.userId(),{ $pull: { schools: schoolId } });                           
        },                                               
    });
}