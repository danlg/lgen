Template.MobileSchoolContact.helpers({
    getSchoolObj:function(){
        var schoolDoc = SmartixSchoolsCol.findOne({
            shortname: UI._globalHelpers['getCurrentSchoolName']()                                                          
        });
        if(schoolDoc){
         return schoolDoc            
        }              
    }
});

Template.MobileSchoolContact.onCreated(function(){
   this.subscribe('images', 
       UI._globalHelpers['getCurrentSchoolName'](), 
       'school', 
       UI._globalHelpers['getCurrentSchoolName']());
});