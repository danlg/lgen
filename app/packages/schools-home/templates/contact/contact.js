Template.MobileSchoolContact.helpers({
   
    getSchoolObj:function(){
        var schoolDoc = SmartixSchoolsCol.findOne({                                                    
            username: Router.current().params.school                                                                     
        });
        
         if(schoolDoc){
         return schoolDoc            
        }               
    }
    
});