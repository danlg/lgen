var subs = new SubsManager();

Router.configure({
  layoutTemplate: 'AppLayout',
  notFoundTemplate: 'NotFound',
  loadingTemplate: 'Loading'
});

var OnBeforeActions = {
  LoginRequired: function (pause) {
    if (!Meteor.userId()) {
      log.warn("login required");
      Router.go('LoginSplash');
    }
    this.next();
  },
  roleRequired: function () {
    if (Meteor.user() && !Meteor.user().profile.role) {
      Router.go('role');
    }
    this.next();
  },
  LoginedRedirect: function (pause) {
    if (Meteor.userId()) {
      Router.go('TabClasses');
    }
    this.next();
  },

  /*isTraditionalChinese(lang) {
    return lang.toLower().includes("zh-tw")
    lang.toLower().includes("zh-hk")
    || lang.toLower().includes("hant");
    //case zh not taken into account
  },
  isSimplifiedChinese(lang) {
    return lang.toLower().includes("zh-cn")
    || lang.toLower().includes("hans");
  },*/

  checkLanguage: function (pause) {
    // see https://developer.apple.com/library/ios/documentation/MacOSX/Conceptual/BPInternational/LanguageandLocaleIDs/LanguageandLocaleIDs.html
    //itap18n doesn't support the iOS notation
    //todo check that this is loaded when initializing screen on cordova
    if (Meteor.isCordova) {
      navigator.globalization.getPreferredLanguage(
        function (mobilePhoneLanguage) {
          // alert('language: ' + language.value + '\n');
          //log.info("checkLanguage:cordova:'"+ mobilePhoneLanguage.value+ "'");
          var lang;
          if (Smartix.helpers.isChinese( mobilePhoneLanguage.value) ) {
            var chineseMap = {};
            chineseMap["zh-Hant"] = "zh-TW";
            chineseMap["zh-HK"]   = "zh-TW";
            chineseMap["zh-TW"]   = "zh-TW";

            chineseMap["zh-CN"]   = "zh-CN";
            chineseMap["zh-Hans"] = "zh-CN";
            //possible values are :'zh-HK', 'zh-Hans-HK','zh-CN', zh-Hans-CN
            //log.info("checkLanguage:cordova:ChineseMap:'" + lodash.toString (chineseMap));
            //log.info("checkLanguage:cordova:Chinese:'" + mobilePhoneLanguage.value + "'");
            if (Smartix.helpers.isHan(mobilePhoneLanguage.value)) {
              
              //we remove the country
              var langPartsArray = mobilePhoneLanguage.value.split('-');
              var langtmp;
              if(langPartsArray.length > 2){
                  langtmp = langPartsArray[0]+"-"+langPartsArray[1];
              } else {
                  langtmp = mobilePhoneLanguage.value;
              }           
              
              //what is min?
              //var langtmp = mobilePhoneLanguage.value.substr(0, min(7, mobilePhoneLanguage.value.length));
              lang = chineseMap [langtmp];
              //log.info("checkLanguage:cordova:chineseMap:Han'" + langtmp + "->" +lang);
            } else {  //zh-HK,zh-CN,..
              lang = chineseMap [mobilePhoneLanguage.value];
              //log.info("checkLanguage:cordova:chineseMap:NoHan'" + mobilePhoneLanguage.value + "->" +lang);
            }
          }
          else {
            var pattern = /-.*/g; //remove the country e.g. fr-HK => fr
            lang = mobilePhoneLanguage.value.replace(pattern, "");
          }
          //log.info("checkLanguage:TAPi18n.getLanguages:before'");
          var supportedLanguages = TAPi18n.getLanguages();
          //log.info("checkLanguage:TAPi18n.getLanguages:after'");
          //log.info("checkLanguage:supportedLanguages:before'"+ supportedLanguages+ "'");          
          //log.info(supportedLanguages);
          //log.info("checkLanguage:supportedLanguages:after'"+ supportedLanguages+ "'");          
          //if (!lodash.includes(supportedLanguages, lang))
          if (Object.keys(supportedLanguages).indexOf(lang) == -1 ) {
            log.warn("checkLanguage:Defaulting to English");
            lang = "en";
          } else {
            log.info("checkLanguage:Found lang mapping");
          }

          log.info("checkLanguage:setLang:'" + lang + "'");
          i18Init(lang);
         
         //&& ( !Meteor.user().profile.lang || Meteor.user().profile.lang =="")
         if(Meteor.userId() ){
           //update user language
           Meteor.call("updateProfileByPath", 'profile.lang', lang); 
         }       
        },
        function () {
          toastr.error('Error getting language\n');
        }
      );
    }
    else //web
    {
        //debugger;
        var lang;
        var languagePrefs = navigator.languages;
        
        //safari does not support navigator.languages, so navigator.language is used instead
        if(!languagePrefs){
            var languageFromSafari = navigator.language;
            var languageFromSafariInParts;
            if(languageFromSafari.indexOf("-") > -1){
                languageFromSafariInParts =  languageFromSafari.split('-');
            }
            if(languageFromSafari.indexOf("_") > -1){
                languageFromSafariInParts =  languageFromSafari.split('_');
            }
            if(languageFromSafari.indexOf("zh") > -1 && languageFromSafari.length == 2){
               languageFromSafari = languageFromSafariInParts[0] + "-" + 'TW';
            }else if(languageFromSafari.indexOf("zh") > -1){
               languageFromSafari = languageFromSafariInParts[0] + "-" + languageFromSafariInParts[1].toUpperCase();
            }
            else{
               languageFromSafari = languageFromSafariInParts[0];
            }
            languagePrefs = [];
            languagePrefs.push(languageFromSafari);
        }
        
          log.info("checkLanguage:web:langprefs:"+languagePrefs);
          lang = languagePrefs[0];
          
          //fallback to zh-TW in this case
          if(lang == 'zh'){
              lang = 'zh-TW';
          }
          var supportedLanguages = TAPi18n.getLanguages();
          //log.info("checkLanguage:TAPi18n.getLanguages:after'");
          //log.info("checkLanguage:supportedLanguages:before'"+ supportedLanguages+ "'");          
          //log.info(supportedLanguages);
          //log.info("checkLanguage:supportedLanguages:after'"+ supportedLanguages+ "'");          
          //if (!lodash.includes(supportedLanguages, lang))
          if( Object.keys(supportedLanguages).indexOf(lang) == -1 )
          {
            log.warn("checkLanguage:Defaulting to English");
            lang = "en";
          }
          else{
            log.info("checkLanguage:Found lang mapping");
          }
          
          log.info("checkLanguage:setLang:'"+ lang+ "'");
          i18Init(lang);
        
         //&& ( !Meteor.user().profile.lang || Meteor.user().profile.lang =="")
         if(Meteor.userId() ){
           //update user language
           Meteor.call("updateProfileByPath", 'profile.lang', lang); 
         }
            
    }
    this.next();
  },
  checkDob: function (pause) {
    var dob = lodash.get(Meteor.user(), "profile.dob") || "";
    var role = lodash.get(Meteor.user(), "profile.role") || "";
    if (dob === "" && role === "Student") {
      Router.go('Dob');
    }
    this.next();
  },
  hasUserSeenAppTour:function(){
    //if login user has seen app tour before, we will redirect the user directly to class page
    //this checking should only be enabled if user access the page from root path '/'
    //it should not enabled if user access the page from You > Help
    if (Meteor.user() && Meteor.user().profile.hasUserSeenTour) {
      Router.go("TabClasses");
    }//we show the tour
    this.next();
  }
};

