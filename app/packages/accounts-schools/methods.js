if(Meteor.isServer){
    Meteor.methods({
        'smartix:accounts-schools/createSchoolUser':function(school,options){
            if(!Smartix.Accounts.isUserSchoolAdmin(school) && !Smartix.Accounts.isUserSystemAdmin()){
                console.log(NOT_AUTH);
                throw new Meteor.Error("not-auth", NOT_AUTH);

            }
            
            if(!lodash.includes(Smartix.Accounts.ValidSchoolRoles, options.role)){
                console.log(NOT_VALID_ROLE);
                throw new Meteor.Error("not-valid-role", NOT_VALID_ROLE);
            }
            
            if(options.email){
                var existUser = Meteor.users.findOne({'emails.0.address':options.email})
                if(existUser){
                    //console.log(TRY_ADD_ROLE_TO_EXISTING_USR)
                    Roles.addUsersToRoles(existUser,options.role,school);
                    return existUser;     
                }else{
                    var initPw = Random.id(6)
                    var id =  Accounts.createUser({
                        email: options.email,
                        password: options.password || initPw,
                        profile: options.profile,
                        username: Smartix.Accounts.helpers.generateUniqueUserName(options.profile.firstname,options.profile.lastname)
                    }); 
                    Roles.addUsersToRoles(id,options.role,school);
                    Meteor.users.update(id,{ $addToSet: { schools: school } });
                    return {userObj:Meteor.users.findOne(id),initialPassword: options.password || initPw};
                                           
                }
            }else{
                    var initPw = Random.id(6);
                    var id =  Accounts.createUser({
                        password: options.password || initPw,
                        profile: options.profile,
                        username: Smartix.Accounts.helpers.generateUniqueUserName(options.profile.firstname,options.profile.lastname)
                    }); 
                    Roles.addUsersToRoles(id,options.role,school);
                    Meteor.users.update(id,{ $addToSet: { schools: school } });  
                    return {userObj:Meteor.users.findOne(id),initialPassword: options.password || initPw};                                        
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
            var updateCount = Meteor.users.update(Meteor.userId(),{ $addToSet: { schools: schoolId } });
            return updateCount;    
        }, 
        'smartix:accounts-schools/revokeSchool':function(schoolId){
            
            var updateCount = Meteor.users.update(Meteor.userId(),{ $pull: { schools: schoolId } });
            return updateCount;                              
        },                                               
    });
}