Router.configure({
  layoutTemplate: 'MasterLayout',
  // loadingTemplate: 'LoadingSpinner',
  notFoundTemplate: 'NotFound'
});

var OnBeforeActions;

OnBeforeActions = {
  loginRequired: function(pause) {
    if (!Meteor.userId()) {
      Router.go('Login');
      this.next();
    } else {
      this.next();
    }
  },
  roleRequired: function() {
    if (!Meteor.user().profile.role) {
      Router.go('role');
      this.next();
    } else {
      this.next();
    }
  },
  loginedRedirect: function(pause) {
    if (Meteor.userId()) {
      Router.go('TabChat');
      this.next();
    } else {
      this.next();
    }
  },
  checkLanguage: function(pause) {

    if(Meteor.isCordova){
      var  pattern = /-.*/g ;

      navigator.globalization.getPreferredLanguage(
        function (language) {
          // alert('language: ' + language.value + '\n');
          // console.log(language);
          var lang =language.value.replace(pattern,"");

          if(!lodash.has(TAPi18n.getLanguages(),lang))
            lang = "en";

            TAPi18n.setLanguage(lang)
            .done(function (){
                Session.setPersistent('lang',lang);
            })
            .fail(function (error_message) {
              // Handle the situation
              console.log(error_message);
            });





        },
        function () {alert('Error getting language\n');}
      );
    }

    this.next();


  }





};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
  except: ['language', 'Login', 'EmailSignup','EmailSignin', 'role','Testing','Test2']
});

Router.onBeforeAction(OnBeforeActions.roleRequired, {
  only: ['TabChat']
});

Router.onBeforeAction(OnBeforeActions.loginedRedirect, {
  only: ['language']
});

Router.onBeforeAction('loading');
Router.onBeforeAction(OnBeforeActions.checkLanguage);

Router.onBeforeAction(function (argument) {
  if(Meteor.userId()){
    Router.go("TabClasses");
    this.next();
  }else{
    this.next();
  }
},{only:['Login']});


Router.route('language', {
  // controller: 'LoginController',
  // action: "language",
  path: "/",
  name:"language"
});
Router.route('/loginMethod', {
  name:"Login"
});
Router.route('/email-signin', {
  // controller: 'LoginController',
  name:"EmailSignin"
});
Router.route('EmailSignup', {
  path: "email-signup/:role",
});

Router.route('role', {
  // controller: 'LoginController',
  // action: "role"
});
//
// Router.route('dob', {
//   controller: 'LoginController',
//   action: "dob"
// });

// Router.route('Home', {
//   controller: 'MainApplicationController',
// });

Router.route('TabChat', {
  // layoutTemplate: "NavBarScreenLayout",
  waitOn: function() {
    // return [
      // Meteor.subscribe('getAllMyChatRooms'),
      // Meteor.subscribe('getChatRoomMenbers')
      Meteor.subscribe('allMyChatRoomWithUser');
    // ];
  },
  /*subscription:function(){
    Meteor.subscribe('getAllMyChatRooms');
  },*/

  path: "chat"
});

Router.route('TabYou', {
  // controller: 'MainApplicationController',
  // action: "you"
  path:"You"
});


Router.route('Chatoption', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "chat/option",
  waitOn: function() {
    Meteor.subscribe('createdClassByMe');
  }
});
Router.route('WorkTimeSelection', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "chat/option/weeksTime",
});
Router.route('Notification', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "notice/:msgCode",
  waitOn: function() {
    Meteor.subscribe('getClassMsgId', this.params.msgCode);
  }
});
Router.route('ClassPanelMsgNotice', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "panel/notice/:msgCode",
  waitOn: function() {
    return Meteor.subscribe('getClassMsgId', this.params.msgCode);
  }
});
Router.route('NotificationDetail', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "notice/:msgCode/detail",
  waitOn: function() {
    Meteor.subscribe('getClassMsgId', this.params.msgCode);
  }
});

Router.route('ClassInfomation', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "class/:classCode/info",
  waitOn: function() {
    return [
      Meteor.subscribe('personCreateClass', this.params.classCode),
      Meteor.subscribe('class', this.params.classCode)
    ];
  }
});


