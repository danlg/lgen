/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Template.AppLayout.onCreated(function() {
    //TODO: subscription to be filtered based on selected school
    this.subscribe('smartix:classes/associatedClasses');
    this.subscribe('smartix:classes/allUsersWhoHaveJoinedYourClasses');
    this.subscribe('smartix:accounts/ownUserData');
    this.subscribe('smartix:accounts/basicInfoOfAllUsersInNamespace', 'global');//?
    // this.subscribe('allMyChatRoomWithUser');

    var self = this;
    self.autorun(function() {
        self.subscribe('userRelationships', Meteor.userId());
        self.subscribe('mySchools');
    });
});

Template.AppLayout.helpers({
    customizeTheme: function() {
        var pickSchool = SmartixSchoolsCol.findOne(Session.get('pickedSchoolId'));

        if (!pickSchool) {
            return "";
        }

        if (pickSchool.preferences.schoolBackgroundColor && pickSchool.preferences.schoolTextColor) {
            var schoolBackgroundColor = pickSchool.preferences.schoolBackgroundColor;
            var schoolTextColor = pickSchool.preferences.schoolTextColor;
            if (schoolBackgroundColor && schoolTextColor) {
                var customStyle = `
                                    <style>                        
                                        .bar.bar-stable,
                                        .button.button-stable,
                                        .button.button-positive,
                                        .button.button-positive.active,
                                        .button.button-positive.activated,                                                                                               
                                        .tabs,
                                        /*.tabs-striped .tabs,*/
                                        .button-bar .button-bar-button,
                                        .input-box-panel .button
                                        {
                                          border-color: ${schoolBackgroundColor};
                                          background-color:${schoolBackgroundColor};
                                          color:${schoolTextColor};
                                        }
                                        .tabs-striped .tabs {
                                            color:#444;
                                        }
                                        .tabs-top.tabs-striped .tab-item.tab-item-active, .tabs-top.tabs-striped .tab-item.active, .tabs-top.tabs-striped .tab-item.activated{
                                            border-color:#444;
                                        }
                                        .bar.bar-stable .title{
                                            color:${schoolTextColor};
                                        }
                                        
                                        .bar.bar-stable i{
                                            color:${schoolTextColor};
                                        } 
                                        
                                        .bar.bar-stable .button{
                                            color:${schoolTextColor};
                                        } 
                                        
                                        .card.square-card .mask{
                                           background-color:${schoolBackgroundColor}; 
                                        }
                                        
                                        /** checkbox color **/
                                        .toggle.toggle-positive input:checked + .track,                                        
                                        .toggle input:checked + .track
                                        {
                                            border-color:${schoolBackgroundColor};
                                            background-color:${schoolBackgroundColor};
                                        }
                                                                                                          
                                    </style>
                
                                `;

                return customStyle;
            } else {
                return "";
            }
        } else {
            return "";
        }


    },

    getCurrentSchoolNameDisplay: function() {
        if (Session.get('pickedSchoolId') === 'global') return 'global';
        //if (Session.get('pickedSchoolId') === 'system') return 'system';
        var pickSchool = SmartixSchoolsCol.findOne(UI._globalHelpers['getCurrentSchoolId']());
        return pickSchool ? pickSchool.fullname : false;
    },

    belongToMultiSchool: function() {     
        if(Meteor.userId()){
            if(Meteor.user() && Meteor.user().roles){
                return (Object.keys(Meteor.user().roles).length > 1 );
            } 
        }
    },
    getUserName:function(){
        if(Meteor.userId() && Meteor.user() && Meteor.user().profile)
        return Meteor.user().profile.firstName || "";
    },
    isSchoolNamespace:function(){
        return true;
        //(Session.get('pickedSchoolId') === 'global' || Session.get('pickedSchoolId') === 'system') ? false : true;
    },
    isAdminInCurrentNamespace:function(){
        if(Meteor.userId()){
            if(Meteor.user() && Meteor.user().roles && Meteor.user().roles[Session.get('pickedSchoolId')] ){
               return (Meteor.user().roles[Session.get('pickedSchoolId')].indexOf('admin') !== -1)                  
            } 
        }        
    }

});

Template.AppLayout.events({
    'click .signOut': function () {
        log.info("logout:" + Meteor.userId());
        Meteor.logout(
            function (err) {
                //remove all session variables when logout
                Session.clear();
                Router.go('LoginSplash');
            }
        );
    }
});



Template.AppLayout.onRendered(function(){
    //log.info('Template.AppLayout.onRendered : checkLanguage');
    checkLanguage();
});

function checkLanguage(pause) {
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
          var supportedLanguages = TAPi18n.getLanguages();
          //log.info("SupportedLanguages'"+ JSON.stringify(supportedLanguages)+ "'");
          if( Object.keys(supportedLanguages).indexOf(lang) === -1 )
          {
              log.warn(lang, " not found. Defaulting to English");
              lang = "en";
          }
          else {
              log.info("Found lang mapping", lang);
          }
          TAPi18n.setLanguage(lang);
          if(Meteor.userId() ) { //update user language
            Meteor.call("updateProfileByPath", 'lang', lang);
          }
        },
        function () {
          toastr.error('Error getting language\n');
        }
      );
    }
    else //web
    {
        var lang;
        var languagePrefs = navigator.languages;
        //safari does not support navigator.languages, so navigator.language is used instead
        if(!languagePrefs) {
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
        lang = languagePrefs[0];
        if(lang === 'zh'){  //fallback to zh-TW if zh
            lang = 'zh-TW';
        }
        var supportedLanguages = TAPi18n.getLanguages();
        //log.info("SupportedLanguages'"+ JSON.stringify(supportedLanguages)+ "'");
        if( Object.keys(supportedLanguages).indexOf(lang) === -1 )
        {
            log.warn(lang, " not found. Defaulting to English");
            lang = "en";
        }
        else {
            log.info("Found lang mapping", lang);
        }
        TAPi18n.setLanguage(lang);
        //we store the user language preferred language
        if(Meteor.userId() ){
            Meteor.call("updateProfileByPath", 'lang', lang);
        }
    }
  }