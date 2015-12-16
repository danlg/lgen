var postHooks = {
  before: {
    insert: function (doc) {

      return doc;
    }
  },
  onSuccess: function (operation, result, template) {
    // display success, reset form status
    toastr.success("success");
  },
  onError: function (formType, error) {
    toastr.error(error.message);
    // log.error(error);
  }
};

AutoForm.addHooks('editprofile', postHooks);
