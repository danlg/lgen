/*var isValid = ReactiveVar(false);*/
/*****************************************************************************/
/* ClassEdit: Event Handlers */
/*****************************************************************************/
Template.ClassEdit.events({
  'click .removeAllUserBtn':function(){

    Meteor.call("class/deleteUser",this.classObj,function(){
        alert("success removed!");
      });
  },
  'click .removeClass':function(){
    Meteor.call("class/delete",this.classObj,function(){
        Router.go("Classes");
      });
  }
});

/*****************************************************************************/
/* ClassEdit: Helpers */
/*****************************************************************************/
Template.ClassEdit.helpers({
  classObj:function(){
    return Classes.findOne();
  },
  classId:function(){
    return Classes.findOne()._id;
  },
});

/*****************************************************************************/
/* ClassEdit: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassEdit.created = function () {
};

Template.ClassEdit.rendered = function () {
};

Template.ClassEdit.destroyed = function () {
};

Template.ionNavBar.events({
  'click .saveClassBtn':function(){
    AutoForm.submitFormById("#updateClass");
  }
});
