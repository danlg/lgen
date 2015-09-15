var legalLink = ReactiveVar("");
/*****************************************************************************/
/* TabYou: Event Handlers */
/*****************************************************************************/
Template.TabYou.events({
  'click .signOut': function() {
    Meteor.logout(
      function(err) {
        Router.go('Login');
      }
    );
  },
  'click .about':function (argument) {

    if(Meteor.isCordova){
      var  pattern = /-.*/g ;

      navigator.globalization.getPreferredLanguage(
        function (language) {
          // alert('language: ' + language.value + '\n');
          // console.log(language);
          var lang =language.value.replace(pattern,"");

          console.log(lang);

          // var html  = "http://esprit.io/legal/"+lang+".privacy.html";
          // var html = Meteor.call("getPpLink",lang);
          Meteor.call("getPpLink",lang, function(error, result){
            if(error){
              console.log("error", error);
            }else{


              switch (window.device.platform) {
                case "Android":
                  navigator.app.loadUrl(result,{openExternal: true});
                  break;
                case "iOS":
                window.open(result, '_system');
                  break;

              }


              // return legalLink.set(result);
            }

          });

          // return html;


        },
        function () {alert('Error getting language\n');}
      );
    }else{
      console.log('you are not in phone');
    }

  },
  'click .love':function (argument) {

    if(Meteor.isCordova){
      switch (Meteor.user().profile.role) {
        case "Teacher":
          var text = "Hey! \r\n\r\nI have been using Little Genius to text my students and parents without sharing my personal phone number.\r\nYou have to try it! It saves time, students love it and it is free! \r\nHere is the link: "+Meteor.settings.public.WEB_URL+"?rid="+Meteor.userId();
          break;
        case "Parent":
          var text = "Hey!\r\n\r\nMy teachers have been using the Little Genius app to message our class before assignments are due, share photos and update us with last minute changes. You should tell your teachers about it! It\'s really helpful and free.\r\nHere is the link: "+Meteor.settings.public.WEB_URL+"?rid="+Meteor.userId()+"\"\r\n";
        default:

      }
      window.plugins.socialsharing.share(text, null, null, null);

      analytics.track("Referral", {
        date: new Date(),
        userId : Meteor.userId()
      });

      Meteor.call("addReferral", Meteor.userId(), function(error, result){
        if(error){
          console.log("error", error);
        }
      });







    }

  }

});

/*****************************************************************************/
/* TabYou: Helpers */
/*****************************************************************************/
Template.TabYou.helpers({
  getlegal:function () {
    return legalLink.get();


    // return Meteor.call("getPpLink","en");

  }
});

/*****************************************************************************/
/* TabYou: Lifecycle Hooks */
/*****************************************************************************/
Template.TabYou.created = function() {



};

Template.TabYou.rendered = function() {

  if(Meteor.isCordova){
    var  pattern = /-.*/g ;

    navigator.globalization.getPreferredLanguage(
      function (language) {
        // alert('language: ' + language.value + '\n');
        // console.log(language);
        var lang =language.value.replace(pattern,"");

        console.log(lang);

        // var html  = "http://esprit.io/legal/"+lang+".privacy.html";
        // var html = Meteor.call("getPpLink",lang);
        Meteor.call("getPpLink",lang, function(error, result){
          if(error){
            console.log("error", error);
          }else{


            // switch (window.device.platform) {
            //   case "Android":
            //     navigator.app.loadUrl(result,{openExternal: true})
            //     break;
            //   case "iOS":
            //   window.open(result, '_system')
            //     break;
            //
            // }


            return legalLink.set(result);
          }

        });

        // return html;


      },
      function () {alert('Error getting language\n');}
    );
  }else{

    Meteor.call("getPpLink","en", function(error, result){
      if(error){
        console.log("error", error);
      }else{
        return legalLink.set(result);
      }

    });

  }

};

Template.TabYou.destroyed = function() {};
