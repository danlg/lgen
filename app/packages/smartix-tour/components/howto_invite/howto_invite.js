/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var democlass = "mathfun";

Template.HowToInvite.events({
  
  'click .redirect-button':function(){
    log.info("i am clicked");

    Smartix.helpers.routeToTabClasses();
  }
 
});

Template.HowToInvite.onRendered ( () => {
   var sim = document.getElementById("inputClassCodeSimulation");
   type(democlass,sim);
   Session.set("hasSeenHowToInviteTour", true);
});

Template.HowToInvite.helpers ({
  getShareURLdemo : function() {
    //the following not harcoded link is not pretty and too long because of http://
    //this is just a demo...
    //return Meteor.settings.public.SHARE_URL + "/join/"+ democlass;
    return "gosmartix.com" +"/join/"+ democlass;
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