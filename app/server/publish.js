/**
 * Meteor.publish('items', function (param1, param2) {
 *  this.ready();
 * });
 */



Meteor.publish('class', function (classCode) {
  return Classes.find({classCode:classCode});
});
Meteor.publish('personCreateClass', function (classCode) {
  var ownId = _.pick(Classes.findOne({classCode:classCode}),'createBy');
  return Meteor.users.find({_id:ownId});
});


Meteor.publish('joinedClass', function () {
  return Classes.find({joinedUserId:this.userId});
});

Meteor.publish('createdClassByMe', function () {
  return Classes.find({createBy:this.userId});
});

Meteor.publish('user', function (_id) {
  return Meteor.users.find({_id:_id});
});



Meteor.publish('getJoinedClassUser', function (classCode) {
    var classObj =  Classes.findOne({classCode:classCode});
    var joinedUserId = classObj.joinedUserId;
    console.log(Meteor.users.find({_id:{$in:joinedUserId}}).fetch());

  return Meteor.users.find({_id:{$in:joinedUserId}});
});
