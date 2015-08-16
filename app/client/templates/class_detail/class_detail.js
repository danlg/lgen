/*****************************************************************************/
/* ClassDetail: Event Handlers */
/*****************************************************************************/
Template.ClassDetail.events({
});

/*****************************************************************************/
/* ClassDetail: Helpers */
/*****************************************************************************/
Template.ClassDetail.helpers({
  classObj:Classes.findOne(),
  classCode:function(){
    var classObj =  Classes.findOne();
    return classObj.classCode;
  }
});

/*****************************************************************************/
/* ClassDetail: Lifecycle Hooks */
/*****************************************************************************/
Template.ClassDetail.created = function () {
};

Template.ClassDetail.rendered = function () {
};

Template.ClassDetail.destroyed = function () {

};
