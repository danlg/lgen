var form ;

/*****************************************************************************/
/* AddClass: Event Handlers */
/*****************************************************************************/
Template.AddClass.events({
});

/*****************************************************************************/
/* AddClass: Helpers */
/*****************************************************************************/
Template.AddClass.helpers({
});

/*****************************************************************************/
/* AddClass: Lifecycle Hooks */
/*****************************************************************************/
Template.AddClass.created = function () {
};

Template.AddClass.rendered = function () {
  form = this.$("#insertClass");
};

Template.AddClass.destroyed = function () {
};

Template.ionNavBar.events({
  'click .addClassBtn':function(e,template){
      var email = getValues(Meteor.user(),"email").shift();
      var classname = AutoForm.getFieldValue("className","insertClass");
      $(form).submit();
      Meteor.call('addClassMail',email,classname,function(err,res){
          err?alert(err):Router.go('Classes');
        });
    }
  });
