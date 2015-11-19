Session.set("search","");

Template.ClassSearchInformationForWebUser.events({
  'keyup .classSearchTextBox':function(e){
    Session.set("search",$(e.target).val().trim());
  },
  'click .enterBtn':function () {
   
   if($('.enterBtn').hasClass('readyToJoin')){
   
      Router.go('ClassInformationForWebUser',{classCode: Session.get('search') });
   }else{
   
    var classCodeInput = Session.get('search');
    Meteor.call("class/searchExact", classCodeInput, function (error, result) {
      if (error) {
        log.error("error", error);
      }
      if (!result) {
        alert(TAPi18n.__("NoClass"));
      } else {
          var classResult =result;
          
          Meteor.call('getUserNameById',classResult.createBy,function(error,result){
  
              var text = 'Join '+ result + "'s "+ classResult.className;
              $('.enterBtn').text(text);
              $('.enterBtn').addClass('readyToJoin');
          });
          
         
      }
    });
   }
  }
});