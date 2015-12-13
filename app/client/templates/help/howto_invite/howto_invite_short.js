//var democlass = "mathfun";
//todo refactor to avoid copy paste code
var classCodeLocal = "";

Template.HowToInviteShort.events({
  'click .redirect-button':function(){
     Router.go("ClassPanel",{classCode :classCodeLocal});
  }
});

Template.HowToInviteShort.created = function(){
  classCodeLocal = Router.current().params.classCode;
};

Template.HowToInviteShort.rendered = function()
{
   var sim = document.getElementById("inputClassCodeSimulation");
   type(classCodeLocal,sim);
};

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