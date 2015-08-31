Push.allow({
       send: function(userId, notification) {
           return true; // Allow all users to send
       }
   });


  //  Push.deny({
  //      send: function(userId, notification) {
  //          return false; // Allow all users to send
  //      }
  //  });


  Push.addListener('token', function(token) {
          // Token is { apn: 'xxxx' } or { gcm: 'xxxx' }
    Meteor.call('raix:push-setuser',Push.id());
  });
