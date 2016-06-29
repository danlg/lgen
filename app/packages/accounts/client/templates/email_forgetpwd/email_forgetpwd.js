/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

Template.EmailForgetPwd.onCreated(function(){
    this.email = new ReactiveVar("");
    this.password = new ReactiveVar("");
  
});

Template.EmailForgetPwd.events({
  'input #email': function(event, template){
      template.email.set($("#email").val());
  },
  'click .reset-password-btn': function (event, template) {
     
     if(Smartix.helpers.validateEmail(template.email.get())){    
      Accounts.forgotPassword({email: template.email.get()}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            toastr.error(TAPi18n.__("EmailNotFound"));
            log.info('This email does not exist.');
          } else {
            toastr.error(TAPi18n.__("SomethingWentWrong"));             
            log.info('We are sorry but something went wrong.',err.message);
          }
        } else {
          toastr.info(TAPi18n.__("EmailSentCheckMailBox"));  
          log.info('Email Sent. Check your mailbox.');
        }
      });
     }else{
          toastr.info(TAPi18n.__("EmailFormatNotCorrect"));   
     }
  }   
});