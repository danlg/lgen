/*****************************************************************************/
/* Commend: Event Handlers */
/*****************************************************************************/
Template.Commend.events({
  'click .removeStd': function (e) {
    var dataObject = {};
    var classId = $(e.target).data('classid');
    dataObject.classId = classId;
    dataObject.userId = Router.current().params._id;

    Meteor.call("class/removeStd", dataObject, function (error, result) {
      if (error) {
        console.log("error", error);
      } else {
        // alert("remove success!");
        Router.go('TabClasses');
      }
    });
  }
});

/*****************************************************************************/
/* Commend: Helpers */
/*****************************************************************************/
Template.Commend.helpers({
  username: function (argument) {
    var userObj = Meteor.users.findOne(Router.current().params._id);
    return getFullNameByProfileObj(userObj.profile);
  },
  Comments: function () {
    return lodash.get(Commend.findOne({
        userId: Router.current().params._id,
        classId: Router.current().params.classId
      }), 'comment') || "";
  },
  getJoinedClassCreatedByMe: function (argument) {
    return Classes.find({joinedUserId: Router.current().params._id, createBy: Meteor.userId()});
  }
});

/*****************************************************************************/
/* Commend: Lifecycle Hooks */
/*****************************************************************************/
Template.Commend.onCreated(function () {
});

Template.Commend.onRendered(function () {
});

Template.Commend.onDestroyed(function () {
});

Template.ionNavBar.events({
  'click .doneCommentsBtn': function (e, template) {
    var comment = $('.Comments').val();
    var commentObj = {};
    commentObj.classId = Router.current().params.classId;
    commentObj.userId = Router.current().params._id;
    commentObj.comment = comment;

    Meteor.call("giveComment", commentObj, function (error, result) {
      if (error) {
        console.log("error", error);
      } else {
        window.history.back();
      }
    });
  }
});
