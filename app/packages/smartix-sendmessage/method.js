Meteor.methods({
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
    
    //TODO: store in DB as Date instead of string for startDate and endDate.
    if(mediaObj.calendarEvent){
        if(mediaObj.calendarEvent.eventName){
        
        msgObj.calendarEvent = mediaObj.calendarEvent;
        
        }
    }
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
            Smartix.sendEmailMessageToClasses(flattenArray,arrayOfClasses,msg,currentUserObj);
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
                },function(){
                    
                    //send push notification
                    Push.send({
                    from: 'push',
                    title: notificationTitle,
                    text: msg,
                    payload:{
                        type: 'class',
                        classCode: arrayOfClasses[0].classCode                
                    },
                    query: {
                        userId: eachTargetUserId
                    },
                    badge: Smartix.helpers.getTotalUnreadNotificationCount(eachTargetUserId)
                    });                   
                    //send push notification end
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
                    },
                    $set: {
                            'lastUpdatedBy':currentUserId,
                            'lastUpdatedAt':msgObj.createdAt
                    }
                }, {
                validate: false
                });  
  }
});