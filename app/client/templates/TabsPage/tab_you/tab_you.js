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
  }
});

/*****************************************************************************/
/* TabYou: Helpers */
/*****************************************************************************/
Template.TabYou.helpers({
  getlegal:function () {

    if(Meteor.isCordova){
      var  pattern = /-.*/g ;

      navigator.globalization.getPreferredLanguage(
        function (language) {
          // alert('language: ' + language.value + '\n');
          // console.log(language);
          var lang =language.value.replace(pattern,"");

          var html  = "http://esprit.io/legal/"+lang+".privacy.html";

          return html;


        },
        function () {alert('Error getting language\n');}
      );
    }

    return "http://esprit.io/legal/en.privacy.html";

  }
});

/*****************************************************************************/
/* TabYou: Lifecycle Hooks */
/*****************************************************************************/
Template.TabYou.created = function() {



};

Template.TabYou.rendered = function() {};

Template.TabYou.destroyed = function() {};
