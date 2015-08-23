var text = ReactiveVar('');
/*****************************************************************************/
/* TabChat: Event Handlers */
/*****************************************************************************/
Template.TabChat.events({
  'keyup .searchbar':function(){
    text.set($('.searchbar').val());
  }
});

/*****************************************************************************/
/* TabChat: Helpers */
/*****************************************************************************/
Template.TabChat.helpers({
  'getAllMyChatRooms':function(){
    var allchat = Chat.find();
    return allchat;
  },
  'chatroomMenberName':function(chatIds){
    var string = [];
    var userObjArr = lodash.reject(chatIds,{_id:Meteor.userId()});
    userObjArr =  lodash.map(userObjArr,'profile')
    lodash.forEach(userObjArr,function(el,index){
      var name = el.firstname +" "+ el.lastname;
      string.push(name);
    });
    return lodash(string).toString();
  },
  'lasttext':function(messagesObj){
    var len = messagesObj.length;
    return messagesObj[len-1].text;
  },
  'isHide':function(chatIds){
    var string = [];
    var userObjArr = lodash.reject(chatIds,Meteor.user());
    userObjArr =  lodash.map(userObjArr,'profile')
    lodash.forEach(userObjArr,function(el,index){
      var name = el.firstname +" "+ el.lastname;
      string.push(name);
    });
    return lodash.includes(lodash(string).toString(),text.get())?"":"hide";
  }
});

/*****************************************************************************/
/* TabChat: Lifecycle Hooks */
/*****************************************************************************/
Template.TabChat.created = function () {
};

Template.TabChat.rendered = function () {
};

Template.TabChat.destroyed = function () {
};
