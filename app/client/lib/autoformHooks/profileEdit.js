var postHooks = {
  before: {
    insert: function (doc) {

      return doc;
    }
  },
  onSuccess: function (operation, result, template) {
    // display success, reset form status
    alert("success");
  },
  onError: function (formType, error) {
    alert(error.reason);
    // log.error(error);
  }
};

AutoForm.addHooks('editprofile', postHooks);
