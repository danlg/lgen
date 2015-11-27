Router.configure({
  layoutTemplate: 'MasterLayout',
  //loadingTemplate: 'LoadingSpinner',
  notFoundTemplate: 'NotFound'
});

var OnBeforeActions;

OnBeforeActions = {
  LoginRequired: function (pause) {
    if (!Meteor.userId()) {
      log.info("login required");
      Router.go('Login');
      this.next();
    } else {
      this.next();
    }
  },
  roleRequired: function () {
    if (!Meteor.user().profile.role) {
      Router.go('role');
      this.next();
    } else {
      this.next();
    }
  },
  LoginedRedirect: function (pause) {
    if (Meteor.userId()) {
      Router.go('TabClasses');
      this.next();
    } else {
      this.next();
    }
  },
  checkLanguage: function (pause) {

    if (Meteor.isCordova) {
      var pattern = /-.*/g;

      navigator.globalization.getPreferredLanguage(
        function (language) {
          // alert('language: ' + language.value + '\n');
          // log.info(language);
          var lang = language.value.replace(pattern, "");

          if (!lodash.has(TAPi18n.getLanguages(), lang))
            lang = "en";

          TAPi18n.setLanguage(lang)
            .done(function () {
              Session.setPersistent('lang', lang);
            })
            .fail(function (error_message) {
              // Handle the situation
              log.error(error_message);
            });


        },
        function () {
          alert('Error getting language\n');
        }
      );
    }

    this.next();


  },
  checkDob: function (pause) {
    var dob = lodash.get(Meteor.user(), "profile.dob") || "";
    var role = lodash.get(Meteor.user(), "profile.role") || "";
    if (dob === "" && role === "Student") {
      Router.go('Dob');
      this.next();
    } else {
      this.next();
    }
  }


};

Router.onBeforeAction(OnBeforeActions.LoginRequired, {
  except: ['language', 'Login', 'EmailSignup', 'EmailSignin', 'role',
   'Testing', 'Test2','ClassInformationForWebUser','ClassSearchInformationForWebUser',
   'TermsOfService','PrivacyPolicy']
});


Router.onBeforeAction(OnBeforeActions.LoginedRedirect, {
  only: ['language']
});

Router.onBeforeAction(OnBeforeActions.roleRequired, {
  only: ['TabChat']
});
Router.onBeforeAction(OnBeforeActions.roleRequired, {
  only: ['TabClasses']
});

Router.onBeforeAction('loading');
Router.onBeforeAction(OnBeforeActions.checkLanguage);
Router.onBeforeAction(OnBeforeActions.checkDob, {
  only: ['TabClasses','classDetail']
});

// Router.onBeforeAction(function (argument) {
//   if(Meteor.userId()){
//     Router.go("TabClasses");
//     this.next();
//   }else{
//     this.next();
//   }
// },{only:['Login']});


// Router.route('language', {
//   // controller: 'LoginController',
//   // action: "language",
//   path: "/",
//   name:"language"
// });

Router.route('Login', {
  path: "/",
  waitOn:function () {
    Accounts.loginServicesConfigured();
  }
  //data :function(){
  //  return {
  //    loginToContinue: this.params.query.loginToContinue
  //  };
  //},
  //fastRender: true
});

Router.route('/email-signin', {
  // controller: 'LoginController',
  name: "EmailSignin"
});
Router.route('EmailSignup', {
  path: "email-signup/:role",
});

Router.route('/role', {
  name: "role"
});

Router.route('Dob');

// Router.route('Home', {
//   controller: 'MainApplicationController',
// });

Router.route('TabChat', {
  // layoutTemplate: "NavBarScreenLayout",
  waitOn: function () {
    // return [
    // Meteor.subscribe('getAllMyChatRooms'),
    // Meteor.subscribe('getChatRoomMenbers')
    return Meteor.subscribe('allMyChatRoomWithUser');
    // ];
  },
  /*subscription:function(){
   Meteor.subscribe('getAllMyChatRooms');
   },*/

  path: "/chat",
  fastRender: true  
});

