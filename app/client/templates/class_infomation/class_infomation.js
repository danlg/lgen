/*****************************************************************************/
/* ClassInfomation: Event Handlers */
/*****************************************************************************/
Template.ClassInfomation.events({
  'click .unsub':function(){
    Meteor.call('class/leaveByCode',Router.current().params.classCode,function(){
          Router.go('Classes')
      })
  }
});

/*****************************************************************************/
/* ClassInfomation: Helpers */
/*****************************************************************************/
Template.ClassInfomation.helpers({
  classObj:function(){
    return Classes.findOne();
  },
  teacher:function(){
    return Meteor.users.findOne({_id:{$nin :[Meteor.userId()]}});
  }
});

/*****************************************************************************/
/* ClassInfomation: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassInfomation.created = function () {
};

Template.ClassInfomation.rendered = function () {


};

Template.ClassInfomation.destroyed = function () {
};
