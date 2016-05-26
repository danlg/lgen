Template.SchoolSignup.onCreated(function(){
 
   this.chosenRole = new ReactiveVar('');
   this.chosenNumberOfStudent = new ReactiveVar(0);  
   this.mySchoolName = new ReactiveVar(''); 
   
   this.inputBackgroundColor = new ReactiveVar('#811719');
   this.inputTextColor = new ReactiveVar('#FFFFFF');
});

Template.SchoolSignup.helpers({
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
      
      
      
      console.log('route to page 2');
      Router.go('SchoolSignupPage2');
  },
  'change #school-background-color':function(event,template){
      
      template.inputBackgroundColor.set(  $(event.target).val() );
      
  }
});