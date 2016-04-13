/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
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
  'class/search': Smartix.Class.searchForClassWithClassCode,

  //todo remove redundant API function
  'class/searchExact': Smartix.Class.searchForClassWithClassCode,

  'class/join': function (doc) {
    if (doc && doc.classCode) {
      log.info ("class/join:"+ doc.classCode.trim());
      var classCode = doc.classCode.trim();
      var regexp = new RegExp("^" + classCode.trim()+ "$", "i");
      var resultset   = Smartix.Groups.Collection.findOne({"classCode":  {$regex: regexp} });//OK
      // Creates a regex of: /^classCode$/i
      //log.info("class/join0:'" + classCode +"'");

      //log.info ("class/join1:"+ resultset);

      //var query = {};
      //query.classCode = regexp;
      //var res = Classes.findOne(query);//OK
      if (resultset) {
        if (resultset.admins.indexOf(Meteor.userId()) > -1) {
          log.warn("class/join: can't join the class you own:"+classCode+":from user:"+Meteor.userId());
          return false;
        }
        else{
          log.info("User " + Meteor.userId() + " attempting to join class "+ doc.classCode);
          //log.info("Server?"+Meteor.isServer);
          //this was the trick to make it case insensitive
          Smartix.Groups.Collection.update(
            {"classCode":  {$regex: regexp} },
            { $addToSet: { users: Meteor.userId() }
            });
          return true;
        }
      } else { //class is not found
        log.info("classcode '" + classCode + "' not found");
        //log.info("Server?"+Meteor.isServer);
        return false;
      }
    } else {
      log.warn("there is no input");
    }
    return false;
  },

  'class/leave': function (classId) {
    Smartix.Groups.Collection.update({_id: classId}, {$pull: {users: Meteor.userId()}});
  },

  'class/leaveByCode': function (classCode) {
    Smartix.Groups.Collection.update({classCode: classCode}, {$pull: {users: Meteor.userId()}});
  },

  'class/deleteUser': function (classObj,userid) {
    Smartix.Groups.Collection.update(classObj, {$pull: {users: userid}});
  },

  'class/deleteAllUser': function (classObj) {
    Smartix.Groups.Collection.update(classObj, {$set: {users: []}});
  },

  'class/delete': function (classObj) {
    Smartix.Groups.Collection.remove(classObj);
  },

  'class/update': function (doc) {
    Smartix.Groups.Collection.update({_id: doc._id}, {$set: doc});
  },


  'getUserNameById': function (userid) {
    var rawResult= Meteor.users.findOne({_id: userid}); 
    
    if(rawResult){
      return rawResult.profile.firstname+" "+rawResult.profile.lastname;
    }else{
      return "";
    }
  },
  
  'getUserByIdArr': function (chatIds) {
    lodash.pull(chatIds, Meteor.userId());
    return Meteor.users.findOne({_id: {$in: chatIds}});
  },

  'profile/edit': function (doc) {
    
    //console.log('profile/edit','only changes would be inputted',doc);
    var email = doc.email;
    doc = lodash.omit(doc, 'email')   
    Meteor.call('smartix:accounts-global/updateGlobalUser',Meteor.userId(),{
       profile: doc 
    });
    
    /*var email = doc.email;
    doc = lodash.omit(doc, 'email');
    var _id = Meteor.userId();
    var ModifiedDoc = lodash.assign(Meteor.user().profile, doc);

    Meteor.users.update({_id: _id}, {$set: {profile: ModifiedDoc}});
    var emailarr = lodash.map(Meteor.user().emails, 'address');

    if (!lodash.includes(emailarr, email)) {
      Meteor.users.update({_id: Meteor.user()._id}, {$push: {emails: {address: email, "verified": false}}});
    }*/
    /*Meteor.users.update({_id:Meteor.userId()},{$set:{'emails.$.items.0.address':}});*/
  },

  'profileUpdateByObj': function (user) {
    var usersProfile = user.profile;
    Meteor.users.update(Meteor.userId(), {$set: {profile: usersProfile}});
  },
  'getSimilarOrganizations':function(inputOrganizationKeyword){
      
            var regexp = new RegExp("^"+inputOrganizationKeyword,"i");
            var rawResultSet = Meteor.users.find({"profile.organization":  {$regex: regexp} }).fetch();//OK
            //log.info(rawResultSet);
            var resultSet = lodash.map(rawResultSet,'profile.organization');
            //log.info(resultSet);  
            
            return resultSet;    
  },
  'getSimilarCities':function(inputCityKeyword){
      
            var regexp = new RegExp("^"+inputCityKeyword,"i");
            var rawResultSet = Meteor.users.find({"profile.city":  {$regex: regexp} }).fetch();//OK
            //log.info(rawResultSet);
            var resultSet = lodash.map(rawResultSet,'profile.city');
            //log.info(resultSet);  
            
            return resultSet;    
  },

  updateMsgRating: function (type, msgId, classObj) {
    log.info("updateMsgRating:",type,msgId,classObj);
    var filtedArr = lodash.findByValues(classObj.messagesObj, "msgId", msgId);
    log.info("updateMsgRating:filtedArr",filtedArr);    
    if(filtedArr[0].checked){
 
         
        var arr = ["star", "checked", "close", "help"];
        var selector = {};
        selector.classCode = classObj.classCode;
        selector.messagesObj = {
        $elemMatch: {
            msgId: msgId
        }
        };
        _.forEach(arr, function (element, index) {
        var updateObj = {};
        updateObj['messagesObj.$.' + element] = {_id: Meteor.userId()};
        Smartix.Groups.Collection.update(
            selector,
            {$pull: updateObj}
        );
        });
        if (type) {
        var updateObj2 = {};
        updateObj2['messagesObj.$.' + type] = Meteor.user();
        Smartix.Groups.Collection.update(
            {classCode: classObj.classCode, messagesObj: {$elemMatch: {msgId: msgId}}},
            {$push: updateObj2,
             $set: {
                        'lastUpdatedBy':voteUpdatedBy,
                        'lastUpdatedAt':voteUpdatedAt
                    }
            }
        );
        }    
               
       

    }else{
        var updateObj = {};
        var selector = {classCode:classObj.classCode,messagesObj:{$elemMatch:{msgId:msgId}}}
        var currentMessage = Smartix.Groups.Collection.findOne({classCode:classObj.classCode});
        //log.info(currentMessage);
        var msgIndex = lodash.findIndex(currentMessage.messagesObj,{'msgId':msgId});
        //log.info(msgIndex);
        updateObj['messagesObj.$.vote.voteOptions.0.votes'] = Meteor.userId();
        Smartix.Groups.Collection.update(
            selector,
            {$pull: updateObj}
        );
        
        updateObj['messagesObj.$.vote.voteOptions.1.votes'] = Meteor.userId();
        Smartix.Groups.Collection.update(
            selector,
            {$pull: updateObj}
        );  

        updateObj['messagesObj.$.vote.voteOptions.2.votes'] = Meteor.userId();
        Smartix.Groups.Collection.update(
            selector,
            {$pull: updateObj}
        );  
        updateObj['messagesObj.$.vote.voteOptions.3.votes'] = Meteor.userId();
        Smartix.Groups.Collection.update(
            selector,
            {$pull: updateObj}
        );          
       
        if (type) {
        var voteIndex = lodash.findIndex(currentMessage.messagesObj[msgIndex].vote.voteOptions,{'voteOption':type});
        var updateObj2 = {};
        updateObj2['messagesObj.'+msgIndex+'.vote.voteOptions.'+voteIndex+'.votes'] = Meteor.userId();
        //var elemMatchStr = 'messagesObj.'+msgIndex+'.vote.voteOption.'+voteIndex;
        //log.info(elemMatchStr);

        var voteUpdatedBy = Meteor.userId();
        var voteUpdatedAt = new Date();
        var messageObj
        Smartix.Groups.Collection.update(
            {classCode: classObj.classCode},
            {$push: updateObj2,
             $set: {
                        'lastUpdatedBy':voteUpdatedBy,
                        'lastUpdatedAt':voteUpdatedAt
                    }
            }
        );
        }          
    }
  },
  addCommentToClassAnnoucement :function(msgId,classObj,comment){
  //e.g Meteor.call('addCommentToClassAnnoucement','Hv4WrMysxGfeCEDRu',{_id:'GgWku5L8D9kLXjFyR'},'hi')
      var targetClass ={
          _id: classObj._id,
          
          messagesObj:{
            $elemMatch: {
                msgId: msgId,
                'comment.allowComment':true
            }              
          }
      };
      
      var commentUpdatedBy = Meteor.userId();
      var commentUpdatedAt = new Date();
      var newCommentObj ={ _id: Random.id(),
                            comment:comment,
                            createdAt:commentUpdatedAt,
                            createdBy:commentUpdatedBy,
                            isShown:true,
                            lastUpdatedBy:commentUpdatedBy,
                            lastUpdatedAt:commentUpdatedAt
                          };
      
      //push new comment and at the same time update lastUpdatedAt fields
      Smartix.Groups.Collection.update( targetClass,{$push: {'messagesObj.$.comment.comments': newCommentObj},
                                   $set: {'messagesObj.$.lastUpdatedAt': commentUpdatedAt,
                                          'messagesObj.$.lastUpdatedBy': commentUpdatedBy,
                                          'lastUpdatedBy':commentUpdatedBy,
                                          'lastUpdatedAt':commentUpdatedAt} },
                                    {
                                     validate: false
                                    } );
            
      var updatedClass=  Smartix.Groups.Collection.findOne(targetClass);
      Meteor.call('insertNotification',{
         eventType:"newclasscomment",
         userId: updatedClass.admins[0],
         hasRead: false,
         classid: updatedClass._id,
         classCode: updatedClass.classCode,
         commentId: newCommentObj._Id,
         messageCreateTimestamp: newCommentObj.createdAt,
         messageCreateTimestampUnixTime: moment(newCommentObj.createdAt).unix(),
         messageCreateByUserId: Meteor.userId()
     });
       
  },
  showHideComment:function(isShown,classid,messageid,commentid){
     var currentClassObj = Smartix.Groups.Collection.findOne(classid);
     var currentMessagesObjIndex = lodash.findIndex(currentClassObj.messagesObj,{"msgId":messageid});
     var currentCommentObjIndex = lodash.findIndex(currentClassObj.messagesObj[currentMessagesObjIndex].comment.comments,{"_id":commentid});
     
     //currentClassObj.messagesObj[currentMessagesObjIndex].comment.comments[currentCommentObjIndex].isShown = isShown;
     
     var modifier = { $set: {} };
     modifier.$set['messagesObj.'+currentMessagesObjIndex+'.comment.comments.'+currentCommentObjIndex+'.isShown'] = isShown;
     
     Smartix.Groups.Collection.update(classid, modifier,{validate: false});
     
  },


});

