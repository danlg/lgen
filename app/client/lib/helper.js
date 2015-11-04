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


function imageAction() {
  var options = {
    'buttonLabels': ['Take Photo From Camera', 'Select From Gallery'],
    'androidEnableCancelButton': true, // default false
    'winphoneEnableCancelButton': true, // default false
    'addCancelButtonWithLabel': 'Cancel'
  };
  window.plugins.actionsheet.show(options, callback);
}