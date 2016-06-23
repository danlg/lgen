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

Template.MobileSchoolContact.events({
    'click #schoolWebsite': function(event, template)
    {
        if(Smartix.helpers.isCordova())
        {    
            event.preventDefault();
            var url = template.$("#schoolWebsite").attr('href');
            window.open(url, '_system', 'location=yes');
        }
    }
});