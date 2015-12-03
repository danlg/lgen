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
    alert(error.reason);
  }
};

AutoForm.addHooks('updateClass', postHooks);
