var postHooks = {
  before: {
    method: function (doc) {
      doc.role = Router.current().params.role;
      return doc;
    }
  },
  onSuccess: function (operation, result, template) {

  },
  onError: function (formType, error) {
    toastr.error(error.reason);
  }
};

AutoForm.addHooks('signupform', postHooks);
