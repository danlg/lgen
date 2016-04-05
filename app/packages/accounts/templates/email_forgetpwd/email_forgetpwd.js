/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* EmailForgetPwd: Event Handlers */
/*****************************************************************************/
Template.EmailForgetPwd.events({
  'input #email':function(event,template){
      template.email.set($("#email").val());
  },
  'click .reset-password-btn': function (event,template) {
     
     if(Smartix.helpers.validateEmail(template.email.get())){    
      Accounts.forgotPassword({email: template.email.get()}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            toastr.error(TAPi18n.__("EmailNotFound"));
            console.log('This email does not exist.');
          } else {
            toastr.error("We are sorry but something went wrong");             
            console.log('We are sorry but something went wrong.',err.message);
          }
        } else {
          toastr.info(TAPi18n.__("EmailSentCheckMailBox"));  
          console.log('Email Sent. Check your mailbox.');
        }
      });
     }else{
          toastr.info(TAPi18n.__("EmailFormatNotCorrect"));   
     }
  }   
});

/*****************************************************************************/
/* EmailForgetPwd: Helpers */
/*****************************************************************************/
Template.EmailForgetPwd.helpers({});

/*****************************************************************************/
/* EmailForgetPwd: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailForgetPwd.created = function () {
    this.email = new ReactiveVar("");
    this.password = new ReactiveVar("");
};

Template.EmailForgetPwd.rendered = function () {
};

Template.EmailForgetPwd.destroyed = function () {
};

