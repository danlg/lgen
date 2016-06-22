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