Router.route('TabYou', {
  // controller: 'MainApplicationController',
  // action: "you"
  path: "you"
});


Router.route('Chatoption', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "/chat/option",
  waitOn: function () {
    Meteor.subscribe('createdClassByMe');
  },
  fastRender: true
});
/*Router.route('WorkTimeSelection', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "chat/option/weeksTime",
});
*/
Router.route('Notification', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "/notice/:msgCode",
  waitOn: function () {
    Meteor.subscribe('getClassMsgId', this.params.msgCode);
  },
  fastRender: true
});
Router.route('ClassPanelMsgNotice', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "/panel/notice/:msgCode",
  waitOn: function () {
    return [
      Meteor.subscribe('getClassMsgId', this.params.msgCode),
      Meteor.subscribe('images'),
      Meteor.subscribe('sounds')
    ];
  },
  fastRender: true
});
Router.route('NotificationDetail', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "/notice/:msgCode/detail",
  waitOn: function () {
    Meteor.subscribe('getClassMsgId', this.params.msgCode);
  },
  fastRender: true
});

Router.route('ClassInformation', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "/class/:classCode/info",
  waitOn: function () {
    return [
      Meteor.subscribe('personCreateClass', this.params.classCode),
      Meteor.subscribe('class', this.params.classCode)
    ];
  },
  fastRender: true
});


Router.route('TabClasses', {
  // controller: 'MainApplicationController',
  // action: "classes"
  path: "/classes",
  waitOn: function (argument) {
    return [
      Meteor.subscribe('joinedClass'),
      Meteor.subscribe('createdClassByMe')
    ];
  },
  fastRender: true

});

Router.route('AddClass', {
  // controller: 'ClassController',
  path: "class/add"
});

Router.route('JoinClass', {
  // controller: 'ClassController',
  // layoutTemplate: "NavBarScreenLayout",
  path: "/class/join",
  waitOn: function () {
    Meteor.subscribe('joinedClass');
  },
  fastRender: true
});
Router.route('ClassInvitation', {
  // controller: 'ClassWithIdController',
  path: "/class/:classCode/invite",
  waitOn: function () {
    return [
      Meteor.subscribe('class', this.params.classCode)
    ];
  },
  fastRender: true
});

Router.route('EmailInvite', {
  /*controller: 'ClassWithIdController',*/
  // layoutTemplate: "NavBarScreenLayout",
  path: "/class/:classCode/invite-email",
  waitOn: function () {
    return Meteor.subscribe('class', this.params.classCode);
  },
  fastRender: true
});

Router.route('ChatRoom', {
  path: "/chat/:chatRoomId",
  waitOn: function () {
    // return [Meteor.subscribe('getChatRoomById', this.params.chatRoomId),Meteor.subscribe('images')];
    return [
      Meteor.subscribe('images'),
      Meteor.subscribe('sounds'),
      Meteor.subscribe('chatRoomWithUser', this.params.chatRoomId)
    ];
  },
  fastRender: true
});


Router.route('classDetail', {
  // controller: 'ClassWithIdController',
  // layoutTemplate:"NavBarScreenLayout",
  path: "/class/:classCode/detail",
  waitOn: function () {
    return [
      Meteor.subscribe('class', this.params.classCode),
      Meteor.subscribe('images'),
      Meteor.subscribe('sounds')
    ];
  },
  fastRender: true
});

Router.route('ChatInvite', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "/chat-invite",
  waitOn: function () {
    /*Meteor.subscribe('joinedClass');*/
    return Meteor.subscribe('getAllJoinedClassesUser');
  },
  fastRender: true
});

Router.route('ShareInvite', {
  // controller: 'ClassWithIdController',
  path: "/class/:classCode/invite/share",
  waitOn: function () {
    return [
      Meteor.subscribe('class', this.params.classCode)
    ];
  },
  fastRender: true
});

Router.route('classEdit', {
  /*controller: 'ClassWithIdController',*/
  // layoutTemplate: "NavBarScreenLayout",
  path: "/class/:classCode/edit",
  waitOn: function () {
    return Meteor.subscribe('class', this.params.classCode);
  },
  fastRender: true
});

