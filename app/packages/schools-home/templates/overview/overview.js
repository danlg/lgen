Template.MobileSchoolHome.helpers({
   
    schoolLogoUrl:function(){
        var schoolLogoId;
        
        var schoolDoc = SmartixSchoolsCol.findOne({                                                    
            username: Router.current().params.school                                                                     
        });
        
        //console.log('schoolDoc',schoolDoc);
        if(schoolDoc) {
            schoolLogoId = schoolDoc.logo;
        
        }
        //console.log(schoolLogoId);
        
        return Images.findOne(schoolLogoId);
    },
    
    schoolFullName:function(){
        var schoolLogoId;
        
        var schoolDoc = SmartixSchoolsCol.findOne({                                                    
            username: Router.current().params.school                                                                     
        });
        
        if(schoolDoc){
         return schoolDoc.name;             
        }
      
    },
    getCurrentSchoolName: function() {
        return Router.current().params.school;
    }
    
    
});