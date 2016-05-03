var postHooks = {
  before: {
    insert: function (doc) {

      return doc;
    }
  },
  onSuccess: function (operation, result, template) {
    // display success, reset form status
    toastr.success("Your account information is updated");
  },
  onError: function (formType, error) {
    console.log('profileEditHook:onError',error);    
    toastr.error(error.reason);
    // log.error(error);
  }
};

AutoForm.addHooks('editprofile', postHooks);