Router.route('ClassUsers', {
  path: "/class/:classCode/users",
  // layoutTemplate: "NavBarScreenLayout",
  waitOn: function () {
    return Meteor.subscribe('getClassroomWithJoinedUserByClassCode', this.params.classCode);
  },
  fastRender: true
});

Router.route('UserDetail', {
  /*controller: 'UserController',*/
  path: "/user/:_id/:classCode?/:classId?",
  // layoutTemplate: "NavBarScreenLayout",
  waitOn: function () {

    var subList = [];

    if (this.params.classCode) {
      subList.push(Meteor.subscribe('class', this.params.classCode));

    }
    if (this.params.classId) {
      subList.push(Meteor.subscribe('getCommentsByClassIdNId', this.params.classId, this.params._id));
    }


    subList.push(Meteor.subscribe('getUserById', this.params._id));
    subList.push(Meteor.subscribe('getJoinedClassByUserId', this.params._id));

    return subList;
  }

});

Router.route('MyAccount',{
  path:"myaccount"
});

Router.route('SendMessage', {
  /*controller: 'MessageController',*/
  // layoutTemplate: "NavBarScreenLayout",
  path: "/message/send/:classCode?",
  waitOn: function () {
    return [
      Meteor.subscribe('createdClassByMe'),
      Meteor.subscribe('images'),
      Meteor.subscribe('sounds')
    ];
  },
  fastRender: true
});

Router.route('MessageClassSelection', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "/message/classselect",
  waitOn: function () {
    return Meteor.subscribe('createdClassByMe');
  },
  fastRender: true
});

Router.route('ClassPanel', {
  /*controller: 'MessageController',*/
  path: "/class/:classCode/panel",
  // layoutTemplate: "NavBarScreenLayout",
  waitOn: function () {
    return [
      Meteor.subscribe('class', this.params.classCode),
      Meteor.subscribe('images'),
      Meteor.subscribe('sounds')
    ];

  },
  fastRender: true

});

Router.route('Testing', {
  // layoutTemplate: "NavBarScreenLayout",
  waitOn: function () {
    return [
      Meteor.subscribe('images'),
      Meteor.subscribe('sounds')
    ];
  },
});

Router.route('Test2', {
  controller: "TestController",

});


Router.route('Commend', {
  // layoutTemplate: "NavBarScreenLayout",
  path: "/comment/:classId/:_id/",
  waitOn: function (argument) {
    Meteor.subscribe('getClassByClassId', this.params.classId);
    Meteor.subscribe('getUserById', this.params._id);
    Meteor.subscribe('getCommentsByClassIdNId', this.params.classId, this.params._id);
    Meteor.subscribe('getJoinedClassCreatedByMeByUserId', this.params._id);
  },
  fastRender: true
});
Router.route('Feedback', {
  // layoutTemplate: "NavBarScreenLayout",
  path:"feedback"
});

Router.route('Help',{
  path:"help"
});

Router.route('TermsOfService',{
  path:"terms-of-service"
});

Router.route('PrivacyPolicy',{
  path:"privacy-policy"
});

Router.route('About',{
  path:"about"
});

Router.route('HowToInvite',{
    layoutTemplate:'',
    path:"help/howtoinvite"
  }
);

Router.route('HowToInviteShort/:classCode'
  , {
    name: 'HowToInviteShort',
    layoutTemplate:'',
    path:"help/joininapp/:classCode"
    //, classCode2: function(){ return this.params.classCode;}
  }
);

Router.route('NotificationSetting', {
  // layoutTemplate: "NavBarScreenLayout",
});

Router.route('join/', {
  name: 'ClassSearchInformationForWebUser'
});

Router.route('join/:classCode?', {
  name: 'ClassInformationForWebUser',
  waitOn: function () {   
    return [
      Meteor.subscribe('personCreateClass', this.params.classCode),
      Meteor.subscribe('class', this.params.classCode)
    ];
  },
  fastRender: true
});