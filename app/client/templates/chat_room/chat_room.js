/*****************************************************************************/
/* ChatRoom: Event Handlers */
/*****************************************************************************/
Template.ChatRoom.events({
  'click .sendBtn':function(){
    var text = $('.inputBox').val();
    template.atBottom=true;
    if(!lodash.isEmpty(text)){
      Meteor.call('chat/SendMessage',Router.current().params.chatRoomId,text,function(err,data){
        if(!err)
          $('.inputBox').val("");
      });
    }
  },
  'change .inputBox':function(){
    var height = $(".inputBoxList").height()+2;
    $(".chatroomList").css(height,"(100% - " + height +"px )");
  },
  'click .imageBtnTri':function (argument) {
    $("#imageBtn").trigger('click');
  },
  'change #imageBtn': function(event, template) {
    // Meteor.call("chatSendImage",event,Router.current().params.chatRoomId,function (err) {
    //   err?alert(err):alert("success");
    // });


    FS.Utility.eachFile(event, function(file) {
      // Meteor.call("chatSendImage", file,Router.current().params.chatRoomId, function(error, result){
      //   if(error){
      //     console.log("error", error);
      //   }
      //   if(result){
      //
      //   }
      // });

      Images.insert(file, function(err, fileObj) {
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
            pushObj.from = Meteor.userId();
            pushObj.sendAt = moment().format('x');
            pushObj.text = "";
            pushObj.image = fileObj._id;


          Chat.update({_id:Router.current().params.chatRoomId},{$push:{messagesObj:pushObj}});

        }
      });

    });




   },
});

/*****************************************************************************/
/* ChatRoom: Helpers */
/*****************************************************************************/
Template.ChatRoom.helpers({
  'chatRoomProfile':function(){
    return Chat.findOne({_id:Router.current().params.chatRoomId});
  },
  'isMind':function(from){
    return from===Meteor.userId();
  },
  sendTime:function(sendAt){
    return moment(sendAt,"HH:mm");
  },
  userProfile:function(){
    var arr = Chat.findOne({_id:Router.current().params.chatRoomId}).chatIds;
    return lodash.reject(arr,{_id:Meteor.userId()})[0];
  },
  getName:function(profile){

    var userObj =  Meteor.users.findOne({_id:{$nin:[Meteor.userId()]}});

    return getFullNameByProfileObj(userObj.profile);
  },
  isText:function (chatObj) {
    return chatObj.text!=="";
  },
  isImage:function (chatObj) {
    return chatObj.image!=="";
  },
  getImage:function (chatObj) {
    var ImageId = chatObj.image.replace("/cfs/files/images/","");
    return Images.findOne(ImageId);
  },
  isWorkOff:function (argument) {
    var arr = Chat.findOne({_id:Router.current().params.chatRoomId}).chatIds;
    var targetUserObj = lodash.reject(arr,{_id:Meteor.userId()})[0];

  }

});

/*****************************************************************************/
/* ChatRoom: Lifecycle Hooks */
/*****************************************************************************/
Template.ChatRoom.created = function () {
};

Template.ChatRoom.rendered = function () {




  $(".inputBox").autogrow();

   chatroomList  = this.find('.chatroomList');

  template = this;

  template.atBottom=true;

  /*$(".content").animate({ scrollTop: $('.content')[0].scrollHeight}, 0);*/
  /*if(Meteor.isCordova){
    window.addEventListener('native.keyboardshow', keyboardShowHandler);
  }*/
  var onscroll;



onscroll = _.throttle(function() {
  return template.atBottom = chatroomList.scrollTop >= chatroomList.scrollHeight - chatroomList.clientHeight;
}, 200);


  Meteor.setInterval(function(){
    if(template.atBottom){
      chatroomList.scrollTop = chatroomList.scrollHeight - chatroomList.clientHeight;
    }
  },100);


chatroomList.addEventListener('touchstart', function() {
  return template.atBottom = false;
});

chatroomList.addEventListener('touchend', function() {
  return onscroll();
});

chatroomList.addEventListener('scroll', function() {
  template.atBottom = false;
  return onscroll();
});

chatroomList.addEventListener('mousewheel', function() {
  template.atBottom = false;
  return onscroll();
});

chatroomList.addEventListener('wheel', function() {
  template.atBottom = false;
  return onscroll();
});



};

Template.ChatRoom.destroyed = function () {
};

/*function keyboardShowHandler(e){
  $(".content").animate({ scrollTop: $('.content')[0].scrollHeight}, 100);
    alert('Keyboard height is: ' + e.keyboardHeight);
}*/
