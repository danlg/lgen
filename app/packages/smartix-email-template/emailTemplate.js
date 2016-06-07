/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
//template for email messaging of chat room and class. TODO: Refactor to support lang parameter
//log.info('emailTemp','is Smartix exist?',Smartix || {});
Smartix = Smartix || {};
//unit testing
//Smartix.messageEmailTemplate(['dan@gosmartix.com'],['dan@gosmartix.com'],'content is great',{chatRoomName:'math'})
Smartix.messageEmailTemplate = function (RecipientUsers, OriginateUser, messageObj, groupObj,lang) {
  var originateUserName = OriginateUser.profile.firstName + " " + OriginateUser.profile.lastName;
  //var originateUserName = "dummy";
  lang = lang || 'en';
  var bccList = [];
  RecipientUsers.forEach(function (RecipientUser) {
    var bcc = {};
    bcc.email = RecipientUser.email;
    bcc.name = RecipientUser.name;
    bcc.type = "bcc";
    bccList.push(bcc.email);
  });
  var subject;
  if (groupObj.type === 'class') {
    subject = TAPi18n.__("NewClassMessageMailTitle",
      {
        class_name: groupObj.className
      },
      lang);
  }else if(groupObj.type === 'chat'){
    subject = TAPi18n.__("NewChatMessageMailTitle", {
      user_name: originateUserName,
      chat_room_name: ""
    }, lang);    
  }else if(groupObj.type === 'newsgroup'){
    var schoolObj = SmartixSchoolsCol.findOne(groupObj.namespace);
    subject = messageObj.data.title + ' News from ' + schoolObj.name;
  }
  else {

  }
  //log.info("messageEmailTemplate MAIL_URL:" + process.env.MAIL_URL);
  //Accounts.emailTemplates.from = "Smartix <dan@gosmartix.com>";
  Meteor.defer(function(){
    Email.send(
      {
        subject: subject,
        from: Meteor.settings.FROM_EMAIL,
        //"from_name": Meteor.settings.FROM_NAME,
        bcc: bccList,
        html: Spacebars.toHTML(
          {
            title: messageObj.data.content,
            GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag = lang),
            UnsubscribeEmailNotification: TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag = lang),
            APP_STORE_URL:  Meteor.settings.public.APP_STORE_URL,
            GOOGLE_PLAY_URL:  Meteor.settings.public.GOOGLE_PLAY_URL
          },
          Assets.getText("emailMessageMasterTemplate.html")
        )
      }
    );       
  });

};

//OK unit tested with > meteor shell
//Smartix.newClassMailTemplate ('dan@gosmartix.com','mathematiques','maths')
//to unit test,  replace var emailLang = "en";
Smartix.newClassMailTemplate = function (to, classname, classCode) {
  //var emailLang = "en";
  var emailLang = Meteor.user().lang || "en"; //comment me to unit test

  var newClassMailContent;
  try { //get the new class mail template of the specific lang
    newClassMailContent = Assets.getText("lang/" + emailLang + "/emailNewClassTemplate.html");
  }
  catch (e) {
    log.error(e); //fallback to english
    newClassMailContent = Assets.getText("lang/en/emailNewClassTemplate.html");
  }
  var newClassMailContentTemp =
    Spacebars.toHTML(
      {
        classname : classname,
        classCode : classCode,
        ROOT_URL: Meteor.settings.public.ROOT_URL,
        SHARE_URL: Meteor.settings.public.SHARE_URL
      },
      newClassMailContent
    );
  log.info("Sending newClassMailTemplate:" + classCode);
  var titlestr = TAPi18n.__("NewClassMailTitle", {class_name: classname}, emailLang);
  Email.send({
    "from": Meteor.settings.FROM_EMAIL,
    "to": to,
    "subject": titlestr,
    "html": Spacebars.toHTML(
      {
        title     : titlestr,
        content   : newClassMailContentTemp,
        GetTheApp                    : TAPi18n.__("GetTheApp", {}, lang_tag = emailLang),
        UnsubscribeEmailNotification : TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag = emailLang),
        APP_STORE_URL:  Meteor.settings.public.APP_STORE_URL,
        GOOGLE_PLAY_URL:  Meteor.settings.public.GOOGLE_PLAY_URL
      },
      Assets.getText("emailMessageMasterTemplate.html")
    )
    }
  );
};

//OK unit tested with > meteor shell
//> Smartix.testMail('dan@gosmartix.com','subject important',{classname:'abc'});
Smartix.testMail = function (to, title, classname) {
  Email.send({
    "from": Meteor.settings.FROM_EMAIL,
    "to": to,
    "subject": title,
    "html": Spacebars.toHTML(
      {
        classname : classname
      },
      "<h1>hello </h1> {{classname}}"
    )
  });
};

//tested, to unit test comment var fullName = Smartix.helpers.getFullNameOfCurrentUser();
Smartix.feedback = function (content) {
    if (Meteor.settings && Meteor.settings.FEEDBACK_EMAIL) {
        var email = Meteor.settings.FEEDBACK_EMAIL;
        //var fullName = "toto";//to unit test
        var fullName = Smartix.helpers.getFullNameOfCurrentUser();
        log.info("Sending feedback to " + Meteor.settings.FEEDBACK_EMAIL + " from " + fullName);

        Email.send({
          "from": "dan@gosmartix.com",
          "to": email,
          "subject": "Feedback from " + fullName,
          "html": "<h3> Feedback from " + fullName + " </h3><p>" + content + "</p>"
        });
    }
    else
    {
      log.error("FEEDBACK_EMAIL unknown. Please set in Meteor.settings");
    }
};

