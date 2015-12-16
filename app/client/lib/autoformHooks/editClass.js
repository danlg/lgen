var postHooks = {
  before: {
    method: function (doc) {
      return doc;
    }
  },
  onSuccess: function (operation, result, template) {

    Router.go("TabClasses");

  },
  onError: function (type, error) {
    toastr.error(error.reason);
  }
};

AutoForm.addHooks('updateClass', postHooks);
