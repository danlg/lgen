/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*
 Client and Server Methods */
//we factor the code in this method
var classSearchImpl = function (classCode) {
  if (classCode) {
    log.info ("class/search:"+ classCode.trim());
    var regexp = new RegExp("^" + classCode.trim()+ "$", "i");
    var resultset = Classes.findOne({"classCode":  {$regex: regexp} });//OK
    return resultset || false;
    //query.createBy = {$ne: Meteor.userId()};
  }
  return false;
};

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

  //todo remove redundant API function
  'class/classCodeIsAvailable': function(classCode) { return !classSearchImpl(classCode); },
  
  'class/search': classSearchImpl,

  //todo remove redundant API function
  'class/searchExact': classSearchImpl,

  'class/join': function (doc) {
    if (doc && doc.classCode) {
      log.info ("class/join:"+ doc.classCode.trim());
      var classCode = doc.classCode.trim();
      var regexp = new RegExp("^" + classCode.trim()+ "$", "i");
      var resultset   = Classes.findOne({"classCode":  {$regex: regexp} });//OK
      // Creates a regex of: /^classCode$/i
      //log.info("class/join0:'" + classCode +"'");

      //log.info ("class/join1:"+ resultset);

      //var query = {};
      //query.classCode = regexp;
      //var res = Classes.findOne(query);//OK
      if (resultset) {
        if (resultset.createBy === Meteor.userId()) {
          log.warn("class/join: can't join the class you own:"+classCode+":from user:"+Meteor.userId());
          return false;
        }
        else{
          log.info("User " + Meteor.userId() + " attempting to join class "+ doc.classCode);
          //log.info("Server?"+Meteor.isServer);
          //this was the trick to make it case insensitive
          Classes.update(
            {"classCode":  {$regex: regexp} },
            { $addToSet: { "joinedUserId": Meteor.userId() }
            });
          return true;
        }
      } else { //class is not found
        log.info("classcode '" + classCode + "' not found");
        //log.info("Server?"+Meteor.isServer);
        return false;
      }
    }else{
      log.warn("there is no input");
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
    //todo: change the name of this method to chat/appendMessageObj to reflect its usage
    Chat.update(chatRoomId, {$push: {messagesObj: pushObj}});
  },

  'getUserNameById': function (userid) {
    var rawResult= Meteor.users.findOne({_id: userid});
    
    if(rawResult){
      return rawResult.profile.name;
    }else{
      return "";
    }
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
