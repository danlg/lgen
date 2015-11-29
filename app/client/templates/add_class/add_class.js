var form;
/*****************************************************************************/
/* AddClass: Event Handlers */
/*****************************************************************************/
Template.AddClass.events({
  
    'keyup input[name=className]': function(event, template){
 
        var lastName = getLastnameOfCurrentUser(3);
        var className = $(event.target).val();
        
        //if user deletes all input in class name, leave the class code field blank.
        if(className.length == 0 ){
            template.$("input[name=classCode]").val("");         
          return;
        }
        
        var trimSpacesSuggestClassCode = className.replace(/\s/g, "");
        var first4Letters = trimSpacesSuggestClassCode.substr(0,4);
        var lowerCaseEngAndNumber = first4Letters.toLowerCase().replace(/[^a-z0-9]/g, "");
        var classCode = lastName + ""+ lowerCaseEngAndNumber;
        template.$("input[name=classCode]").val(classCode);
        
        //everytime user input in className, we do a validation to the class code
        var isValidate = AutoForm.validateField("insertClass","classCode");
        
    },

    'click #pick-an-icon-btn':function(){
      var parentDataContext= {iconListToGet:"iconListForClass",sessionToBeSet:"chosenIconForNewClass"};
      IonModal.open("ClassIconChoose", parentDataContext);  
    }
});

/*****************************************************************************/
/* AddClass: Helpers */
/*****************************************************************************/
Template.AddClass.helpers({
  
  getClassAvatar:function(){
    var chosenIcon = Session.get('chosenIconForNewClass');
    if(chosenIcon){
      return chosenIcon;
    }else{
      //default set as green apple
      return "green_apple";
    }
  }
});

/*****************************************************************************/
/* AddClass: Lifecycle Hooks */
/*****************************************************************************/
Template.AddClass.created = function () {
};

Template.AddClass.rendered = function () {
  form = this.$("#insertClass");
  $(".checked").attr("checked", "checked");
};

Template.AddClass.destroyed = function () {
  delete Session.keys['chosenIconForNewClass'];
};

Template.ionNavBar.events({
  'click .addClassBtn': function (e, template) {
    
    if(AutoForm.validateForm("insertClass")){
      $(form).submit();
    }
    /*var email = getValues(Meteor.user(),"email").shift();
     var classname = AutoForm.getFieldValue("className","insertClass");

     Meteor.call('addClassMail',email,classname,function(err,res){
     err?alert(err.reason);:Router.go('TabClasses');
     });*/
  }
});

