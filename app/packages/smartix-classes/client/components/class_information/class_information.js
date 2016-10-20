/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

Template.ClassInformation.onCreated(function(){
  this.subscribe('smartix:classes/adminsOfClass', Router.current().params.classCode),
  this.subscribe('smartix:classes/classByClassCode', Router.current().params.classCode)
})

/*****************************************************************************/
/* ClassInformation: Event Handlers */
/*****************************************************************************/
Template.ClassInformation.events({
  'click .unsub': function () {
    Meteor.call('class/leaveByCode', Router.current().params.classCode, function () {
      Router.go('TabClasses')
    })
  }
});

/*****************************************************************************/
/* ClassInformation: Helpers */
/*****************************************************************************/
Template.ClassInformation.helpers({
  classObj: function () {
    return Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode});
  },
  teachers: function () {
    var teacherUser = Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    });
    if(teacherUser) {
        return Meteor.users.find( { _id: { $in: teacherUser.admins } } ).fetch();
    }
  },

  isEmoji: function(teacherObj){
    return (teacherObj.profile.avatarType === 'emoji') ? true : false;
  }
});