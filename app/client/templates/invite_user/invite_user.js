

Template.InviteUser.rendered = function()
{
   var sim = document.getElementById("inputClassCodeSimulation")     
   type('math101',sim);
}

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