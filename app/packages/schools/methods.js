if(Meteor.isServer){
    
 Meteor.methods({
   
   'smartix:schools/createSchool':function(options,admins){
    /*
    Meteor.call('smartix:schools/createSchool',{name:'Shau Kei Wan - Elsa High',username:'elsahighadmin',logo:'1234567',tel:'36655388',web:'http://www.carmel.edu.hk/',email:'elsahighschool@carmel.edu.hk.test',active:true,preferences:{}});
    */
  
    if( Roles.userIsInRole(Meteor.userId(),'admin','system') ){
        check(options,SchoolsSchema);
        
        if(lodash.includes(RESERVED_SCHOOL_NAMES,options.username)){
            console.log(CANNOT_BE_SAME_AS_RESERVED_NAMES);
            return;
        }
        
        //TODO: logo pass upload image id
        var schoolId = SmartixSchoolsCol.insert({
            name: options.name,
            username: options.username,
            logo: options.logo,
            tel: options.tel,
            web: options.web,
            email: options.email,
            active: true,
            preferences: {}                   
        });         
        
        if(admins){
            
            admins.map(function(eachAdmin){
                Roles.addUsersToRoles(eachAdmin,'admin',schoolId);   
            })
        }else{
            //console.log('createSchoolUser',schoolId);
            Meteor.call('smartix:accounts-schools/createSchoolUser',schoolId,{
                role:'admin',
                username: options.username,
                password: 'admin',
                email:options.email,
                profile:{
                    firstname:options.username,
                    lastname:""
                }       
            });
        }
        
    }       
   },
   'smartix:schools/editSchool':function(id,options){
       
   },    
});   
}