Smartix = Smartix || {};

Smartix.sendEmailMessageToClasses = function(targetUserids, classes, message, originateUser){
  
  //if it is a solely image or voice message, exit early.
  if(message == ""){
    return;
  }
  
  var arrayOfTargetUsers = Meteor.users.find({ _id: { $in: targetUserids } }).fetch();
  log.info("sendEmailMessageToClasses:arrayOfTargetUsers:start");
  log.info(arrayOfTargetUsers);
  log.info("sendEmailMessageToClasses:arrayOfTargetUsers:end");
    var optInUsersGroupByLang = lodash.chain(arrayOfTargetUsers)
                                      .filter(function(user){
                                        if(user.profile.email){
                                            if(user.emails[0].verified || user.services.google.verified_email){
                                                return true;
                                            }   
                                        }else{
                                            return false;
                                        }
                                      })
                                      .groupBy('profile.lang')
                                      .value();

  //extract and join all the classes name to a single string
  var allClassNameJoined = lodash.flatten(lodash.map(classes, 'className')).join();
  log.info("sendEmailMessageToClasses:className:"+allClassNameJoined); 
    for(var lang in optInUsersGroupByLang){
        
        var classRecepientArr = []; 
        optInUsersGroupByLang[lang].map(function(eachUser){
            var classRoomRecepient = { 
                email: eachUser.emails[0].address,
                name:  eachUser.profile.firstname+ " " + eachUser.profile.lastname
            };
            classRecepientArr.push(classRoomRecepient);            
        });
        
        log.info("sendEmailMessageToClasses:classRecepientArr:lang:"+lang+":start");
        log.info(classRecepientArr);
        log.info("sendEmailMessageToClasses:classRecepientArr:lang:"+lang+":end");      
        
        
            try {
              var emailTemplateByUserLangs = Smartix.messageEmailTemplate(classRecepientArr, originateUser, message, {
                                                type:'class',
                                                lang: lang,
                                                className: allClassNameJoined
                                             });  
              Mandrill.messages.send(emailTemplateByUserLangs);       
            }
            catch (e) {
              log.error(e);
            }
               
    }
};