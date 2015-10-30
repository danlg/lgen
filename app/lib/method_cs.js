/*****************************************************************************/
/* Client and Server Methods */
/*****************************************************************************/
Meteor.methods({
  /*
   * Example:
   *
   * '/app/items/insert': function (item) {
   *  if (this.isSimulation) {
   *    // do some client stuff while waiting for
   *    // result from server.
   *    return;
   *  }
   *
   *  // server method logic
   * }
   */
  /*'user/create':function(userObj){
   if(!lodash.has(userObj,'dob')){
     userObj.dob="";
   }

   Accounts.createUser({
     email : userObj.email,
     password : userObj.password,
     profile:{
     firstname : userObj.first,
     lastname : userObj.last,
     role    : userObj.role,
     dob = userObj.dob
   }

   })
   },*/

  'signup/email': function (doc) {
    if (!lodash.has(doc, 'dob')) {
      doc.dob = "";
    }
    Accounts.createUser({
      email: doc.email,
      password: doc.password,
      profile: {
        firstname: doc.firstname,
        lastname: doc.lastname,
        role: doc.role,
        dob: doc.dob
      }
    });
  },

  'user/role/update': function (role) {
    /*var userObj  = Meteor.user();
     userObj.profile.role = role;
     Meteor.users.upsert(Meteor.userId(),{$set:userObj},function(err){
     if(err){
     console.log(err);
     return err;
     }else{
     return
     }
     });*/

    Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.role': role}}, function (err) {
      if (err) {
        console.log(err);
        return err;
      }
      else {
        return true;
      }
    });
  },

  'class/search': function (classCode) {
    //  check(doc,Schema.joinClass)
    //  Classes.update(doc,{$addToSet:{"joinedUserId":Meteor.userId()}});
    var query = {};
    query.classCode = new RegExp('^' + classCode, 'i');
    query.createBy = {$ne: Meteor.userId()};
    console.log(query);
    return Classes.findOne(query) || false;
  },

  'class/join': function (doc) {
    
    //TODO : put the below checking inside joinClass schema and return a proper error message
    var query = {};
    query.classCode = new RegExp('^' + doc.classCode, 'i');    
    var classDetail = Classes.findOne(query);
    if(classDetail.createBy == Meteor.userId()){
      //console.log("you can't join the class you own.")

      return "you can't join the class you own";
    }
    //TODO : end
    
    check(doc, Schema.joinClass);
    doc.classCode = new RegExp('^' + doc.classCode, 'i');
    Classes.update(doc, {$addToSet: {"joinedUserId": Meteor.userId()}});
  },

  'class/leave': function (classId) {
    /*check(doc,Schema.leaveClass)*/
    /*Classes.update(doc,{$pull:{"joinedUserId":Meteor.userId()}});*/
    Classes.update({_id: classId}, {$pull: {"joinedUserId": Meteor.userId()}});
  },

  'class/leaveByCode': function (classCode) {
    /*check(doc,Schema.leaveClass)*/
    /*Classes.update(doc,{$pull:{"joinedUserId":Meteor.userId()}});*/
    Classes.update({classCode: classCode}, {$pull: {"joinedUserId": Meteor.userId()}});
  },

  'class/deleteUser': function (classObj) {
    Classes.update(classObj, {$set: {joinedUserId: []}});
  },

  'class/delete': function (classObj) {
    Classes.remove(classObj);
  },

  'class/update': function (doc) {
    Classes.update({_id: doc._id}, {$set: doc});
  },

  'chat/sendMessage': function (chatRoomId, text) {
    var pushObj = {};
    pushObj.from = Meteor.userId();
    pushObj.sendAt = moment().format('x');
    pushObj.text = text;

    Chat.update(chatRoomId, {$push: {messagesObj: pushObj}});
    //TODO send email
    //Mandrill.messages.send
  },

  'chat/sendImage': function (chatRoomId, pushObj) {
    //  var pushObj = {};
    //    pushObj.from = Meteor.userId();
    //    pushObj.sendAt = moment().format('x');
    //    pushObj.text = text;
    Chat.update(chatRoomId, {$push: {messagesObj: pushObj}});
  },

  'getUserByIdArr': function (chatIds) {
    lodash.pull(chatIds, Meteor.userId());
    return Meteor.users.findOne({_id: {$in: chatIds}});
  },

  'profile/edit': function (doc) {
    var email = doc.email;
    doc = lodash.omit(doc, 'email');
    var _id = Meteor.userId();
    var ModifiedDoc = lodash.assign(Meteor.user().profile, doc);

    Meteor.users.update({_id: _id}, {$set: {profile: ModifiedDoc}});
    var emailarr = lodash.map(Meteor.user().emails, 'address');

    if (!lodash.includes(emailarr, email)) {
      Meteor.users.update({_id: Meteor.user()._id}, {$push: {emails: {address: email, "verified": false}}});
    }
    /*Meteor.users.update({_id:Meteor.userId()},{$set:{'emails.$.items.0.address':}});*/
  },

  'profileUpdateByObj': function (user) {
    var usersProfile = user.profile;
    Meteor.users.update(Meteor.userId(), {$set: {profile: usersProfile}});
  }

});
