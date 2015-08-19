var postHooks = {
  before:{
    insert:function(doc){

      return doc;
    }
  },
  onSuccess: function(operation, result, template) {
        // display success, reset form status
      alert("success");
  },
  onError: function(formType, error) {
    alert(error);
  }
}

AutoForm.addHooks('editprofile', postHooks);
