/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Session.set("search","");

Template.ClassSearchInformationForWebUser.events({
  'keyup .classSearchTextBox':function(e){
    Session.set("search",$(e.target).val());
  },
  'click .enterBtn':function () {
   
   if($('.enterBtn').hasClass('readyToJoin')){
   
      Router.go('ClassInformationForWebUser',{classCode: Session.get('search') });
   } else {
   
    var classCodeInput = Session.get('search');
    Meteor.call("class/searchExact", classCodeInput, function (error, result) {
      if (error) {
        log.error("error", error);
      }
      if (!result) {
        toastr.error(TAPi18n.__("NoClass"));
      } else {
          var classResult =result;
          Meteor.call('getUserNameById',classResult.admins[0],function(error,result){
               //todo localize
              var text = 'Join '+ result + "'s "+ classResult.className;
              $('.enterBtn').text(text);
              $('.enterBtn').addClass('readyToJoin');
          });
          
         
      }
    });
   }
  }
});