var i18Init = function (lang) {
  TAPi18n.setLanguage(lang)
  .done(function () {
    log.info("checkLanguage:setLang:'"+ lang+ "'"+"OK");
    Session.setPersistent('lang', lang);
  })
  .fail(function (error_message) {
    // Handle the situation
    log.error("checkLanguage:setLang:'"+ lang+ "'"+"KO");
    log.error(error_message);
  });
};
/*
var i18Init = function () {
  log.info("i18Init");
  i18next.init({
    lowerCaseLng: true,
    whitelist: ['en', 'fr', 'zh-tw', 'zh-cn'],
    load: 'currentOnly'
    // other options
  });
};*/


//the following routes does not require login to access
Router.onBeforeAction(OnBeforeActions.LoginRequired, {
  except: ['language', 'Login', 'EmailSignup', 'EmailSignin','EmailForgetPwd','EmailResetPwd', 'role',
   'Testing', 'Test2','ClassInformationForWebUser','ClassSearchInformationForWebUser',
   'TermsOfService','PrivacyPolicy','TourFromHomePage','Perf','LoginSplash']
});

Router.onBeforeAction(OnBeforeActions.LoginedRedirect, {only: ['language']});
Router.onBeforeAction(OnBeforeActions.roleRequired, {only: ['TabChat']} );
Router.onBeforeAction(OnBeforeActions.roleRequired, {only: ['TabClasses'] });
Router.onBeforeAction(OnBeforeActions.hasUserSeenAppTour, {only: ['TourFromHomePage'] });

Router.onBeforeAction('loading');
Router.onRun(OnBeforeActions.checkLanguage);
Router.onBeforeAction(OnBeforeActions.checkDob, {
  only: ['TabClasses','classDetail']
});

Router.route('/role', {
  name: "role"
});

Router.route('TabClasses', {
    path: "/classes",
    waitOn: function(argument) {
        return [
            subs.subscribe('joinedClass'),
            subs.subscribe('createdClassByMe')
        ];
    }
});

Router.route('TabChat', {
    waitOn: function() {
        return subs.subscribe('allMyChatRoomWithUser');
    },
    path: "/chat"
});
  
Router.route('TabYou', {
  path: "you"
});

Router.route('MyAccount',{
  path:"myaccount"
});



Router.route('Notification', {
  path: "/notice/:msgCode",
  waitOn: function () {
    Meteor.subscribe('smartix:messages/messagesById', this.params.msgCode);
  }
});

Router.route('MessageExtraInfo', {
  path: "/panel/notice/:msgCode",
  waitOn: function () {
    return [
      Meteor.subscribe('smartix:messages/messagesById', this.params.msgCode),
      Meteor.subscribe('smartix:classes/allUsersWhoHaveJoinedYourClasses') 
    ];
  }
});

Router.route('NotificationDetail', {
  path: "/notice/:msgCode/detail",
  waitOn: function () {
    Meteor.subscribe('smartix:messages/messagesById', this.params.msgCode);
  }
});



Router.route('NotificationSetting' , {
    path: "notifsetting"
  }
);

Router.route('Perf');

Router.route('PrivateNote', {
  path: "/private-note/:classId/:_id/",
  waitOn: function (argument) {
    Meteor.subscribe('smartix:classes/classById', this.params.classId);
    Meteor.subscribe('getUserById', this.params._id);
    Meteor.subscribe('getCommentsByClassIdNId', this.params.classId, this.params._id);
    Meteor.subscribe('getJoinedClassCreatedByMeByUserId', this.params._id);
  }
});