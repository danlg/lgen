
Template.SchoolSignupPage2.helpers({

    customizeTheme:function(){
        if(Session.get('schoolTrialAccountCreation')){
            
            var SchoolTrialAccountCreationObj = Session.get('schoolTrialAccountCreation');
            var schoolBackgroundColor = SchoolTrialAccountCreationObj.school.schoolBackgroundColor;
            var schoolTextColor       = SchoolTrialAccountCreationObj.school.schoolTextColor;
            
            console.log(schoolBackgroundColor,schoolTextColor);
            var customStyle = `
                
            <style>
                    #example-forms-floating-labels .bar.bar-positive, .bar.bar-positive, .bar.bar-stable,
                    .button.button-positive.active, .button.button-positive {
                        border-color: ${schoolBackgroundColor};
                        background-color: ${schoolBackgroundColor};
                        background-image: linear-gradient(0deg, ${schoolBackgroundColor}, ${schoolBackgroundColor} 50%, transparent 50%);
                        color: ${schoolTextColor};
                    }
                    
                    .bar.bar-stable .title, .bar-stable .button.button-clear{
                    color: ${schoolTextColor};
                    }
                    
                    .card.square-card .mask{
                        background-color: ${schoolBackgroundColor}; 
                    }
                    
                    .device-preview-backdrop {
                        background-color: ${schoolBackgroundColor};                         
                    }       
                </style>
            `;
            
            return customStyle;            
        }

    }   
    
});