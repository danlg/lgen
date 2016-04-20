/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
//template for email messaging of chat room and class. TODO: Refactor to support lang parameter
//console.log('emailTemp','is Smartix exist?',Smartix || {});
Smartix = Smartix || {};
Smartix.messageEmailTemplate = function (RecipientUsers, OriginateUser,content, options) {
  
  var originateUserName = OriginateUser.profile.firstName+ " "+OriginateUser.profile.lastName;
  options.lang = options.lang || 'en';
  var bccList = [];
  RecipientUsers.forEach(function(RecipientUser, index, array){
    var bcc = {};
    bcc.email =  RecipientUser.email;
    bcc.name =   RecipientUser.name;
    bcc.type = "bcc";
    bccList.push(bcc);
  });
  var subject;
  if(options.type == 'class'){
   //log.info(options.className);
   subject = TAPi18n.__("NewClassMessageMailTitle",
                        {
                         class_name: options.className
                        },
                        options.lang);
  }else{
   if(options.chatRoomName){
       options.chatRoomName = "@"+options.chatRoomName ;
   }else{
     options.chatRoomName = "";  
   }
   subject = TAPi18n.__("NewChatMessageMailTitle",{user_name: originateUserName ,
                        chat_room_name: options.chatRoomName},options.lang);      
  }
  
  return {
    "message": {
      "merge_language": "handlebars",
      "text": "",
      "subject": subject,
      "from_email": Meteor.settings.FROM_EMAIL,
      "from_name": Meteor.settings.FROM_NAME,
      "to": bccList,
      "html": Spacebars.toHTML(
                                {
                                 title:content,
                                 GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag= options.lang) ,
                                  UnsubscribeEmailNotification: TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag= options.lang)
                                },
                                Assets.getText("emailMessageMasterTemplate.html")
                              )
 
    }
  };
};

Smartix.newClassMailTemplate = function (to, classname, classCode) {
  var emailLang = Meteor.user().lang || "en";
  var titlestr = TAPi18n.__("NewClassMailTitle",{class_name: classname},
                            emailLang);
  var newClassMailContent;
  try{ //get the new class mail template of the specific lang
       newClassMailContent = Assets.getText("lang/"+ emailLang +"/newClass_MailTemplate.html");
     }catch(e){
       log.info(e);
       //fallback to english
       newClassMailContent = Assets.getText("lang/en/newClass_MailTemplate.html");
  }   
  
  //Meteor.user().emails[0].address
  log.info("Sending new newClassMailTemplate:"+ classCode);
  //var titlestr = TAPi18n.__("your_class_is_ready_classname", classname);
  log.info("Sending new newClassMailTemplate:AFTER TAP"+ classCode);
  return {
    "message": {
      "merge_language": "handlebars",
      "html": Spacebars.toHTML(
        {
          title: titlestr,
          content: newClassMailContent,
          GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag = emailLang) ,
          UnsubscribeEmailNotification: TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag = emailLang)
        },
        Assets.getText("emailMessageMasterTemplate.html")
      ),
      "text": "",
      "subject": titlestr,
      "from_email": Meteor.settings.FROM_EMAIL,
      "from_name": Meteor.settings.FROM_NAME,
      "to": [{
        "email": to,
        "name": to,
        "type": "to"
      }],
      "global_merge_vars": [
        {
          "name": "classname",
          "content": classname
        },
        {
          "name": "SHARE_URL",
          "content": Meteor.settings.public.SHARE_URL,
        },
        {
          "name": "classCode",
          "content": classCode,
        },
        {
          "name": "ROOT_URL",
          "content": Meteor.settings.public.ROOT_URL
        },
        {
            "name":"title",
            "content":titlestr
        }
      ]
    }
  };
};


Smartix.testMail = function (to, classname) {

  var date = new Date();
  var email = "dan@littlegenius.io";

  return {
    "message": {
      "merge_language": "handlebars",
      "html": "<h1>" + date + "</h1>",
      "text": "Example text content",
      "subject": "new class ready!",
      "from_email": Meteor.settings.FROM_EMAIL,
      "from_name": Meteor.settings.FROM_NAME,
      "to": [{
        "email": email,
        "name": email,
        "type": "to"
      }]
    }
  };
};

