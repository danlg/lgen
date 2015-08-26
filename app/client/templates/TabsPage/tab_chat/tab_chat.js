var text = ReactiveVar('');
var totalResult;
var notFoundResult = ReactiveVar(0);

/*****************************************************************************/
/* TabChat: Event Handlers */
/*****************************************************************************/
Template.TabChat.events({
  'keyup .searchbar':function(){
    notFoundResult.set(0);
    text.set($('.searchbar').val());
  }
});

/*****************************************************************************/
/* TabChat: Helpers */
/*****************************************************************************/
Template.TabChat.helpers({
  'getAllMyChatRooms':function(){
    var allchat = Chat.find() ;
    totalResult = allchat.length;
    if( Chat.find().count() >0 ){
      return allchat
    }else{
      return false;
    }
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

    if(lodash.includes(lodash(string).toString().toUpperCase(),text.get().toUpperCase())){
      return true;
    }else{
      return false;
    }
  },
});

/*****************************************************************************/
/* TabChat: Lifecycle Hooks */
/*****************************************************************************/
Template.TabChat.created = function () {
};

Template.TabChat.rendered = function () {
  text.set("");
};

Template.TabChat.destroyed = function () {
  text.set("");
};
