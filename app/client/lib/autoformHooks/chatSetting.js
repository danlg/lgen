var postHooks = {
  before:{
    method:function(doc){
      var weekObj = Session.get('workHourTime')?Session.get('workHourTime'):{};
      doc.workHourTime = weekObj
      doc.allowChat = Session.get('selectedClass')?Session.get('selectedClass'):[];

      console.log(doc);

      return doc;
    }
  },
  onSuccess: function(operation, result, template) {
        // display success, reset form status
    Router.go('TabChat');
  },
  onError: function(formType, error) {
    console.log(error);
  }
}

AutoForm.addHooks('chatOptionUpdate', postHooks);
