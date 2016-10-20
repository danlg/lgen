/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*var isValid = ReactiveVar(false);*/
/*****************************************************************************/
/* ClassEdit: Event Handlers */
/*****************************************************************************/
Template.ClassEdit.events({
  'click #pick-an-icon-btn':function(){
    var parentDataContext= {iconListToGet:"iconListForClass",sessionToBeSet:"chosenIconForEditClass"};
    IonModal.open("ClassIconChoose", parentDataContext);
  }
});

/*****************************************************************************/
/* ClassEdit: Helpers */
/*****************************************************************************/
Template.ClassEdit.helpers({
  classCode: function () {
    return Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    });
  },
  classObj: function () {
    return Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    });
  },
  classId: function () {
    return Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    })._id;
  },
  getNewlyChosenAvatar:function(){
    var chosenIcon = Session.get('chosenIconForEditClass');
    if(chosenIcon){
      return chosenIcon;
    }
  }
});

/* ClassEdit: Lifecycle Hooks */
Template.ClassEdit.onCreated( function() {
  this.subscribe('smartix:classes/classByClassCode', Router.current().params.classCode);
});

Template.ClassEdit.onRendered( function() {
});

Template.ClassEdit.destroyed = function () {
  delete Session.keys['chosenIconForEditClass'];
};

Template.ionNavBar.events({
  'click .saveClassBtn': function () {
    AutoForm.submitFormById("#updateClass");
  }
});
