/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var subs = new SubsManager();
Router.configure({
  layoutTemplate: 'MasterLayout',
  notFoundTemplate: 'NotFound'
});

var OnBeforeActions;

OnBeforeActions = {
  LoginRequired: function (pause) {
    if (!Meteor.userId()) {
      log.warn("login required");
      Router.go('Login');
      this.next();
    } else {
      this.next();
    }
  },
  roleRequired: function () {
    if (Meteor.user() && !Meteor.user().profile.role) {
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
          toastr.error('Error getting language\n');
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
   'TermsOfService','PrivacyPolicy','Tour','Perf']
});

Router.onBeforeAction(OnBeforeActions.LoginedRedirect, {only: ['language']});
Router.onBeforeAction(OnBeforeActions.roleRequired, {only: ['TabChat']} );
Router.onBeforeAction(OnBeforeActions.roleRequired, {only: ['TabClasses'] });


Router.onBeforeAction('loading');
Router.onBeforeAction(OnBeforeActions.checkLanguage);
Router.onBeforeAction(OnBeforeActions.checkDob, {
  only: ['TabClasses','classDetail']
});

Router.route('Tour',{
    layoutTemplate:'',//otherwise we get a green header on the page
    //path:"tour"
    path:"/"
  }
);

Router.route('Login', {
  path: "/login",
  //path: "/",
  waitOn:function () {
    Accounts.loginServicesConfigured();
  }
});

Router.route('/email-signin', {
  name: "EmailSignin"
});
Router.route('EmailSignup', {
  path: "email-signup/:role"
});

Router.route('/role', {
  name: "role"
});

Router.route('Dob');


Router.route('TabYou', {
  path: "you"
});

Router.route('MyAccount',{
  path:"myaccount"
});

Router.route('Chatoption', {
  path: "/chat/option",
  waitOn: function () {
    subs.subscribe('createdClassByMe');
  }
});

Router.route('Notification', {
  path: "/notice/:msgCode",
  waitOn: function () {
    Meteor.subscribe('getClassMsgId', this.params.msgCode);
  }
});
Router.route('ClassPanelMsgNotice', {
  path: "/panel/notice/:msgCode",
  waitOn: function () {
    return [
      Meteor.subscribe('getClassMsgId', this.params.msgCode),
      Meteor.subscribe('images'),
      Meteor.subscribe('sounds')
    ];
  }
});

Router.route('NotificationDetail', {
  path: "/notice/:msgCode/detail",
  waitOn: function () {
    Meteor.subscribe('getClassMsgId', this.params.msgCode);
  }
});

Router.route('ClassInformation', {
  path: "/class/:classCode/info",
  waitOn: function () {
    return [
      Meteor.subscribe('personCreateClass', this.params.classCode),
      Meteor.subscribe('class', this.params.classCode)
    ];
  }
});

Router.map(function(){
  this.route('TabChat',{
    waitOn: function () {
      return subs.subscribe('allMyChatRoomWithUser');
    },
    path: "/chat"     
  });  
  
  this.route('TabClasses',{
    path: "/classes",
    waitOn: function (argument) {
      return [
        subs.subscribe('joinedClass'),
        subs.subscribe('createdClassByMe')
      ];
    }    
  });
  
  this.route('ClassPanel',{
    path: "/class/:classCode/panel",
    waitOn: function () {
      return [
        Meteor.subscribe('class', this.params.classCode),
        Meteor.subscribe('images'),
        Meteor.subscribe('sounds')
      ];
    }    
  });
  
});


Router.route('AddClass', {
  path: "/class/add"
});

Router.route('JoinClass', {
  path: "/class/join",
  waitOn: function () {
    subs.subscribe('joinedClass');
  }
});

Router.route('ClassInvitation', {
  path: "/class/:classCode/invite",
  waitOn: function () {
    return [
      Meteor.subscribe('class', this.params.classCode)
    ];
  }
});

Router.route('EmailInvite', {
  path: "/class/:classCode/invite-email",
  waitOn: function () {
    return Meteor.subscribe('class', this.params.classCode);
  }
});

Router.route('ChatRoom', {
  path: "/chat/:chatRoomId",
  waitOn: function () {
    return [
      Meteor.subscribe('images'),
      Meteor.subscribe('sounds'),
      Meteor.subscribe('chatRoomWithUser', this.params.chatRoomId)
    ];
  }
});

Router.route('classDetail', {
  path: "/class/:classCode/detail",
  waitOn: function () {
    return [
      Meteor.subscribe('class', this.params.classCode),
      Meteor.subscribe('images'),
      Meteor.subscribe('sounds')
    ];
  }
});

Router.route('ChatInvite', {
  path: "/chat-invite",
  waitOn: function () {
    return Meteor.subscribe('getAllJoinedClassesUser');
  }
});

Router.route('ShareInvite', {
  path: "/class/:classCode/invite/share",
  waitOn: function () {
    return [
      Meteor.subscribe('class', this.params.classCode)
    ];
  }
});

Router.route('classEdit', {
  path: "/class/:classCode/edit",
  waitOn: function () {
    return Meteor.subscribe('class', this.params.classCode);
  }
});

Router.route('ClassUsers', {
  path: "/class/:classCode/users",
  waitOn: function () {
    return Meteor.subscribe('getClassroomWithJoinedUserByClassCode', this.params.classCode);
  }
});

Router.route('UserDetail', {
  path: "/user/:_id/:classCode?/:classId?",
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

Router.route('SendMessage', {
  path: "/message/send/:classCode?",
  waitOn: function () {
    return [
      Meteor.subscribe('createdClassByMe'),
      Meteor.subscribe('images'),
      Meteor.subscribe('sounds')
    ];
  }
});

Router.route('MessageClassSelection', {
  path: "/message/classselect",
  waitOn: function () {
    return Meteor.subscribe('createdClassByMe');
  }
});


Router.route('Testing', {
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
  path: "/comment/:classId/:_id/",
  waitOn: function (argument) {
    Meteor.subscribe('getClassByClassId', this.params.classId);
    Meteor.subscribe('getUserById', this.params._id);
    Meteor.subscribe('getCommentsByClassIdNId', this.params.classId, this.params._id);
    Meteor.subscribe('getJoinedClassCreatedByMeByUserId', this.params._id);
  }
});

Router.route('Feedback', {
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

Router.route('Report',{
  path: "report"
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
  }
);

Router.route('NotificationSetting' , {
    path: "notifsetting"
  }
);

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
  }
});

Router.route('EmailVerification');

Router.route('Perf');
