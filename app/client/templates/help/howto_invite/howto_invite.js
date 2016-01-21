/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var democlass = "mathfun";

Template.HowToInvite.events({
  
  'click .redirect-button':function(){
    log.info("i am clicked");
    
    /* the below is already done in tab classes and it seems there is some publish/sub issue here so it is commented out
    //if user is registered with meteor account
    if (typeof Meteor.user().emails[0].verified !== 'undefined') {
      //Meteor.user() is ready while Meteor.user().emails is not ready
      //if email is not yet verfied
      if (Meteor.user().emails[0].verified == false) {
        Router.go('EmailVerification');
      }
    } else { //else redirect to classes
          routeToTabClasses();
    } */    
    routeToTabClasses();
  }
 
});

Template.HowToInvite.rendered = function()
{
   var sim = document.getElementById("inputClassCodeSimulation");
   type(democlass,sim);
   Session.set("hasSeenHowToInviteTour", true);
};

Template.HowToInvite.helpers ({
  getShareURLdemo : function() {
    //the following not harcoded link is not pretty and too long because of http://
    //this is just a demo...
    //return Meteor.settings.public.SHARE_URL + "/join/"+ democlass;
    return "lgen.me" +"/join/"+ democlass;
  }
});

//adopt from: http://stackoverflow.com/questions/23688149/simulate-the-look-of-typing-not-the-actual-keypresses-in-javascript
function type(string,element){
    (function writer(i){
      if(string.length <= i++){
        element.value = string;
        //call itself again after all of the sttring has been shown
        setTimeout(function(){type(string,element);},3000);
        return;
      }
      element.value = string.substring(0,i);
      if( element.value[element.value.length-1] != " " ){
          //element.focus()
      }
      var rand = Math.floor(Math.random() * (100)) + 140;
      setTimeout(function(){writer(i);},rand);
    })(0)
}