/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

Template.ClassAttendance.onCreated(function(){
    var self = this;
    this.autorun(function(){
      self.subscribe('smartix:classes/classByClassCode', Router.current().params.classCode);
      self.subscribe('smartix:classes/classMembers', Router.current().params.classCode);
    })
    this.studentsPresent = new ReactiveVar([]);;
    this.studentsAbsent = new ReactiveVar([]);;

});

Template.ClassAttendance.onRendered( function() {
});

Template.ClassAttendance.destroyed = function () { };

Template.ClassAttendance.events({
 'click .studentProfile': function(event, template){
        let currentStudentId = $(event.currentTarget).attr('id');
        let studentsPresent = template.studentsPresent.get();
        let studentsAbsent = template.studentsAbsent.get();
        //if current student in studentsPresent array, move to studentsAbsent array
        if (studentsPresent.indexOf(currentStudentId) !== -1){
            lodash.remove(studentsPresent, function(studentsId){
                return studentsId === currentStudentId;
            });
            studentsAbsent.push(currentStudentId);
            template.studentsPresent.set(studentsPresent);
            template.studentsAbsent.set(studentsAbsent);
            log.info("absentPresent", studentsPresent)
            log.info("absent", studentsAbsent)
        }
        //else add to studentsPresent array
        else{
            studentsPresent.push(currentStudentId);
            template.studentsPresent.set(studentsPresent);
            if (studentsAbsent.indexOf(currentStudentId) !== -1){
                lodash.remove(studentsAbsent, function(studentsId){
                    return studentsId === currentStudentId;
                });
            }
            log.info("Present", studentsPresent);
        }
    },
    
    'click .submitAttendance': function(event, template){
        let date = moment().format('DD/MM/YYYY').toString();
        log.info(date);
        let studentsAbsent = template.studentsAbsent.get();
        let currentSchoolName = UI._globalHelpers['getCurrentSchoolName']();
        IonPopup.show({
            title: TAPi18n.__("absence.ConfirmToMarkAbsent1")+ studentsAbsent.length + TAPi18n.__("absence.ConfirmToMarkAbsent2"),
            subTitle: TAPi18n.__("Admin.Date")+": " + date,
            buttons: [
                {
                    text: TAPi18n.__("Cancel"),
                    type: 'button-grey',
                    onTap: function () {
                        IonPopup.close();
                    }
                },                
                {
                    text: TAPi18n.__("Confirm"),
                    type: 'button-positive',
                    onTap: function () {
                        IonPopup.close();
                        //add record here
                        Meteor.call('smartix:absence/recordRollCall', studentsAbsent, date, Router.current().params.classCode, currentSchoolName, function(err, res){
                            if(err)
                            {
                                toastr.error(TAPi18n.__("absence.LeaveNoticeFailed"));
                            }
                            else{
                                toastr.info(TAPi18n.__("absence.Submitted"));
                                Router.go('TabClasses');
                            }
                        });
                    }
                }

            ]
        });
    }
});

/*****************************************************************************/
/* ClassUsers: Helpers */
/*****************************************************************************/
Template.ClassAttendance.helpers({
  usersProfile: function () {
    //uses data from subscription otherClassmates
    //select users from Meteor who is not current user and has joined this class
      var allUsers = Meteor.users.find({},{sort: { 'profile.lastName': 1, 'profile.firstName': 1}}).fetch();
      let currentSchoolId =  UI._globalHelpers['getCurrentSchoolId']()
      if (allUsers.length < 1) {
        return false;
      } else {
          let students = [];
          lodash.forEach(allUsers, function(user){
              if(Roles.userIsInRole(user._id, Smartix.Accounts.School.STUDENT, currentSchoolId))
                students.push(user);
          })
        return students;
      } 
  },
  
  isPresent:function(studentId){
      return (Template.instance().studentsPresent.get().indexOf(studentId) !== -1);
  },
  
  isAbsent:function(studentId){
      return (Template.instance().studentsAbsent.get().indexOf(studentId) !== -1);
  },
  
  isEmoji: function(userObj)
  {
      return (userObj.profile.avatarType === 'emoji') ? true : false;
  },
  
  isAdmin: function(userId)
  {
    var classObj = Smartix.Groups.Collection.findOne({
        type: 'class',
    });
    if(classObj){
      var userArray = classObj.admins;
      return lodash.includes(userArray, userId);
    }
    else
      return;
  },
  
  emptyList: function () {
    //select users from Meteor who is not current user and has joined this class
    return Meteor.users.find().count() === 0 ;
  },

  classObj: function () {
    return Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    });
  }
  
});