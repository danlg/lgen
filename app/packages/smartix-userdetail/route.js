Router.route('UserDetail', {
  path: "/user/:_id/:classCode?/:classId?",
  waitOn: function () {
    var subList = [];
    if (this.params.classCode) {
      subList.push(Meteor.subscribe('class', this.params.classCode));
    }
    if (this.params.classId) {
      subList.push(Meteor.subscribe('getCommentsByClassIdNId', this.params.classId, this.params._id));
    }
    subList.push(Meteor.subscribe('getUserById', this.params._id));
    subList.push(Meteor.subscribe('getJoinedClassByUserId', this.params._id));
    return subList;
  }
});