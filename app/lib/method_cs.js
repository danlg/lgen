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

  'class/deleteUser': function (classObj,userid) {
    Classes.update(classObj, {$pull: {"joinedUserId": userid}});
  },

  'class/deleteAllUser': function (classObj) {
    Classes.update(classObj, {$set: {joinedUserId: []}});
  },

  'class/delete': function (classObj) {
    Classes.remove(classObj);
  },

  'class/update': function (doc) {
    Classes.update({_id: doc._id}, {$set: doc});
  },
  'chat/delete' :function(chatRoomId){
     
     var chatToBeDeleted = Chat.findOne(chatRoomId);
     //if this chatroom has moderator
     if(chatToBeDeleted.chatRoomModerator){
         //if current user is the moderatar
         if(chatToBeDeleted.chatRoomModerator == Meteor.userId()){
             //proceed to delete this chatroom
             Chat.remove(chatToBeDeleted);
         }
     }   
  },
  'chat/sendMessage': function (chatRoomId, text) {
    var pushObj = {};
    pushObj.from = Meteor.userId();
    pushObj.sendAt = moment().format('x');
    pushObj.text = text;
    pushObj.createdAt = new Date();
    Chat.update(chatRoomId, {$push: {messagesObj: pushObj}, $set:{lastUpdatedAt:new Date(),lastUpdatedBy:Meteor.userId()}} );
    //TODO send email
    //Mandrill.messages.send
    
    return pushObj;
  },

  'chat/sendImage': function (chatRoomId, pushObj) {
    pushObj.sendAt = moment().format('x');
    pushObj.createdAt = new Date(); 
    //  var pushObj = {};
    //    pushObj.from = Meteor.userId();
    //    pushObj.sendAt = moment().format('x');
    //    pushObj.text = text;
    //todo: change the name of this method to chat/appendMessageObj to reflect its usage
    Chat.update(chatRoomId, {$push: {messagesObj: pushObj},$set:{lastUpdatedAt:new Date(),lastUpdatedBy:Meteor.userId()}} );
    return pushObj;
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
  },
  'getSimilarOrganizations':function(inputOrganizationKeyword){
      
            var regexp = new RegExp("^"+inputOrganizationKeyword,"i");
            var rawResultSet = Meteor.users.find({"profile.organization":  {$regex: regexp} }).fetch();//OK
            //log.info(rawResultSet);
            var resultSet = lodash.pluck(rawResultSet,'profile.organization')
            //log.info(resultSet);  
            
            return resultSet;    
  },
  'getSimilarCities':function(inputCityKeyword){
      
            var regexp = new RegExp("^"+inputCityKeyword,"i");
            var rawResultSet = Meteor.users.find({"profile.city":  {$regex: regexp} }).fetch();//OK
            //log.info(rawResultSet);
            var resultSet = lodash.pluck(rawResultSet,'profile.city')
            //log.info(resultSet);  
            
            return resultSet;    
  },

  updateMsgRating: function (type, msgId, classObj) {
    var filtedArr = lodash.findByValues(classObj.messagesObj, "msgId", msgId);
    
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
        Classes.update(
            selector,
            {$pull: updateObj}
        );
        });
        if (type) {
        var updateObj2 = {};
        updateObj2['messagesObj.$.' + type] = Meteor.user();
        Classes.update(
            {classCode: classObj.classCode, messagesObj: {$elemMatch: {msgId: msgId}}},
            {$push: updateObj2}
        );
        }    
               
       

    }else{
        var updateObj = {};
        var selector = {classCode:classObj.classCode,messagesObj:{$elemMatch:{msgId:msgId}}}
        var currentMessage = Classes.findOne({classCode:classObj.classCode});
        //log.info(currentMessage);
        var msgIndex = lodash.findIndex(currentMessage.messagesObj,{'msgId':msgId});
        //log.info(msgIndex);
        updateObj['messagesObj.$.vote.voteOptions.0.votes'] = Meteor.userId();
        Classes.update(
            selector,
            {$pull: updateObj}
        );
        
        updateObj['messagesObj.$.vote.voteOptions.1.votes'] = Meteor.userId();
        Classes.update(
            selector,
            {$pull: updateObj}
        );  

        updateObj['messagesObj.$.vote.voteOptions.2.votes'] = Meteor.userId();
        Classes.update(
            selector,
            {$pull: updateObj}
        );  
        updateObj['messagesObj.$.vote.voteOptions.3.votes'] = Meteor.userId();
        Classes.update(
            selector,
            {$pull: updateObj}
        );          
       
        if (type) {
        var voteIndex = lodash.findIndex(currentMessage.messagesObj[msgIndex].vote.voteOptions,{'voteOption':type});
        var updateObj2 = {};
        updateObj2['messagesObj.'+msgIndex+'.vote.voteOptions.'+voteIndex+'.votes'] = Meteor.userId();
        //var elemMatchStr = 'messagesObj.'+msgIndex+'.vote.voteOption.'+voteIndex;
        //log.info(elemMatchStr);
        Classes.update(
            {classCode: classObj.classCode},
            {$push: updateObj2}
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
      }
        
      var newCommentObj ={ _id: Random.id(),
                            comment:comment,
                            createdAt:new Date(),
                            createdBy:Meteor.userId(),
                            isShown:true,
                            lastUpdatedBy:Meteor.userId(),
                            lastUpdatedAt:new Date()
                          };
      
      Classes.update( targetClass,{$push: {'messagesObj.$.comment.comments': newCommentObj}} );
      
      var updatedClass=  Classes.findOne(targetClass);
      Notifications.insert({
         eventType:"newclasscomment",
         userId: updatedClass.createBy,
         hasRead: false,
         classid: updatedClass._id,
         classCode: updatedClass.classCode,
         commentId: newCommentObj._Id,
         messageCreateTimestamp: newCommentObj.createdAt,
         messageCreateTimestampUnixTime: moment(newCommentObj.createdAt).unix(),
         messageCreateByUserId: Meteor.userId()
     });      
  },

  sendMsg: function (target, msg, mediaObj, classId) {
    var msgObj = {};
    var date = moment().format('x');
    // msgObj.msgId = CryptoJS.SHA1(date + msg).toString().substring(0, 6);
    msgObj.msgId = Random.id();
    msgObj.createdAt = new Date();
    msgObj.createdBy = Meteor.userId();
    msgObj.lastUpdatedAt = new Date();
    msgObj.lastUpdatedBy = Meteor.userId();
    msgObj.sendAt = date; //backward compatability
    msgObj.content = msg;
    
    //new msg sent would have voting type, option and content in vote object. 
    //This is kept for backward-comptability and reference
    /*msgObj.checked = [];
    msgObj.star  = [];
    msgObj.close = [];
    msgObj.help  = [];*/
    msgObj.imageArr = mediaObj.imageArr;
    msgObj.soundArr = mediaObj.soundArr;
    msgObj.documentArr = mediaObj.documentArr;
    msgObj.comment = {
        allowComment: mediaObj.allowComment || false,
        comments:[]
    };
    
    msgObj.vote = {
        allowVote: mediaObj.allowVote || false,
        voteType: mediaObj.voteType || "",
        voteOptions:[]
    };
    
    var VoteOption = function (optionName) {
        this.voteOption = optionName;
        //this.voteOptionIcon = iconName;
        this.votes = []; //where user obj is pushed into;
    };
    
    var VoteOptions = function(voteOptions){
        var arrayOfVoteOptions = [];
        voteOptions.map(function(eachVoteOption){                   
          arrayOfVoteOptions.push( new VoteOption(eachVoteOption));                
        });
        return arrayOfVoteOptions;
    }
   log.info(msgObj.vote.voteType);
   if(msgObj.vote.voteType == 'heartNoEvilStarQuestion'){
       msgObj.vote.voteOptions = new VoteOptions(['heart','noevil',
         //'star',
         'question']);
       //log.info(msgObj.vote.voteOptions);                                         
   }else if(msgObj.vote.voteType == 'yesNo'){
       msgObj.vote.voteOptions = new VoteOptions(['yes','no']);       
   }else if(msgObj.vote.voteType == 'likeDislike'){
       msgObj.vote.voteOptions = new VoteOptions(['like','dislike']);         
   }else if(msgObj.vote.voteType == 'oneTwoThreeFour'){
       msgObj.vote.voteOptions = new VoteOptions(['one','two','three','four']);        
   }else{
       //future extension point for futher customization.
       //VoteOptions will need to be defined by user.
       
   }
    

    var currentUserId = Meteor.userId();
    var currentUserObj = Meteor.user();
    //latency compensation
    //https://www.discovermeteor.com/blog/advanced-latency-compensation/
    if(Meteor.isServer){
        Meteor.defer(function(){
            if(!msg){
            if (msgObj.imageArr && msgObj.imageArr.length>0){
                    msg="New image";
            }
            if (msgObj.soundArr && msgObj.soundArr.length>0){
                    msg="New sound";
            }
            if (msgObj.documentArr && msgObj.documentArr.length>0){
                    msg="New document";
            }
            }     
            //send push notification
            var arrayOfClasses = Classes.find({classCode: {$in: target}}).fetch();
            var arrayOfTarget = lodash.map(arrayOfClasses, 'joinedUserId');
            var flattenArray = lodash.flatten(arrayOfTarget);
            var index = flattenArray.indexOf(currentUserId);
            if (index > -1) {
            flattenArray.splice(index, 1);
            }
            var senderFullname = currentUserObj.profile.firstname + " " + currentUserObj.profile.lastname;
            var notificationTitle = "Message From " + senderFullname;
            log.info("sendmsg:senderFullName:"+senderFullname);
            Push.send({
            from: 'push',
            title: notificationTitle,
            text: msg,
            query: {
                userId: {$in: flattenArray}
            }
            });
            //send push notification end
            
            //send notification via websocket using Streamy
            flattenArray.map(function(userId){
            //log.info("streamy"+userId);
            var socketObj = Streamy.socketsForUsers(userId);
            //log.info(socketObj);
            
            socketObj._sockets.map(function(socket){
                Streamy.emit('newclassmessage', { from: senderFullname,
                                                text: msg,
                                                classCode: arrayOfClasses[0].classCode                                  
                }, socket); 
            });
            });
            //send notification via websocket using Streamy end
            
            //send email notification
            sendEmailMessageToClasses(flattenArray,arrayOfClasses,msg,currentUserObj);
            //send email notification end   
            
            //add notifications to notifications collections
            flattenArray.map(function(eachTargetUserId){
                Notifications.insert({
                    eventType:"newclassmessage",
                    userId: eachTargetUserId,
                    hasRead: false,
                    classCode: arrayOfClasses[0].classCode,
                    messageId: msgObj.msgId,
                    messageCreateTimestamp: msgObj.createdAt,
                    messageCreateTimestampUnixTime: msgObj.sendAt,
                    messageCreateByUserId: currentUserId
                });
            }); 
            //add notifications to notifications collections ends                   
        });
        
      
    }
        
     //update classes collection
     return Classes.update({
                classCode: {
                    $in: target
                }
                }, {
                $push: {
                    messagesObj: msgObj
                }
                }, {
                validate: false
                });  
  },
  showHideComment:function(isShown,classid,messageid,commentid){
     var currentClassObj = Classes.findOne(classid);
     var currentMessagesObjIndex = lodash.findIndex(currentClassObj.messagesObj,{"msgId":messageid});
     var currentCommentObjIndex = lodash.findIndex(currentClassObj.messagesObj[currentMessagesObjIndex].comment.comments,{"_id":commentid});
     
     //currentClassObj.messagesObj[currentMessagesObjIndex].comment.comments[currentCommentObjIndex].isShown = isShown;
     
     var modifier = { $set: {} };
     modifier.$set['messagesObj.'+currentMessagesObjIndex+'.comment.comments.'+currentCommentObjIndex+'.isShown'] = isShown;
     
     Classes.update(classid, modifier,{validate: false});
     
  },
  setChatMessageAsRead:function(updateNotificationObj){
      log.info("trySetChatMessageAsRead")
      log.info(updateNotificationObj);
      Notifications.update({_id:updateNotificationObj._id},updateNotificationObj);
  },
  setAllChatMessagesAsRead:function(chatRoomId){
      log.info("trySetChatMessagesAsRead")
      log.info(Notifications.update({ "eventType" : "newchatroommessage",chatroomId:chatRoomId,userId:Meteor.userId()},{ $set: { hasRead: true } },{multi:true}));
  },
  setAllClassMessagesAsRead:function(classCode){
      log.info("trySetClassMessagesAsRead")
      log.info(Notifications.update({ "eventType" : "newclassmessage",classCode:classCode,userId:Meteor.userId()},{ $set: { hasRead: true } },{multi:true}));
  },
  setAllClassCommentsAsRead:function(classCode){
      log.info("trySetClassCommentsAsRead")
      log.info(Notifications.update({ "eventType" : "newclasscomment",classCode:classCode,userId:Meteor.userId()},{ $set: { hasRead: true } },{multi:true}));
  }

});


sendEmailMessageToClasses = function(targetUserids, classes, message, originateUser){
  
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
            }
            classRecepientArr.push(classRoomRecepient);            
        });
        
        log.info("sendEmailMessageToClasses:classRecepientArr:lang:"+lang+":start");
        log.info(classRecepientArr);
        log.info("sendEmailMessageToClasses:classRecepientArr:lang:"+lang+":end");      
        
        
            try {
              var emailTemplateByUserLangs = messageEmailTemplate(classRecepientArr, originateUser, message, {
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
      
}