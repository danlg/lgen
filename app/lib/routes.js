Router.configure({
  /*layoutTemplate: 'MasterLayout',*/
  loadingTemplate: 'Loading',
  notFoundTemplate: 'NotFound'
});

var OnBeforeActions;

OnBeforeActions = {
  loginRequired: function(pause) {
    if (!Meteor.userId()) {
      Router.go('signin');
      this.next();
    } else {
      this.next();
    }
  },
  roleRequired: function() {
    if(!Meteor.user().profile.role){
      Router.go('role');
      this.next();
    }else{
      this.next();
    }
  },
  loginedRedirect:function(pause){
    if(Meteor.userId()){
      Router.go('Home')
      this.next();
    }else{
      this.next();
    }
  }
};

/*Router.onBeforeAction(OnBeforeActions.loginRequired, {
  except: ['language', 'signin', 'email-signin','email-signup', 'role','Testing','Test2']
});

*/

Router.onBeforeAction(OnBeforeActions.roleRequired, {
  only: ['Home']
});

Router.onBeforeAction(OnBeforeActions.loginedRedirect, {
  only: ['language']
});

Router.onBeforeAction('loading');


Router.route('language', {
  controller: 'LoginController',
  action: "language",
  path: "/",
});
Router.route('signin', {
  controller: 'LoginController',
  action: "signin"
});
Router.route('email-signin', {
  controller: 'LoginController',
  action: "emailsigin"
});
Router.route('email-signup', {
  controller: 'LoginController',
  action: "emailsigup",
  path: "email-signup/:role",
});

Router.route('role', {
  controller: 'LoginController',
  action: "role"
});

Router.route('dob', {
  controller: 'LoginController',
  action: "dob"
});

Router.route('Home', {
  controller: 'MainApplicationController',
});

Router.route('TabChat', {
  layoutTemplate:"NavBarScreenLayout",
  waitOn:function(){
    return [Meteor.subscribe('getAllMyChatRooms'),Meteor.subscribe('getChatRoomMenbers')]


  },
  /*subscription:function(){
    Meteor.subscribe('getAllMyChatRooms');
  },*/

  path:"chat"
});

Router.route('You', {
  controller: 'MainApplicationController',
  action: "you"
});


Router.route('Chatoption',{
  layoutTemplate:"NavBarScreenLayout",
  path:"chat/option",
  waitOn:function(){
    Meteor.subscribe('createdClassByMe');
  }
});
Router.route('WorkTimeSelection',{
  layoutTemplate:"NavBarScreenLayout",
  path:"chat/option/weeksTime",
});
Router.route('Notification',{
  layoutTemplate:"NavBarScreenLayout",
  path:"notice/:msgCode",
  waitOn:function(){
    Meteor.subscribe('getClassMsgId',this.params.msgCode);
  }
});
Router.route('ClassPanelMsgNotice',{
  layoutTemplate:"NavBarScreenLayout",
  path:"panel/notice/:msgCode",
  waitOn:function(){
    return Meteor.subscribe('getClassMsgId',this.params.msgCode);
  }
});
Router.route('NotificationDetail',{
  layoutTemplate:"NavBarScreenLayout",
  path:"notice/:msgCode/detail",
  waitOn:function(){
    Meteor.subscribe('getClassMsgId',this.params.msgCode);
  }
});

Router.route('ClassInfomation',{
  layoutTemplate:"NavBarScreenLayout",
  path:"class/:classCode/info",
  waitOn:function(){
    return[
    Meteor.subscribe('personCreateClass',this.params.classCode),
    Meteor.subscribe('class',this.params.classCode)
    ]
  }
});


Router.route('Classes', {
  controller: 'MainApplicationController',
  action: "classes"
});

Router.route('AddClass', {
  controller: 'ClassController',
  path: "class/add"
});

Router.route('JoinClass', {
  // controller: 'ClassController',
  layoutTemplate:"NavBarScreenLayout",
  path: "class/join",
  waitOn:function(){
    Meteor.subscribe('joinedClass');
  }
});
Router.route('ClassInvitation', {
  controller: 'ClassWithIdController',
  path: "class/:classCode/invite"
});

Router.route('EmailInvite', {
  /*controller: 'ClassWithIdController',*/
  layoutTemplate:"NavBarScreenLayout",
  path: "class/:classCode/invite-email",

});




Router.route('classDetail', {
  controller: 'ClassWithIdController',
  /*layoutTemplate:"NavBarScreenLayout",*/
  path: "class/:classCode/detail",
});

Router.route('ShareInvite', {
  controller: 'ClassWithIdController',
  path: "class/:classCode/invite/share"
});
Router.route('classEdit', {
  /*controller: 'ClassWithIdController',*/
  layoutTemplate:"NavBarScreenLayout",
  path: "class/:classCode/edit",
  waitOn:function(){
    return Meteor.subscribe('class',this.params.classCode);
  }
});

Router.route('ClassUsers', {
  path: "class/:classCode/users",
  layoutTemplate:"NavBarScreenLayout",
  waitOn:function(){
    Meteor.subscribe('getJoinedClassUser',this.params.classCode);
  }
});

Router.route('UserDetail', {
  /*controller: 'UserController',*/
  path: "user/:_id",
  layoutTemplate:"NavBarScreenLayout",
  waitOn:function(){
    Meteor.subscribe('getUserById',this.params._id);
    Meteor.subscribe('getJoinedClassByUserId',this.params._id);
  },
});

Router.route('MyAccount', function(){
  this.layout('NavBarScreenLayout');
  this.render('MyAccount');
});

Router.route('SendMessage', {
  /*controller: 'MessageController',*/
  layoutTemplate:"NavBarScreenLayout",
  path: "message/send/:classCode?",
  waitOn:function(){
    return Meteor.subscribe('createdClassByMe');
  }
});

Router.route('MessageClassSelection',{
  layoutTemplate:"NavBarScreenLayout",
  path:"message/classselect",
  waitOn:function(){
      return Meteor.subscribe('createdClassByMe');
  }
});

Router.route('ClassPanel', {
  /*controller: 'MessageController',*/
  path: "class/:classCode/panel",
  layoutTemplate:"NavBarScreenLayout",
  waitOn:function(){
    return Meteor.subscribe('class',this.params.classCode);
  }

});

Router.route('Testing',{
  layoutTemplate:"NavBarScreenLayout",

  });

Router.route('Test2',{
  controller:"TestController",

  });
Router.route('ChatInvite',{
  layoutTemplate:"NavBarScreenLayout",
  path:"chat/invite",
  waitOn:function(){
    /*Meteor.subscribe('joinedClass');*/
    return Meteor.subscribe('getAllJoinedClassesUser');
  }
});
Router.route('ChatRoom',{
  controller:'ChatRoomController',
  path:"chat/:chatRoomId",
  waitOn:function(){
    Meteor.subscribe('getChatRoomById',this.params.chatRoomId);
  }
});


Router.route('FeedBack',{
  layoutTemplate:"NavBarScreenLayout",
});
