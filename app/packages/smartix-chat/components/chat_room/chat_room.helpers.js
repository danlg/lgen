/*! Copyright (c) 2015-2016 Little Genius Education Ltd.  All Rights Reserved. */

/* ChatRoom: Helpers */
Template.ChatRoom.helpers({
  getChatRoomId:function(){
      return Router.current().params.chatRoomId;
  },
  chatRoomProfile: function () {

    var msgCount =Smartix.Messages.Collection.find({
        group: Router.current().params.chatRoomId
    }).count();
           
    var skipMsg = msgCount - Template.instance().loadedItems.get();
    
    //skip amount cannot be a negative value
    if(skipMsg < 0){
        skipMsg = 0;
    }
    var limitMsg = Template.instance().loadedItems.get();    
 
     //sort classMessages from oldest to newest => createdAt: 1
    var latestDayInMessages = "";
    var chatMessages = Smartix.Messages.Collection.find({
        group: Router.current().params.chatRoomId
    },
    {
      sort: { createdAt: 1 },
        skip: skipMsg,
        limit: limitMsg,
        transform:function(eachMessage){
            
            //if it is first msg, need to show the date timestamp on top of it
            if(latestDayInMessages === ""){
                eachMessage.isFirstMsgInOneDay = true;
                latestDayInMessages = eachMessage.createdAt;
            
            //if a msg is later than the timestamp in latestDayInMessages and they are not at the same date, this msg should display date timestamp on top of it
            }else if( (latestDayInMessages < eachMessage.createdAt) && (latestDayInMessages.toDateString() !== eachMessage.createdAt.toDateString() ) ){
                eachMessage.isFirstMsgInOneDay = true;
                latestDayInMessages = eachMessage.createdAt;
            
            }else{
                eachMessage.isFirstMsgInOneDay = false;
            }
            //log.info(transformCount,' ',eachMessage.data.content ,' ',eachMessage.createdAt);
            return eachMessage;
        }  

    } );
    //log.info('chatMessages',chatMessages);
    return chatMessages;
  },

  withExtraRightPadding:function(){
    return Meteor.isCordova ? "" : "padding-right:40px;" ;
  },

  isMine: function () {
    return this.author === Meteor.userId() ? "mine" : "notmine";
  },
  isMineBoolean: function (currentUserId) {
    return (currentUserId === Meteor.userId());
  },
  isGroupChat: function()
  {
      return !isOneToOneChat();
  },
  isOneToOne: function()
  {
      return isOneToOneChat();
  },
  
  userProfile: function () {
    //get another person's user object in 1 to 1 chatroom.     
    var userObj = Smartix.helpers.getAnotherUser();
    return userObj
  },


  isChatRoomAvatar: function(){
    var chat = Smartix.Groups.Collection.findOne({_id: Router.current().params.chatRoomId});
    if(chat)
        return chat.chatRoomAvatar ? true : false;
  },

  getGroupAvatar : function () {
    var chat = Smartix.Groups.Collection.findOne({_id: Router.current().params.chatRoomId});
    return "<i class=\"icon e1a-"+chat.chatRoomAvatar+" e1a-2x emojicon\"></i>";       
            //get other person's avatar
            
  },

  getUserAvatar: function(){
    var userObj = Smartix.helpers.getAnotherUser();
    if(userObj)
      return "<i class=\"icon e1a-"+userObj.profile.avatarValue+" e1a-2x emojicon\"></i>";  
  },

  getUserById:function(userId){
    var targetUserObj = Meteor.users.findOne(userId);
    return targetUserObj;      
  },
  isEmoji:function(userId){
      if(Meteor.users.findOne(userId).profile.avatarType)
        return ( Meteor.users.findOne(userId).profile.avatarType==="emoji") ? true: false;   
      else 
        return true;  
},
  getChatRoomName: function () {
    //we display the name of the chat room or the correspondent or the people in the group chat depending on the context
    if(getTotalChatRoomUserCount() > 2){
       var chat = Smartix.Groups.Collection.findOne({_id: Router.current().params.chatRoomId});  
       if(chat.chatRoomName){
           return chat.chatRoomName;
       }else{
            var maxNumberOfDisplayName = 2;
            var userObjArr =  Smartix.helpers.getAllUser();
            var names = [];
            var generatedString= "";
            if(userObjArr.length > 2){
                lodash.forEach(userObjArr, function (el, index) {
                        if( index < maxNumberOfDisplayName){
                            var name = Smartix.helpers.getFirstName_ByProfileObj(el.profile);
                          names.push(name);
                        }
                });
                if(userObjArr.length > maxNumberOfDisplayName){
                  //var finalStr = TAPi18n.__("And_amp")+ (userObjArr.length - maxNumberOfDisplayName) + "...";
                  var finalStr = TAPi18n.__("And_amp")+ "...";
                  generatedString = names.toString() + finalStr;
                }
                else {
                  generatedString = names.toString(); //lodash(names).toString()
                }
            }
            else{
                lodash.forEach(userObjArr, function (el, index) {
                if (el._id !== Meteor.userId()) {
                    var name = Smartix.helpers.getFullNameByProfileObj(el.profile);
                  names.push(name);
                }
                });
              generatedString = names.toString();
            }
            return generatedString;
       }  
    }else{
        var userObj = Smartix.helpers.getAnotherUser();
        return userObj &&  Smartix.helpers.getFullNameByProfileObj(userObj.profile);        
    }
  },

  isText: function () {
    //log.debug('isText',this.data.content);
    if(this.data.content === 'New Image' || this.data.content === 'New Document' ){
      return false;
    }else{
      return true;
    }
  },

  isImage: function () {
    return this.image && this.image !== "";
  },

  isSound: function (argument) {
    return this.sound && this.sound !== "";
  },
  
  isDocument: function(){
    return this.document && this.document !== "";  
  },
  
  getDocument: function(){
    var DocumentId = this.document;
    return Documents.findOne(DocumentId);    
  },
  
  getImage: function () {
    var ImageId = this.image.replace("/cfs/files/images/", "");
    return Images.findOne(ImageId);
  },

  isWorkOff: function (argument) {
    
    //get another person's user object in 1 to 1 chatroom.     
    var targetUserObj = Smartix.helpers.getAnotherUser();

  },

  targertWorkingTime: function (argument) {  
    var currentChat = Smartix.Groups.Collection.findOne({_id: Router.current().params.chatRoomId});
    var target;
    var displayOffline = false;
    //if it is a group chat
    if(currentChat && currentChat.chatRoomModerator) {
        if(currentChat.chatRoomModerator == Meteor.userId()) {
            //if current user is the moderator of the chatroom,
            //this user is not limited by the office hour.
            return displayOffline;      
        }
        else {
            target = Meteor.users.findOne( currentChat.chatRoomModerator );
        }
    }
    else{ //if it is a one-to-one chat
        target = Smartix.helpers.getAnotherUser();
    }

    //log.info('target',target);
    //TODO: migrate to Groups
    if (
        currentChat &&
        (
            Roles.userIsInRole(target, 'user',currentChat.namespace) ||
            Roles.userIsInRole(target, Smartix.Accounts.School.TEACHER, currentChat.namespace) ||
            Roles.userIsInRole(target, Smartix.Accounts.School.PARENT, currentChat.namespace)
        )
       )
    {
      //log.info('chat setting');
      //debugger;
      if (target.profile && target.profile.chatSetting && target.profile.chatSetting.workHour) {
        var workHourTime = target.profile.chatSetting.workHourTime;
        var dayOfWeek = moment().day();
        
        var currentDate = new Date();
        var currentHour = currentDate.getHours();
        var currentMinute = currentDate.getMinutes();
        
        var fromHour = workHourTime.from.split(':')
        var fromMomentHour = parseInt(fromHour[0]);
        var fromMomentMinute = parseInt(fromHour[1]);
        
        var toHour = workHourTime.to.split(':');
        var toMomentHour = parseInt(toHour[0]);
        var toMomentMinute = parseInt(toHour[1]);
        
        //not using range plugin to do the calcuation since the api is not available when usingg i18n moment
        //var fromMoment = moment(workHourTime.from, "HH:mm");
        //var toMoment = moment(workHourTime.to, "HH:mm");
        //var range = moment.range(fromMoment, toMoment);

        //if today is not in work day
        if(!workHourTime.weeks[dayOfWeek-1]){
            displayOffline = true;
        }           
        //if too early
        if (currentHour < fromMomentHour || (currentHour ==  fromMomentHour &&  currentMinute < fromMomentMinute) ) {
            displayOffline = true;
        }
        //if too late
        if( currentHour > toMomentHour ||  (currentHour ==  toMomentHour && currentMinute > toMomentMinute) ){
             displayOffline = true;
        }
      }
    }  
    return displayOffline;
  },

  getSound: function (argument) {
    // var SoundId = this.image.replace("/cfs/files/sounds/","");
    return Sounds.findOne(this.sound);
  },

  soundsCollection: function (argument) {
    return Sounds.find();
  },
  
  isNewMessage:function(createdAt){   
      var result = Notifications.findOne({"eventType":"newchatmessage",'messageCreateTimestamp':createdAt});
      //backward comptability
      if(!result){
         return "";
      }
      return (!result.hasRead) ? 'ion-record' : "";
  },

  isLoadMoreButtonShow: function(){
    //log.info("isLoadMoreButtonShow", Router.current().params.chatRoomId);
    var currentChat= Smartix.Groups.Collection.findOne({_id: Router.current().params.chatRoomId});
    //log.info("isLoadMoreButtonShow:_id", currentChat._id);
    if (currentChat) {
        var msgCount =Smartix.Messages.Collection.find({
          group: currentChat._id
        }).count();
    }
    else {
        return "";
    }
    if(Template.instance().loadedItems.get() >= msgCount ){
      return "hidden";
    }
    else{
      return "";
    }
  }

});

