/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var text = ReactiveVar('');
var totalResult;
var notFoundResult = ReactiveVar(0);

/*****************************************************************************/
/* TabChat: Event Handlers */
/*****************************************************************************/
Template.TabChat.events({
  'keyup .searchbar': function () {
    notFoundResult.set(0);
    text.set($('.searchbar').val());
  }
});


/*****************************************************************************/
/* TabChat: Helpers */
/*****************************************************************************/
Template.TabChat.helpers({
   'getCurrentSchool':function(){
       return Session.get('pickedSchoolId');
   },

   'getCurrentSchoolName':function(){
       let pickedSchool = Session.get('pickedSchoolId');
       if( pickedSchool === 'global'){
           return 'global';
       }
       if( pickedSchool === 'system'){
           return 'system';
       }
       var pickSchool = SmartixSchoolsCol.findOne(pickedSchool);
       return pickSchool ? pickSchool.username : false;
   },

  'displayChatOption': function () {
    var currentSchoolId =  Session.get('pickedSchoolId') ;
    //global only have single role => user , so create class is always available
    if(!currentSchoolId || currentSchoolId === 'global'){
        return true;
    }
    //In a school context, only teacher or parent can create class
    else return (
        lodash.includes( Roles.getRolesForUser( Meteor.userId(), currentSchoolId ), Smartix.Accounts.School.TEACHER  ) ||
        lodash.includes( Roles.getRolesForUser( Meteor.userId(), currentSchoolId ), Smartix.Accounts.School.PARENT  )
    );
  },

  'getAllMyChatRooms': function () {
    var allchats = Smartix.Groups.Collection.find({type:'chat'},{sort:{"lastUpdatedAt":-1}});
    //console.log('getAllMyChatRooms',allchats.fetch()    );
    return allchats;
    
  },

  //this implementation smells
  //duplicate of getChatRoomName //todo refactor
  'chatroomMemberName': function ( maxDisplay) {
    var names = [];
    var generatedString= "";
    
    //use group chat room name if user has defined one
    if(this.chatRoomName){
        names.push(this.chatRoomName);
        generatedString = names.toString();
    }
    else {
        //if user has not defined a chat room name.
        //if there are more than 2 ppl in a chatroom
        // => groupchat
        //      => display `maxDisplay` of users' first names, include the current user
        //if there are only 2 ppl in a chatroom
        // => 1-to-1 chat
        //      => display another user's full name 
        
        console.log('users',this.users);
        var userIds = this.users;
        var maxNumberOfDisplayName = maxDisplay;
        var userObjArr = Meteor.users.find({_id: {$in: this.users }}).fetch();
        
        //group chat
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
            generatedString = names.toString();
          }
        }
        else{// 1-to-1 chat
            lodash.forEach(userObjArr, function (el, index) {
            //get another user's full name
            if (el._id !== Meteor.userId()) {
                var name = Smartix.helpers.getFullNameByProfileObj(el.profile);
                names.push(name);    
            }});

            generatedString = names.toString();        
        }  
    }
    return generatedString;
  },

  'lasttext': function (messagesObj) {
    if(!messagesObj){
        return "";
    }
    var len = messagesObj.length;
    return  (len > 0) ? messagesObj[len - 1].text : "";
  },

  'lasttextTime':function(messagesObj){
    if(!messagesObj){
        return "New Chat";
    }
    var len = messagesObj.length;
    if (len > 0){
      var message = messagesObj[len - 1];  
      var userLanguage = TAPi18n.getLanguage();
      moment.locale(userLanguage);     
      return moment.unix(message.sendAt.substr(0,10)).fromNow();
    }
    else return "New Chat";
  },

  'isHide': function (chatIds) {
      //var chatIdsLocal = chatIds;
      if (text.get() !== "") {
        var names = [];
        //get all user names in a chatroom
        var userObjArr = Meteor.users.find({_id: {$in: this.users}}).fetch();
        lodash.forEach(userObjArr, function (el, index) {
          if (el._id !== Meteor.userId()) {
            var name = Smartix.helpers.getFullNameByProfileObj(el.profile);
            names.push(name);
          }
        });
        //get chatroom name
        if(this.chatRoomName){
            names.push(this.chatRoomName);
        }
        //find if search string is included in the names string
        return !!lodash.includes(lodash(names).toString().toUpperCase(), text.get().toUpperCase());
      }
      else return true;
  },

  'chatRoomUserAvatar': function () {
      var avatars = [];
      if(this.chatRoomAvatar) {
          avatars.push("e1a-"+ this.chatRoomAvatar);
      }
      else {
          var userObjArr = Meteor.users.find({_id: {$in: this.users}}).fetch();
          if(userObjArr.length > 2){
              avatars.push("e1a-green_apple");
          }
          else{
            lodash.forEach(userObjArr, function (el, index) {
              if (el._id !== Meteor.userId()) {
                  var avatar = el.profile.avatarValue;
                  if (avatar){
                    avatars.push("e1a-" + avatar)
                  }
                  else avatars.push("e1a-green_apple");
              }
            });
          }
      }
      return lodash(avatars).toString();
  },

  'newMessageCounter':function(chatroomId) {
       // log.info(chatroomId);
       var newMessageCount =  Notifications.find({'groupId':chatroomId,'hasRead':false}).count();
       if(newMessageCount > 0 ){
           return '<span class="badge" style="background-color: #ef473a;color: #fff;">'+ newMessageCount +'</span>'
       }
  }
});

/* TabChat: Lifecycle Hooks */
Template.TabChat.created = function () {
};

Template.TabChat.rendered = function () {
    text.set("");
    $("body").removeClass('modal-open');
};

Template.TabChat.destroyed = function () {
    text.set("");
};