Smartix.feedback = function (content) {
  if (Meteor.settings && Meteor.settings.FEEDBACK_EMAIL)
  {
    var email = Meteor.settings.FEEDBACK_EMAIL;
    var fullName = Smartix.helpers.getFullNameOfCurrentUser();
    log.info("Sending feedback to " + Meteor.settings.FEEDBACK_EMAIL + " from " + fullName);
    return {
      "message": {
        "merge_language": "handlebars",
        "html": "<h3> Feedback From " + fullName + " </h3><p>" + content + "</p>",
        "text": "Example text content",
        "subject": "Feedback from " + fullName,
        "from_email": Meteor.settings.FROM_EMAIL,
        "from_name": fullName,
        "to": [{
          "email": Meteor.settings.FEEDBACK_EMAIL,
          "name":  Meteor.settings.FEEDBACK_EMAIL,
          "type": "to"
        }]
      }
    };
  }
  else {
    log.error("FEEDBACK_EMAIL unknown. Please set in Meteor.settings");
  }

};

Smartix.inviteClassMailTemplate = function (to, classObj) {
  var emailLang = Meteor.user().lang || "en";
  var first = Meteor.user().profile.firstName;
  var last = Meteor.user().profile.lastName;
  var inviteClassMail;
  try{ //get the invite template of the specific lang
     inviteClassMail = Assets.getText("lang/"+ emailLang +"/inviteClassMailTemplate.html");
  }catch(e){
     log.info(e);            
     //fallback to english
     inviteClassMail = Assets.getText("lang/en/inviteClassMailTemplate.html");
  }   
  var acceptLink = Meteor.settings.public.SHARE_URL + "/join/" + classObj.classCode;
  var acceptLinkEncoded = encodeURI(acceptLink);
  var emailTitle = TAPi18n.__("JoinCurrentUserClassMailTitle",{first_name: first ,
                        last_name: last, class_name: classObj.className },emailLang); 
  return {
    "message":{
      "merge_language": "handlebars",
      "subject": emailTitle,
      "html": Spacebars.toHTML(
              {
                title: emailTitle,
                content:  inviteClassMail,          
                GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag = emailLang) ,
                UnsubscribeEmailNotification: TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag = emailLang)
              },
              Assets.getText("emailMessageMasterTemplate.html")
        ),

      "from_email": Meteor.settings.FROM_EMAIL,
      "from_name": Meteor.settings.FROM_NAME,
       "to": [{
        "email": to,
        "name": to,
        "type": "to"
      }],
      "global_merge_vars": [
        {
          "name": "classname",
          "content": classObj.className
        },
        {
          "name": "first",
          "content": first
        },
        {
          "name": "last",
          "content": last
        },
        {
          "name": "classcode",
          "content": classObj.classCode
        },
        {
          "name": "acceptLink",
          "content": acceptLink
        },
        {
          "name": "SHARE_URL",
          "content": Meteor.settings.public.SHARE_URL
        },
        {
          "name": "ROOT_URL",
          "content": Meteor.settings.public.ROOT_URL
        }
      ]     
    }
  };
};

Smartix.verificationEmailTemplate = function(role,userObj,verificationURL){
        var emailLang = userObj.lang || "en";
        var verifyEmailcontent;
        try{ //get the verfication template of the specific lang
            verifyEmailcontent = Assets.getText("lang/"+ emailLang +"/emailVerifyTemplate."+role+".html");
        }catch(e){
       	    log.info(e);            
            //fallback to english
            verifyEmailcontent = Assets.getText("lang/en/emailVerifyTemplate."+role+".html");
        } 
        var firstPass = Spacebars.toHTML(
              {
                //TODO localize me
                title:"",
                content:  verifyEmailcontent,          
                GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag=emailLang) ,
                UnsubscribeEmailNotification: TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag=emailLang)
              },
              Assets.getText("emailMessageMasterTemplate.html")
        );       
        return Spacebars.toHTML(
          {
            firstName:  userObj.profile.firstName,
            verificationURL: verificationURL
          },
          firstPass
        );           
};

Smartix.resetPasswordEmailTemplate = function(role, userObj, resetPwdEmailURL){
  var emailLang = userObj.lang || "en";

  return Spacebars.toHTML(
        {
          title: TAPi18n.__("ResetPasswordEmailContent", {first_name:userObj.profile.firstName }, lang_tag= emailLang),
          content: '<a href="'+resetPwdEmailURL+'">'+TAPi18n.__("ResetPasswordEmailButtonText", {}, lang_tag= emailLang)+'</a>',                               
          GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag= emailLang) ,
          UnsubscribeEmailNotification: TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag= emailLang)
        },
       Assets.getText("emailMessageMasterTemplate.html")
  );  
                           
}; 

