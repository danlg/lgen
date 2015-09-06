var postHooks = {
  before:{
    method:function(doc){


      return doc;
    }
  },
  onSuccess: function(operation, result, template) {
        // display success, reset form status

        /*classObj = Classes.findOne({_id:result});

        Meteor.call(
          'addClassMail',
          Meteor.user().emails[0].address,
          classObj.className,
          function(err,res){
            err?alert(err.reason);:Router.go('TabClasses');
          });*/





          Router.go("TabClasses");

  },
  onError:function(type,error){
    alert(error.reason);
  }
}

AutoForm.addHooks('updateClass', postHooks);
