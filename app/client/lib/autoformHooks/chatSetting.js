var postHooks = {
  before:{
    method:function(doc){
      //Session.get('workHourTime')
      var weekObj = {};
      doc.workHourTime = weekObj

      console.log(doc);

      return doc;
    }
  },
  onSuccess: function(operation, result, template) {
        // display success, reset form status

  },
  onError: function(formType, error) {
    console.log(error);
  }
}

AutoForm.addHooks('chatOptionUpdate', postHooks);
