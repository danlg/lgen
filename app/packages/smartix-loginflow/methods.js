Meteor.methods({
 
  resendVerificationEmail: function(email){
      log.info(Meteor.userId());
      if (email) {
       var newEmailArray = [];
       newEmailArray.push({address:email,verified:false});
       Meteor.users.update(Meteor.userId(), {$set: {emails: newEmailArray}});
       
        Accounts.sendVerificationEmail(Meteor.userId(), email);
      } else {
        Accounts.sendVerificationEmail(Meteor.userId());
      }
  },
      
});