Template.TeacherAbsenceHome.onCreated(function(){
    this.subscribe('joinedClasses');
});


Template.TeacherAbsenceHome.helpers({

  createdClass: function () {
    return Smartix.Groups.Collection.find({
          admins: Meteor.userId(),
          namespace: Session.get('pickedSchoolId'),
          type:'class'
    }, {
        sort: {
            "lastUpdatedAt": -1
        }
    });
  },

  classAvatarIcon: function() {
      var ava =  (this.classAvatar) ? true : false;
      if (ava) {
        return "e1a-" + this.classAvatar;
      }
      else{ //default
        return "e1a-green_apple";
      }
  },

//   lasttextTime:function(lastUpdatedAtDate){
//       return lastUpdatedAtDate ? moment(lastUpdatedAtDate).fromNow() : "";
//    }
});