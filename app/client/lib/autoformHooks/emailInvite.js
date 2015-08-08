var postHooks = {
  before:{
    method:function(doc){
      console.log(doc);
      return doc;
    }
  },
  onSuccess: function(operation, result, template) {
    
  },
  onError: function(formType, error) {
    console.log(error);
  }
}

AutoForm.addHooks('inviteClassForm', postHooks);