Router.route('TabClasses', {
  // controller: 'MainApplicationController',
  // action: "classes"
  path:"Classes",
  waitOn:function (argument) {
      Meteor.subscribe('joinedClass');
      Meteor.subscribe('createdClassByMe');
  }

});

Router.route('AddClass', {
  // controller: 'ClassController',
  path: "class/add"
});

Router.route('JoinClass', {
  // controller: 'ClassController',
  // layoutTemplate: "NavBarScreenLayout",
  path: "class/join",
  waitOn: function() {
    Meteor.subscribe('joinedClass');
  }
});
Router.route('ClassInvitation', {
  // controller: 'ClassWithIdController',
  path: "class/:classCode/invite"
});

Router.route('EmailInvite', {
  /*controller: 'ClassWithIdController',*/
  // layoutTemplate: "NavBarScreenLayout",
  path: "class/:classCode/invite-email",
  waitOn: function() {
    return Meteor.subscribe('class', this.params.classCode);
  }
});

Router.route('ChatRoom', {
  path: "chat/:chatRoomId",
  waitOn: function() {
    // return [Meteor.subscribe('getChatRoomById', this.params.chatRoomId),Meteor.subscribe('images')];
    return [
      Meteor.subscribe('images'),
      Meteor.subscribe('sounds'),
      Meteor.subscribe('chatRoomWithUser',this.params.chatRoomId)
    ];
  }
});


Router.route('classDetail', {
  // controller: 'ClassWithIdController',
  // layoutTemplate:"NavBarScreenLayout",
  path: "class/:classCode/detail",
  waitOn: function() {
     Meteor.subscribe('class', this.params.classCode);
  }
});

Router.route('ChatInvite', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "chat-invite",
  waitOn: function() {
    /*Meteor.subscribe('joinedClass');*/
    return Meteor.subscribe('getAllJoinedClassesUser');
  }
});

Router.route('ShareInvite', {
  // controller: 'ClassWithIdController',
  path: "class/:classCode/invite/share"
});
Router.route('classEdit', {
  /*controller: 'ClassWithIdController',*/
  // layoutTemplate: "NavBarScreenLayout",
  path: "class/:classCode/edit",
  waitOn: function() {
    return Meteor.subscribe('class', this.params.classCode);
  }
});

Router.route('ClassUsers', {
  path: "class/:classCode/users",
  // layoutTemplate: "NavBarScreenLayout",
  waitOn: function() {
    return Meteor.subscribe('getClassroomWithJoinedUserByClassCode', this.params.classCode);
  }
});

Router.route('UserDetail', {
  /*controller: 'UserController',*/
  path: "user/:_id",
  // layoutTemplate: "NavBarScreenLayout",
  waitOn: function() {
    return[
      Meteor.subscribe('getUserById', this.params._id),
      Meteor.subscribe('getJoinedClassByUserId', this.params._id)
    ];
  }

});

Router.route('MyAccount');

Router.route('SendMessage', {
  /*controller: 'MessageController',*/
  // layoutTemplate: "NavBarScreenLayout",
  path: "message/send/:classCode?",
  waitOn: function() {
    return Meteor.subscribe('createdClassByMe');
  }
});

Router.route('MessageClassSelection', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "message/classselect",
  waitOn: function() {
    return Meteor.subscribe('createdClassByMe');
  }
});

Router.route('ClassPanel', {
  /*controller: 'MessageController',*/
  path: "class/:classCode/panel",
  // layoutTemplate: "NavBarScreenLayout",
  waitOn: function() {
    return Meteor.subscribe('class', this.params.classCode);
  }

});

Router.route('Testing', {
  // layoutTemplate: "NavBarScreenLayout",
  waitOn: function() {
    return [
      Meteor.subscribe('images'),
      Meteor.subscribe('sounds')
    ];
  },
});

Router.route('Test2', {
  controller: "TestController",

});




Router.route('FeedBack', {
  // layoutTemplate: "NavBarScreenLayout",
});
