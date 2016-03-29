Meteor.publish('class', function () {
  var result =  Classes.find({ $or: [{
    joinedUserId: {"$in" : [this.userId]}
  },{createBy: this.userId}]});
  return result;
});
Meteor.publish('getClassByClassId', function (classId) {
  return Classes.find(classId);
});
Meteor.publish('getClassMsgId', function (msgId) {
  return Classes.find({
    messagesObj: {
      $elemMatch: {
        msgId: msgId
      }
    }
  });
});
Meteor.publish('personCreateClass', function (classCode) {
  var targetClass = Classes.findOne({classCode: classCode});
  
  if(targetClass){
    var ownId = _.pick(targetClass, 'createBy');
    return Meteor.users.find({
      _id: ownId.createBy
    });
  }else{
    //http://stackoverflow.com/questions/25709362/stuck-on-loading-template
    //this.ready() indicates nothing return; you cannot use return "" or return null in such case
    this.ready();
  }
});


Meteor.publish('joinedClass', function () {
  return Classes.find({
    joinedUserId: this.userId
  });
});

//get all users that have joined current teacher's classes
Meteor.publish('getAllJoinedClassesUser', function () {
  //find the classes create by teacher using teacher's userid
  var classes = Classes.find({
    createBy: this.userId 
  }).fetch(); //fetch is used to extract the result to an array.
  
  //extract only the joinedUserId fields to another array  
  var arr = lodash.map(classes, 'joinedUserId'); 

  //flatten the array from 2D to 1D array for easy use
  arr = lodash.pull(lodash.flatten(arr), this.userId); 
  
  //in the above arr, it contains a list of userid who have joined the class, so we use this list
  //to search the users' info in Meteor.users
  return Meteor.users.find({
    _id: {
      $in: arr
    }
  });
});

//get all the users who have created my joined classes'
Meteor.publish('getAllJoinedClassesCreateBy', function () {

  //if user is a student and is below 13, set isStudentBelow13 as true
  var currentUser = Meteor.users.findOne(this.userId);
  var isStudentBelow13 = false;
  if(currentUser.profile.role == "Student"){
    var dob = currentUser.profile.dob;
    var age = moment().diff(dob,'years');
    if(age < 13){
      isStudentBelow13 = true;
      log.info("isStudentBelow13:true:dob:"+dob+":age:"+age);
    }
  }
  
  //find the classes I have joined by my userid
  //and the class creator allows anyone in this class to start a chat    
  var myJoinedClasses;
  if(isStudentBelow13){
    myJoinedClasses = Classes.find({
      joinedUserId: this.userId,
      anyoneCanChat: true,
      higherThirteen: false //since the current user is younger than 13, 
                            //the classes with higherThirteen as true would not be searched
    }).fetch();;       
  }else{
    myJoinedClasses = Classes.find({
      joinedUserId: this.userId,
      anyoneCanChat: true
    }).fetch();;    
  }
    
  // extra the createBy fields to another array
  var arr = lodash.map(myJoinedClasses, 'createBy'); 
  
  //in the above arr, it contains a list of userid who have created the class, so we use this list
  //to search the users' info in Meteor.users
  return Meteor.users.find({ 
    _id: {
      $in: arr 
    }
  });  
  
});

Meteor.publish('getJoinedClassUser', function () {
 
   var joinedClasses =  Classes.find({ $or: [{
        joinedUserId: {"$in" : [this.userId]}
    }, {createBy: this.userId} ]}).fetch();

  //log.info(joinedClasses);
  var allJoinedClassesUserId = [];
  joinedClasses.map(function(currentClass){
      Array.prototype.push.apply(allJoinedClassesUserId, currentClass.joinedUserId);
      //allJoinedClassesUserId.concat(currentClass.joinedUserId);
  });

  log.info(allJoinedClassesUserId);

  //var joinedUserId = classObj.joinedUserId;
  return Meteor.users.find({
    _id: {
      $in: allJoinedClassesUserId
    }
  }, {fields: {'profile': 1,'_id':1}});
});