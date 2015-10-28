Template.registerHelper('formatTime', function(time) {

    var dateString="";
    if(time){  
    //console.log(this);
    //console.log(parentContext); 
   
      var fullUnixTime = time;
    
      if (fullUnixTime){
        var trimUnixTime = fullUnixTime.substr(0,10);
        dateString = moment.unix(trimUnixTime).format('h:mm a');
      }       
    }
    return dateString;    
  
});