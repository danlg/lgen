/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* ChatRoom: Helpers */
/*****************************************************************************/
Template.ChatRoom.helpers({
  chatRoomProfile: function () {
    return Chat.findOne({_id: Router.current().params.chatRoomId});
  },
  withExtraRightPadding:function(){
    if(!Meteor.isCordova){
      return "padding-right:40px;"
    }else{
      return "";
    }
  },
  isMine: function () {
    return this.from === Meteor.userId() ? "mine" : "notmine";
  },
  isMineBoolean: function (currentUserId) {
    return currentUserId === Meteor.userId() ? true : false;
  },
  userProfile: function () {
    //get another person's user object in 1 to 1 chatroom.     
    var userObj = getAnotherUser();
    return userObj
  },
  getGroupOrCorrespondentAvatar : function () {
    var chat = Chat.findOne({_id: Router.current().params.chatRoomId});
    if(chat.chatRoomAvatar){
        return chat.chatRoomAvatar;       
    }else{
        //get other person's avatar
        var userObj = getAnotherUser();
        return userObj && userObj.profile && userObj.profile.useravatar;        
    }
  },
  getUserById:function(userId){
    var targetUserObj = Meteor.users.findOne(userId);
    return targetUserObj;      
  },
  getName: function (profile) {  
    if(getTotalChatRoomUserCount() > 2){
       var chat = Chat.findOne({_id: Router.current().params.chatRoomId});  
       if(chat.chatRoomName){
           return chat.chatRoomName;
       }else{
            var maxNumberOfDisplayName = 2;           
            var userObjArr =  getAllUser();
            var nameArr = [];
            
            if(userObjArr.length > 2){
                lodash.forEach(userObjArr, function (el, index) {
                        if( index < maxNumberOfDisplayName){
                            var name = getFullNameByProfileObj(el.profile);
                            nameArr.push(name);
                        }
                }); 
                
                if(userObjArr.length > maxNumberOfDisplayName){
                    nameArr.push(" and "+ (userObjArr.length - maxNumberOfDisplayName) + " others..." );
                }   
            }else{
                lodash.forEach(userObjArr, function (el, index) {
                if (el._id !== Meteor.userId()) {
                    var name = getFullNameByProfileObj(el.profile);
                    nameArr.push(name);
                }
                });            
            }
            return nameArr.toString();             
       }  
    }else{
        var userObj = getAnotherUser();
        return userObj &&  getFullNameByProfileObj(userObj.profile);        
    }
  },

  isText: function () {
    return this.text !== "";
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
    var targetUserObj = getAnotherUser();

  },

  targertWorkingTime: function (argument) {
    var displayOffline = false;
    var target = getAnotherUser();
    if (target.profile.role === "Teacher") {
      if (target.profile.chatSetting && target.profile.chatSetting.workHour) {
        
        
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
  }

});

////get another person's user object in 1 to 1 chatroom. call by chatroom helpers
function getAnotherUser(){
  //find all userids in this chat rooms
  var query = Chat.findOne({_id: Router.current().params.chatRoomId});
  if (query) {
    var arr = query.chatIds;
    //find and remove the userid of the current user
    var currentUserIdIndex = arr.indexOf(Meteor.userId());
    arr.splice(currentUserIdIndex, 1);

    //return another user's user object
    var targetUserObj = Meteor.users.findOne(arr[0]);
    return targetUserObj;
  }
}

function getAllUser(){
            //find all userids in this chat rooms
            var arr = Chat.findOne({_id: Router.current().params.chatRoomId}).chatIds;
            //log.info(arr);
            //return all user objects
            var targetUsers =  Meteor.users.find({
                 _id :{ $in: arr}
            }).fetch();
            return targetUsers;
          
}

function getTotalChatRoomUserCount(){
            //find all userids in this chat rooms
            var arr = Chat.findOne({_id: Router.current().params.chatRoomId}).chatIds;
            // log.info(arr);    
            return arr.length;    
}