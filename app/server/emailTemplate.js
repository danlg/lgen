//template for email messaging of chat room and class 
messageEmailTemplate = function (RecipientUsers, OriginateUserName,content, className) {

  var bccList = [];
  RecipientUsers.forEach(function(RecipientUser, index, array){
    var bcc = {};
    bcc.email =  RecipientUser.email;
    bcc.name =   RecipientUser.name;
    bcc.type = "bcc";
    bccList.push(bcc);
  });
  //TODO localize me !
  var subject =  "New message from " + OriginateUserName + " via Little Genius";
  if(className){
    subject = subject + " class - " + className;
  }
  return {
    "message": {
      "merge_language": "handlebars",
      "text": "Example text content",
      "subject": subject,
      "from_email": Meteor.settings.FROM_EMAIL,
      "from_name": Meteor.settings.FROM_NAME,
      "to": bccList,
      "html": Spacebars.toHTML(
                                {
                                 title:content,
                                 GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag="en") ,
                                  UnsubscribeEmailNotification: TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag="en")
                                },
                                Assets.getText("messageEmailMasterTemplate.html")
                              )
 
    }
  };
  
};

newClassMailTemplate = function (to, classname, classCode) {
  var titlestr = "Your class " + classname + " is ready!";
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
          content: Assets.getText("newClass_MailTemplate.html"),
          GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag="en") ,
          UnsubscribeEmailNotification: TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag="en")
        },
        Assets.getText("messageEmailMasterTemplate.html")
      ),
      "text": "No plain text for now just html",
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
        }
      ]
    }
  };
};


testMail = function (to, classname) {

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

feedback = function (content) {
  if (Meteor.settings && Meteor.settings.FEEDBACK_EMAIL)
  {
    var email = Meteor.settings.FEEDBACK_EMAIL;
    var fullName = getFullNameOfCurrentUser();
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

inviteClassMailTemplate = function (to, classObj) {

  var first = Meteor.user().profile.firstname;
  var last = Meteor.user().profile.lastname;
  var acceptLink = Meteor.settings.public.SHARE_URL + "/join/" + classObj.classCode;
  var acceptLinkEncoded = encodeURI(acceptLink);

  return {
    "message":{
      "merge_language": "handlebars",
      "subject": "Please join class",
      "html": Spacebars.toHTML(
              {
                //TODO localize me
                title:"Join {{first}} {{last}}'s {{classname}} class",
                content:  Assets.getText("inviteClassMailTemplate.html"),          
                GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag="en") ,
                UnsubscribeEmailNotification: TAPi18n.__("UnsubscribeEmailNotification", {}, lang_tag="en")
              },
              Assets.getText("messageEmailMasterTemplate.html")
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

