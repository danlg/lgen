Meteor.methods({

  chatCreate: function (chatArr,chatObjExtra,schoolName) {
    var namespaceId;
    //log.info('namespace',schoolName);
    // if(schoolName === 'smartix' ){
    //   namespaceId = 'global';
    // }else{
      var targetSchool = SmartixSchoolsCol.findOne({shortname:schoolName});
      if(targetSchool){
          //log.info('chatCreate', schoolName);
          namespaceId = targetSchool._id;
      }
      else{
        log.error('chatCreate:targetSchoolNotFound', schoolName);
        return ;
      }  
    // }
    //user who create this chat is also added into the chat
    chatArr.push(Meteor.userId());
    //try to find if there is existing room
    //size needs to be specified, or else a wrong result of larger chat room group may be found
    //http://stackoverflow.com/questions/6165121/mongodb-query-an-array-for-an-exact-element-match-but-may-be-out-of-order/6165143#6165143
    var res = Smartix.Groups.Collection.findOne(
        {
            namespace: namespaceId ,
            users: {$size : chatArr.length, $all: chatArr},
            type:'chat'
        }
    );
    //log.info("chatCreate.res", res);
    if (res) {
      //return the existing chat room id if there is one
      return res._id;
    }
    else {
      //no room exists. create a new one
      var newRoom;
      
      //add createdAt,lastUpdatedAt field in chat collection
      var chatObj = {
          users: chatArr,
        // messagesObj: [],
          createdAt: new Date(), createdBy: Meteor.userId(),
          lastUpdatedAt: new Date(),lastUpdatedBy: Meteor.userId(),
          namespace: namespaceId
      };
      //var ChatObj = {chatIds: chatArr, messagesObj: []};
      //extra property for chat room, currently use during create of group chat room only.
      if(chatObjExtra){
          if(chatObjExtra.chatRoomName && chatObjExtra.chatRoomName !=""){
              chatObj.chatRoomName = chatObjExtra.chatRoomName;
          }
          if(chatObjExtra.chatRoomAvatar && chatObjExtra.chatRoomAvatar !=""){
              chatObj.chatRoomAvatar = chatObjExtra.chatRoomAvatar;
          }
          if(chatObjExtra.chatRoomModerator && chatObjExtra.chatRoomModerator !=""){
              chatObj.chatRoomModerator = chatObjExtra.chatRoomModerator;
          }
      }
      //log.info('Smartix.Chat.createChat',chatObj);
      newRoom = Smartix.Chat.createChat(chatObj);
      log.info('Smartix.Chat.createChat.roomId',newRoom);
      return newRoom;
    }
  },

  'chat/setting/update': function (doc) {
    Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.chatSetting': doc}}, {validate: false});
  }
    
});