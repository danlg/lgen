Template.SchoolSignup.onCreated(function(){
 
   this.chosenRole = new ReactiveVar('');
   this.chosenNumberOfStudent = new ReactiveVar(0);  
   this.mySchoolName = new ReactiveVar(''); 
   
   this.inputBackgroundColor = new ReactiveVar('#811719');
   this.inputTextColor = new ReactiveVar('#FFFFFF');
   this.currentSchoolFormTemplate = new ReactiveVar('SchoolSignupForm');
   this.newSchoolId = new ReactiveVar('');
});


Template.SchoolSignup.helpers({
    getCurrentSchoolFormTemplate:function(){
      return Template.instance().currentSchoolFormTemplate.get();
    },
    mySchoolName:function(){
        return Template.instance().mySchoolName.get();
    },
    mySchoolNameForSimulatedScreen:function(){
        if( Template.instance().mySchoolName.get() === '' ){
             return "My remarkable school";
        }else{
            return Template.instance().mySchoolName.get();     
           
        }
    },
    getInputBackgroundColor : function(){
      return Template.instance().inputBackgroundColor.get();
    },
    customizeTheme:function(){
        var schoolBackgroundColor = Template.instance().inputBackgroundColor.get();
        var schoolTextColor       = Template.instance().inputTextColor.get();
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
       
})

Template.SchoolSignup.events({
  'keyup .school-name':function(event,template){
    template.mySchoolName.set(     $(event.target).val()  );
 
  },
  'click .role-selection':function(event,template){
      //$(event.target).data('role');
      $(".role-selection").removeClass('chosen-role');
      $(event.currentTarget).addClass('chosen-role');          
      template.chosenRole.set($(event.currentTarget).data('role'));
  },
  'click .number-of-student-selection':function(event,template){
      //$(event.target).data('role');
      $(".number-of-student-selection").removeClass('chosen-number-of-student');
      $(event.currentTarget).addClass('chosen-number-of-student');          
      template.chosenNumberOfStudent.set($(event.currentTarget).data('number'));
  },
  'click .start-my-trial-btn':function(event,template){
      //TODO: really pass data to page 2 , form input checking
      var school = {};
      school.schoolFullName        = template.mySchoolName.get();
      school.schoolCountry         = $('#school-country').val();
      school.schoolCity            = $('#school-city').val();
      school.schoolNumberOfStudent = $('#school-number-of-student').val();
      school.schoolBackgroundColor = template.inputBackgroundColor.get();
      school.schoolTextColor       =template.inputTextColor.get();
      
      var user = {};
      user.userFirstName         = $('#user-first-name').val();
      user.userLastName          = $('#user-last-name').val();
      user.userEmail             = $('#user-email').val();
      user.userPosition          = $('#user-position').val();

      console.log('school',school);
      console.log('user',user);
      
      var SchoolTrialAccountCreationObj = {school: school, user: user};
      
      //http://stackoverflow.com/questions/11866910/how-to-force-a-html5-form-validation-without-submitting-it-via-jquery
      if($('#school-trial-account-create')[0].checkValidity()){
        //checkValidity without form submission
        event.preventDefault();
        
        Session.set('schoolTrialAccountCreation',SchoolTrialAccountCreationObj);
        //console.log('route to page 2');
        //Router.go('SchoolSignupPage2');
        
        
        //TODO: insert user position, and step = 1, logo (optional)
        Meteor.call('smartix:schools/createSchoolTrial',{
            
            name : school.schoolFullName ,
            logo : '',
            tel  : '',
            web  : '',
            email: user.userEmail,
            country: school.schoolCountry ,
            city:    school.schoolCity,
            preferences:{
                schoolBackgroundColor: school.schoolBackgroundColor,
                schoolTextColor:       school.schoolTextColor 
            }
            
            
            
        },function(err,result){
            if(result){
              console.log('newSchoolId',result);
              template.newSchoolId.set(result);
              template.currentSchoolFormTemplate.set('SchoolSignupForm2');
              
            }else{
              console.log('fail to create school');
            }
        });
        
           
      }else{
        console.log('not valid form');
      }
      


  },
  'click .start-my-trial-page2-btn':function(event,template){
      //TODO
      
      //update school shortname from  template.newSchoolId.get()
      
      //update step = 2
      
      //create school admin account for user, send enrolment email
      
      //notify user to open the email, set password and start to use.
      
      
  },
  'change #school-background-color':function(event,template){
      
      template.inputBackgroundColor.set(  $(event.target).val() );
      
  }
});