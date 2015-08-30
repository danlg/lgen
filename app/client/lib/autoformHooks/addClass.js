var postHooks = {
  before:{
    insert:function(doc){
      if(!doc.classCode){
        doc.classCode = getClassCodeNew(doc.className);
      }
      doc.joinedUserId=[];
      doc.messagesObj=[];
      return doc;
    }
  },

  onSuccess: function(operation, result, template) {
    // display success, reset form status
    IonLoading.show({
      backdrop: true
    });
    Meteor.call('addClassMail',Meteor.user().emails[0].address,result,function(err,res){
        IonLoading.hide();
        err?alert(err):Router.go('Classes');
    });
  },
  onError: function(formType, error) {
      alert(error);
  },
  beginSubmit: function() {
  },
  endSubmit: function() {
  }
};

AutoForm.addHooks('insertClass', postHooks);
