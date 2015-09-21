var postHooks = {
  before: {
    method: function (doc) {

      doc = Session.get('optionObj');

      return doc;
    }
  },
  onSuccess: function (operation, result, template) {
    // display success, reset form status
    Session.set('optionObj', {});
    Router.go('TabChat');
  },
  onError: function (formType, error) {
    console.log(error);
    alert(error.reason);
  }
};

AutoForm.addHooks('chatOptionUpdate', postHooks);
