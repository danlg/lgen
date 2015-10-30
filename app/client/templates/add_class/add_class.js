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
        template.$("input[name=classCode]").val(lastName + ""+ lowerCaseEngAndNumber);
        
        //everytime user input in className, we do a validation to the form
        AutoForm.validateForm("insertClass");
    }
  
  
});

/*****************************************************************************/
/* AddClass: Helpers */
/*****************************************************************************/
Template.AddClass.helpers({});

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
};

Template.ionNavBar.events({
  'click .addClassBtn': function (e, template) {
    $(form).submit();

    /*var email = getValues(Meteor.user(),"email").shift();
     var classname = AutoForm.getFieldValue("className","insertClass");

     Meteor.call('addClassMail',email,classname,function(err,res){
     err?alert(err.reason);:Router.go('TabClasses');
     });*/
  }
});
