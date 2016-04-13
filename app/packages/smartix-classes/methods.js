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
  
  'smartix:classes/createClass':function(classObj){
    
    console.log('smartix:classes/createClass',classObj);
    
    return Smartix.Class.createClass(classObj);    
  }
     
});