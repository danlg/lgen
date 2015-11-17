/*
 Client and Server Methods */

Meteor.methods({

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
    Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.role': role}}, function (err) {
      if (err) {
        log.error(err);
        return err;
      }
      else return true;
    });
  },

  'class/classCodeIsAvailable': function (classCode) {
    var query = {};
    if (classCode) {
      query.classCode = classCode.trim().toLowerCase() ;
      log.info(query);
      return Classes.findOne(query) ? false : true;
    }
    return false;
  },
  
  'class/search': function (classCode) {
    var query = {};
    if (classCode) {
      query.classCode = classCode.trim().toLowerCase();
      query.createBy = {$ne: Meteor.userId()};
      log.info("class/search:"+ query);
      return Classes.findOne(query) || false;
    }
    return false;
  },

  'class/searchExact': function (classCode) {
    var query = {};
    if (classCode) {
      query.classCode = classCode.trim().toLowerCase();
      log.info(query);
      return Classes.findOne(query) || false;
    }
    return false;
  },

  'class/join': function (doc) {
    
    if (doc && doc.classCode) {
      var classCode = doc.classCode.trim().toLowerCase();
      var query = {};
      query.classCode = classCode;
      log.info("class/join:" + query);
      var classDetail = Classes.findOne(query);
      log.info(classDetail);
      if (classDetail) {
        if (classDetail.createBy === Meteor.userId()) {
          log.error("you can't join the class you own.")
          return false;
        }
        else{
          Classes.update(doc, { $addToSet: { "joinedUserId": Meteor.userId() } });
          return true;
        }
      } else { //class is not found
          log.error("class is not found.")
          return false;
      }
    }else{
      log.error("there is no input");
    }
    return false;
  },

  'class/leave': function (classId) {
    Classes.update({_id: classId}, {$pull: {"joinedUserId": Meteor.userId()}});
  },

  'class/leaveByCode': function (classCode) {
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
