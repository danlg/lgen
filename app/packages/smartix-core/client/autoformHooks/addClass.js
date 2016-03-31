var postHooks = {
  before: {
    insert: function (doc) {
      if (!doc.classCode) {
        doc.classCode = Smartix.helpers.getClassCodeNew(doc.className);
      }
      //console.log("1.doc.classCode BEFOR="+doc.classCode);
      // THIS IS WHAT PREVENTS TO INSERT class code IN UPPER CASE
      doc.classCode = doc.classCode.trim().toLowerCase();
      //console.log("2.doc.classCode AFTER="+doc.classCode);
      doc.joinedUserId = [];
      doc.messagesObj = [];
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
    toastr.error("Cannot add class, please try again");
  },

  beginSubmit: function () {
  },

  endSubmit: function () {
  }
};

AutoForm.addHooks('insertClass', postHooks);
