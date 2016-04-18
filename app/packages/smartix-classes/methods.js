Meteor.methods({
    
    addClassMail: function (to, id) {
        var classObj = Smartix.Groups.Collection.findOne({
            _id: id
        });
    if (lodash.get(Meteor.user(), "profile.email")) {
      try {
        
        log.info("newClassMail:" + classObj.classCode);
        //retrieveContent("en");
        Mandrill.messages.send(Smartix.newClassMailTemplate(to, classObj.className, classObj.classCode));
      }
      catch (e) {
        log.error("add class mail: " + e);
      }
    }
  },   
  getFullNameById: function (id) {
    var userObj = Meteor.users.findOne({
        _id: id
    });
    var name = userObj.profile.firstname + " " + userObj.profile.lastname;
    return name;
  },    
  getAvatarById: function(id){
    var userObj = Meteor.users.findOne({_id: id});
    
    if (userObj && userObj.profile && userObj.profile.useravatar){
     return userObj.profile.useravatar;
    } else {
     return "green_apple";             
    }

  }, 
  
  'smartix:classes/createClass':function(schoolName, classObj){
    
    //global does not have school doc
    if(schoolName == 'global'){
        classObj.namespace = 'global'; 
    }else{                                                                                                    
        var schoolDoc = SmartixSchoolsCol.findOne({                                                    
            username: schoolName                                                                     
        });                                                                                              
                                                                                                  
        classObj.namespace = schoolDoc._id;                                                       
    }                                                                                           
    return Smartix.Class.createClass(classObj);       
  }
     
});