var postHooks = {
  before:{
    method:function(doc){
      console.log(doc);
      if(!doc.classCode){
        var beforeHash = Meteor.user().email + doc.className;
        var rString = randomString(6);
        doc.classCode  = CryptoJS.SHA1(rString,beforeHash).toString().substring(0,6);
      }
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
            err?alert(err):Router.go('Classes');
          });*/





          Router.go("Classes");

  }
}

AutoForm.addHooks('updateClass', postHooks);
