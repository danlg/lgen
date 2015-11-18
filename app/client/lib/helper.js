Template.registerHelper('formatTime', function(time) {

    var dateString="";
    if(time){  
     log.info(this);

   
      var fullUnixTime = time;
    
      if (fullUnixTime){
        var trimUnixTime = fullUnixTime.substr(0,10);
        dateString = moment.unix(trimUnixTime).format('h:mm a');
      }       
    }
    return dateString;    
  
});

//how to create a global function in meteor template
//http://stackoverflow.com/questions/29364591/how-to-create-a-global-function-in-meteor-template
//You need to make your function a global identifier to be able to call it across multiple files :


//if user has pending class to join, join and redirect user to the class page.
//else, redirect use to tab classes
routeToTabClassesOrClassDetail = function(){
          
          log.info("routeToTabClassesOrClassDetail");  
          var classToBeJoined = Session.get("search");
          log.info(classToBeJoined);
          if (classToBeJoined) {

            var doc = {classCode: classToBeJoined};
            //help user to join class directly and router go to the class page
            Meteor.call("class/join", doc, function (error, result) {

              log.info(error);
              log.info(result);
              if (error) {
                log.error("error", error);
                Router.go("TabClasses");
              } else {
                Session.set("search","");
                log.info("Redirecting you to the class");
                Router.go("classDetail",{classCode : classToBeJoined});
              }
            });

          } else {
            Router.go("TabClasses");
          }
}