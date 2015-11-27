/*var isValid = ReactiveVar(false);*/
/*****************************************************************************/
/* ClassEdit: Event Handlers */
/*****************************************************************************/
Template.ClassEdit.events({
  'click .removeAllUserBtn': function () {

    Meteor.call("class/deleteUser", Classes.findOne(), function () {
      alert("success removed!");
    });
  },
  'click .removeClass': function () {
    Meteor.call("class/delete", Classes.findOne(), function () {
      Router.go('TabClasses');
    });
  },
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
    return Classes.findOne({classCode: Router.current().params.classCode});
  },
  classObj: function () {
    return Classes.findOne({classCode: Router.current().params.classCode});
  },
  classId: function () {
    return Classes.findOne()._id;
  },
  getNewlyChosenAvatar:function(){
    var chosenIcon = Session.get('chosenIconForEditClass');
    if(chosenIcon){
      return chosenIcon;
    }
  }
});

/*****************************************************************************/
/* ClassEdit: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassEdit.created = function () {
};

Template.ClassEdit.rendered = function () {
};

Template.ClassEdit.destroyed = function () {
  delete Session.keys['chosenIconForEditClass'];
};

Template.ionNavBar.events({
  'click .saveClassBtn': function () {
    AutoForm.submitFormById("#updateClass");
  }
});
