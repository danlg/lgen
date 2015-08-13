var postHooks = {
  before:{
    method:function(doc){
      doc.role = Router.current().params.role;
      return doc;
    }
  },
  onSuccess: function(operation, result, template) {
    Router.go('signin');
  },
  onError: function(formType, error) {
    alert(error);
  },
  onError: function(formType, error) {
    alert(error);
  }
}

AutoForm.addHooks('signupform', postHooks);