function isOneToOneChat(){
    var chat = Smartix.Groups.Collection.findOne({ _id: Router.current().params.chatRoomId });
    return ( chat.users.length == 2) ;
}

// function lastMessageAuthor(){
//     var chat = Smartix.Groups.Collection.findOne({ _id: Router.current().params.chatRoomId });
//     var lastMessageAuthor = Smartix.Messages.Collection.findOne({
//         group: Router.current().params.chatRoomId}, {sort: {createdAt: -1}} 
//     );
//     log.info(lastMessageAuthor);
// }

////get another person's user object in 1 to 1 chatroom. call by chatroom helpers
// function getAnotherUser(){
//   //find all userids in this chat rooms
//   var query = Smartix.Groups.Collection.findOne({_id: Router.current().params.chatRoomId});
//   if (query) {
//     var arr = query.chatIds;
//     //find and remove the userid of the current user
//     var currentUserIdIndex = arr.indexOf(Meteor.userId());
//     arr.splice(currentUserIdIndex, 1);
//     //return another user's user object
//     var targetUserObj = Meteor.users.findOne(arr[0]);
//     return targetUserObj;
//   }
// }

// function getAllUser(){
//     //find all userids in this chat rooms
//     var arr = Smartix.Groups.Collection.findOne({_id: Router.current().params.chatRoomId}).chatIds;
//     //log.info(arr);
//     //return all user objects
//     var targetUsers =  Meteor.users.find( { _id :{ $in: arr} }).fetch();
//     return targetUsers;
// }

function getTotalChatRoomUserCount(){
    var chatObj = Smartix.Groups.Collection.findOne({_id: Router.current().params.chatRoomId});
    //find all userids in this chat rooms
    return chatObj ? chatObj.users.length : -1;
}