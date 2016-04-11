/*****************************************************************************/
/* PrivateNote: Event Handlers */
/*****************************************************************************/
Template.PrivateNote.events({
  'click .removeStd': function (e) {
    var dataObject = {};
    var classId = $(e.target).data('classid');
    dataObject.classId = classId;
    dataObject.userId = Router.current().params._id;

    Meteor.call("class/removeStd", dataObject, function (error, result) {
      if (error) {
        log.error("error", error);
      } else {
        // alert("remove success!");
        Router.go('TabClasses');
      }
    });
  }
});

/*****************************************************************************/
/* PrivateNote: Helpers */
/*****************************************************************************/
Template.PrivateNote.helpers({
  username: function (argument) {
    var userObj = Meteor.users.findOne(Router.current().params._id);
    return Smartix.helpers.getFullNameByProfileObj(userObj.profile);
  },
  Comments: function () {
    return lodash.get(Commend.findOne({
        userId: Router.current().params._id,
        classId: Router.current().params.classId
      }), 'comment') || "";
  },
  getJoinedClassCreatedByMe: function (argument) {
    return Smartix.Groups.Collection.find({
        type: 'class',
        users: Router.current().params._id,
        admins: Meteor.userId()
    });
  }
});

/*****************************************************************************/
/* PrivateNote: Lifecycle Hooks */
/*****************************************************************************/
Template.PrivateNote.onCreated(function () {
});

Template.PrivateNote.onRendered(function () {
});

Template.PrivateNote.onDestroyed(function () {
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
        log.error("error", error);
      } else {
        window.history.back();
      }
    });
  }
});
