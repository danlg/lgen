Meteor.methods({

  chatCreate: function (chatArr,chatObjExtra) {
    //user who create this chat is also added into the chat
    chatArr.push(Meteor.userId());
    
    //try to find if there is existing room
    //size needs to be specified, or else a wrong result of larger chat room group may be found
    //http://stackoverflow.com/questions/6165121/mongodb-query-an-array-for-an-exact-element-match-but-may-be-out-of-order/6165143#6165143
    var res = Chat.findOne({chatIds: {$size : chatArr.length, $all: chatArr}});
    if (res) {
      //return the existing chat room id if there is one
      return res._id;
    }
    else {
      //no room exists. create a new one
      var newRoom;
      
      //add createdAt,lastUpdatedAt field in chat collection
      var ChatObj = {chatIds: chatArr, messagesObj: [], createdAt: new Date(), createdBy: Meteor.userId(), lastUpdatedAt: new Date(),lastUpdatedBy: Meteor.userId()};
      //var ChatObj = {chatIds: chatArr, messagesObj: []};
      //extra property for chat room, currently use during create of group chat room only.
      if(chatObjExtra){
          
          if(chatObjExtra.chatRoomName && chatObjExtra.chatRoomName !=""){
              ChatObj.chatRoomName = chatObjExtra.chatRoomName;
          }
                
          if(chatObjExtra.chatRoomAvatar && chatObjExtra.chatRoomAvatar !=""){
              ChatObj.chatRoomAvatar = chatObjExtra.chatRoomAvatar;              
          }
          
          if(chatObjExtra.chatRoomModerator && chatObjExtra.chatRoomModerator !=""){
              ChatObj.chatRoomModerator = chatObjExtra.chatRoomModerator;
          }
      }
      //log.info(ChatObj); 
      newRoom = Chat.insert(ChatObj);          
      
      return newRoom;
    }
  },

  'chat/setting/update': function (doc) {
    Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.chatSetting': doc}}, {validate: false});
  },
  chatSendImage: function (file, chatRoomId) {
    Images.insert(file, function (err, fileObj) {
      if (err) {
        // handle error
      } else {
        // handle success depending what you need to do
        var userId = Meteor.userId();
        var imagesURL = {
          'profile.image': '/cfs/files/images/' + fileObj._id
        };
        // Meteor.users.update(userId, {
        //   $set: imagesURL
        // });

        var pushObj = {};
        pushObj.from = Meteor.user();
        pushObj.sendAt = moment().format('x');
        pushObj.text = "";
        pushObj.image = fileObj._id;

        Chat.update({_id: Router.current().params.chatRoomId}, {$push: {messagesObj: pushObj}});
      }
    });
  },      
    
    
});