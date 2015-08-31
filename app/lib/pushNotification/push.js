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


  Push.addListener('error', function(err) {
          if (error.type == 'apn.cordova') {
              console.log(err.error);
          }
      });
