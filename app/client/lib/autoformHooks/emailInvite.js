var postHooks = {
  before: {
    method: function (doc) {
      return doc;
    }
  },
  onSuccess: function (operation, result, template) {

  },
  onError: function (formType, error) {
    log.error(error);
  }
};

AutoForm.addHooks('inviteClassForm', postHooks);
