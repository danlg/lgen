var postHooks = {
  before: {
    insert: function (doc) {

      return doc;
    }
  },
  onSuccess: function (operation, result, template) {
    // display success, reset form status
    //TODO localization
    toastr.success(TAPi18n.__("AccountUpdated"));
  },
  onError: function (formType, error) {
    log.info('profileEditHook:onError',error);
    toastr.error(error.reason);
    // log.error(error);
  }
};

AutoForm.addHooks('editprofile', postHooks);
