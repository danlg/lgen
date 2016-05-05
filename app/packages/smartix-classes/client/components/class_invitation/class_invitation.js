Template.ClassInvitation.helpers({
  classCode: function (argument) {
    return Router.current().params.classCode;
  },
  className: function () {
    var classObj = Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    });
    return classObj ? classObj.className : "";
  }
});