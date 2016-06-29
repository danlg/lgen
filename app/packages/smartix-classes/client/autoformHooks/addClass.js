var postHooks = {
  before: {
    insert: function (doc) {
      if (!doc.classCode) {
        doc.classCode = Smartix.Class.Helpers.getClassCodeNew(doc.className);
      }
      //log.info("1.doc.classCode BEFOR="+doc.classCode);
      // THIS IS WHAT PREVENTS TO INSERT class code IN UPPER CASE
      doc.classCode = doc.classCode.trim().toLowerCase();
      //log.info("2.doc.classCode AFTER="+doc.classCode);
      doc.users = [];
      return doc;
    }
  },

  onSuccess: function (operation, result, template) {
    // display success, reset form status
    IonLoading.show({
      backdrop: true
    });
    Meteor.call('addClassMail', Meteor.user().emails[0].address, result, function (err, res) {
      IonLoading.hide();
      err ? toastr.error(err.reason) : Router.go('TabClasses');
    });
  },

  onError: function (formType, error) {
    toastr.error(TAPi18n.__("ClassAddFailed"));
  },

  beginSubmit: function () {
  },

  endSubmit: function () {
  }
};

AutoForm.addHooks('insertClass', postHooks);