//unit tested ok
Smartix.inviteClassMailTemplate = function (to, classObj) {
  log.info("inviteClassMailTemplate");
  //var emailLang = "en",  first = "test_first", last  = "test_last";
  //Comment me to unit test with meteor shell
  // Smartix.inviteClassMailTemplate('dan@gosmartix.com',{classCode:'abc',className:'longclassname'});
  var emailLang = Meteor.user().lang || "en";
  var first = Meteor.user().profile.firstName;
  var last = Meteor.user().profile.lastName;

  var inviteClassMail;
  var acceptLink = Meteor.settings.public.SHARE_URL + "/join/" + classObj.classCode;
  try { //get the invite template of the specific lang
    inviteClassMail = Assets.getText("lang/" + emailLang + "/emailInviteClassTemplate.html");
  }
  catch (e) {
    log.error(e);
    //fallback to english
    inviteClassMail = Assets.getText("lang/en/emailInviteClassTemplate.html");
  }
  var inviteClassMailTemp =
    Spacebars.toHTML(
      {
        first: first,
        last: last,
        classcode: classObj.classCode,
        classname: classObj.className,
        acceptLink: encodeURI(acceptLink),
        ROOT_URL: Meteor.settings.public.ROOT_URL
      },
      inviteClassMail
    );

  var emailTitle = TAPi18n.__("JoinCurrentUserClassMailTitle",
    {first_name: first, last_name: last, class_name: classObj.className}, emailLang);

  log.info("MAIL_URL:" + process.env.MAIL_URL);
  Email.send(
    {
      //TODO tracking
      //see https://developers.sparkpost.com/api/#/reference/smtp-api
      // X-MSYS-API: { "options" : { "open_tracking" : true, "click_tracking" : true } }
      "from": Meteor.settings.FROM_EMAIL,
      "to": to,
      "subject": emailTitle,
      //"text": "hello world"
      "html": Spacebars.toHTML(
        {
          title: emailTitle,
          content: inviteClassMailTemp,
          GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag = emailLang),
          UnsubscribeEmailNotification: TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag = emailLang),
          APP_STORE_URL:  Meteor.settings.public.APP_STORE_URL,
          GOOGLE_PLAY_URL:  Meteor.settings.public.GOOGLE_PLAY_URL
        },
        Assets.getText("emailMessageMasterTemplate.html"))
    }
  );
};

Smartix.verificationEmailTemplate = function (userObj, verificationURL) {
  //log.info('verificationEmailTemplate',userObj);
  var emailLang = userObj.lang || "en";
  var verifyEmailcontent;
  try {
    // Get the verfication template of the specific lang
    verifyEmailcontent = Assets.getText("lang/" + emailLang + "/emailVerifyTemplate.html");
  } catch (e) {
    log.info(e);
  }
  var firstPass = Spacebars.toHTML(
    {
      //TODO localize me
      title: "",
      content: verifyEmailcontent,
      GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag = emailLang),
      UnsubscribeEmailNotification: TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag = emailLang),
      APP_STORE_URL:  Meteor.settings.public.APP_STORE_URL,
      GOOGLE_PLAY_URL:  Meteor.settings.public.GOOGLE_PLAY_URL
    },
    Assets.getText("emailMessageMasterTemplate.html")
  );
  return Spacebars.toHTML(
    {
      firstName: userObj.profile.firstName,
      username: userObj.username,
      password: userObj.username,
      verificationURL: verificationURL
    },
    firstPass
  );
};

Smartix.enrollmentEmailTemplate = function (userObj, initialPwdEmailURL) {
    return Smartix.verificationEmailTemplate (userObj, initialPwdEmailURL);
}; 

Smartix.resetPasswordEmailTemplate = function (userObj, resetPwdEmailURL) {
  var emailLang = userObj.lang || "en";
  return Spacebars.toHTML(
    {
      title: TAPi18n.__("ResetPasswordEmailContent", {first_name: userObj.profile.firstName}, lang_tag = emailLang),
      content: '<a href="' + resetPwdEmailURL + '">' + TAPi18n.__("ResetPasswordEmailButtonText", {}, lang_tag = emailLang) + '</a>',
      GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag = emailLang),
      UnsubscribeEmailNotification: TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag = emailLang),
      APP_STORE_URL:  Meteor.settings.public.APP_STORE_URL,
      GOOGLE_PLAY_URL:  Meteor.settings.public.GOOGLE_PLAY_URL
    },
    Assets.getText("emailMessageMasterTemplate.html")
  );
}; 

Smartix.notifyEmailTemplate = function (userObj, classObj) {
    
    let lang = userObj.lang || "en";
    let content;
    try {
        // Get the verfication template of the specific lang
        content = Assets.getText("lang/" + lang + "/emailNotifyJoinClassTemplate.html");
    } catch (e) {
        content = Assets.getText("lang/" + lang + "/emailNotifyJoinClassTemplate.html");
    }

    return Spacebars.toHTML(
        {
            first: userObj.profile.firstName,
            last: userObj.profile.lastName,
            acceptLink: Meteor.settings.public.ROOT_URL,
            ROOT_URL: Meteor.settings.public.ROOT_URL,
            classname: classObj.className || "",
            classcode: classObj.classCode || "",
            GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag = lang),
        }, Spacebars.toHTML(
            {
                title: "",
                content: content,
                GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag = lang),
                UnsubscribeEmailNotification: TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag = lang),
                APP_STORE_URL:  Meteor.settings.public.APP_STORE_URL,
                GOOGLE_PLAY_URL:  Meteor.settings.public.GOOGLE_PLAY_URL
            },
            Assets.getText("emailMessageMasterTemplate.html")
        )
    );
}; 


    