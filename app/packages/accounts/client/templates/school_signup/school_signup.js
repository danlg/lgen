Template.SchoolSignup.onCreated(function(){
 
   this.chosenRole = new ReactiveVar('');
   this.chosenNumberOfStudent = new ReactiveVar(0);  
   this.mySchoolName = new ReactiveVar(''); 
});

Template.SchoolSignup.helpers({
    mySchoolName:function(){
        return Template.instance().mySchoolName.get();
    },
    mySchoolNameForSimulatedScreen:function(){
        if( Template.instance().mySchoolName.get() === '' ){
             return "Your school name";
        }else{
            return Template.instance().mySchoolName.get();     
           
        }
    },    
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
  'click .createBtn':function(event,template){
      //TODO: really pass data to page 2 , form input checking 
      console.log('route to page 2');
      Router.go('SchoolSignupPage2');
  }
});