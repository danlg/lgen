Meteor.methods({
    
  addClassMail: function (to, id) {
      var classObj = Smartix.Groups.Collection.findOne({
          _id: id
      });
      if (lodash.get(Meteor.user(), "emailNotifications")) {
        try {
          log.info("newClassMail:" + classObj.classCode);
          //retrieveContent("en");
          this.unblock();
          Smartix.newClassMailTemplate(to, classObj.className, classObj.classCode);
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
    var name = userObj.profile.firstName + " " + userObj.profile.lastName;
    return name;
  },    
  getAvatarById: function(id){
    var userObj = Meteor.users.findOne({_id: id});
    
    if (userObj && userObj.profile && userObj.profile.avatarValue){
     return userObj.profile.avatarValue;
    } else {
     return "green_apple";             
    }

  }, 
  
  'smartix:classes/createClass':function(schoolName, classObj){
    
    //global does not have school doc
    if(schoolName === 'global') {
        classObj.namespace = 'global'; 
    } else {                                                                                                    
        var schoolDoc = SmartixSchoolsCol.findOne({                                                    
            username: schoolName                                                                     
        });
        if(schoolDoc) {
            classObj.namespace = schoolDoc._id;
        }
    }                                                                                           
    var result = Smartix.Class.createClass(classObj, this.userId);
    log.info(result);
    if(result == "no-right-create-class"){
      log.info('throw err');
     throw new Meteor.Error("no-right-create-class", "No right to create class in this school");        
    }       
  },
  
  'smartix:classes/editClass':function(modifier,documentId){
      Smartix.Class.editClass(documentId,modifier['$set']);
  },
  'smartix:classes/removeUsers': function (classId, usersToRemove) {
      Smartix.Class.removeUsersFromClass(classId, usersToRemove, this.userId);
  },
  'smartix:classes/removeAdmins': function (classId, adminsToRemove) {
      Smartix.Class.removeAdminsFromClass(classId, adminsToRemove, this.userId);
  }
});