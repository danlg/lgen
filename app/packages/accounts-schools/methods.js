if(Meteor.isServer){
    Meteor.methods({
        'smartix:accounts-schools/createSchoolUser':function(school,options){
            
        },
        'smartix:accounts-schools/assignSchoolRole':function(school,users,roles){
            
        }, 
        'smartix:accounts-schools/retractSchoolRole':function(school,users,roles){
            
        },
        'smartix:accounts-schools/editSchoolRole':function(school,users,roles){
            
        },
        'smartix:accounts-schools/approveSchool':function(schoolId){
            
        }, 
        'smartix:accounts-schools/revokeSchool':function(schoolId){
            
        },                                               
    });
}