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
    
  var subject =  "New message from " + OriginateUserName;
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
                                 UnsubscribeEmailNotificaiton: TAPi18n.__("UnsubscribeEmailNotificaiton", {}, lang_tag="en")
                                },
                                Assets.getText("messageEmailMasterTemplate.html")
                              )
 
    }
  };
  
};

addClassMailTemplate = function (to, classname, classCode) {

  return {
    "message": {
      "merge_language": "handlebars",
      "html": Spacebars.toHTML(
        {
          title:"New Class is ready!",
          content: Assets.getText("addClassMailTemplate.html"),          
          GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag="en") ,
          UnsubscribeEmailNotificaiton: TAPi18n.__("UnsubscribeEmailNotificaiton", {}, lang_tag="en")
        },
        Assets.getText("messageEmailMasterTemplate.html")
        
      ),
      "text": "Example text content",
      "subject": "New class ready!",
      "from_email": Meteor.settings.FROM_EMAIL,
      "from_name": Meteor.settings.FROM_NAME,
      "to": [{
        "email": to,
        "name": "Recipient Name",
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
        "name": "Recipient Name",
        "type": "to"
      }],
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
        "subject": "Feedback from user!",
        "from_email": Meteor.settings.FROM_EMAIL,
        "from_name": Meteor.settings.FROM_NAME,
        "to": [{
          "email": Meteor.settings.FEEDBACK_EMAIL,
          "name": "Recipient Name",
          "type": "to"
        }]
      }
    };
  }
  else {
    log.error("FEEDBACK_EMAIL unknown. Please set in Meteor.settings");
  }

};

inviteClassMailTemplateTest = function (to, classObj) {

  var first = Meteor.user().profile.firstname;
  var last = Meteor.user().profile.lastname;
  var acceptLink = Meteor.settings.public.SHARE_URL + "/" + classObj.classCode;
  var acceptLinkEncoded = encodeURI(acceptLink);

  return {
    "message":{
      "merge_language": "handlebars",
      "subject": "Please join class",
      "html": Spacebars.toHTML(
              {
                title:"New class ready!",
                content:
                  "<p class=\"p1\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px Helvetica;color: #008f00;\">Little Genius<\/p>\r\n" +
                  "<p class=\"p2\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px Arial;color: #343b42;\">Please join {{classname}}! " +
                  "<\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">" +
                  "I\'m using\u00A0Little Genius to send important updates, last minute changes, and class" +
                  "\u00A0assignments for {{classname}} (our class code is @{{classcode}}).<\/p>" +
                  "\r\n<p class=\"p4\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;text-align: center;font: 20.0px Arial;color: #008f00;\"><a href=\"{{acceptLink}}\">" +
                  "Accept {{first}} {{last}}\'s request<\/a><\/p>\r\n<p class=\"p5\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;min-height: 15.0px;\"><br>" +
                  "<\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">Thanks for joining,\u00A0<\/p>\r\n" +
                  "<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">" +
                  "{{first}} {{last}}<\/p>\r\n<p class=\"p5\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;min-height: 15.0px;\"><br><\/p>\r\n" +
                  "<p class=\"p6\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;color: #353535;\"><span class=\"s2\" style=\"color: #000000;\">" +
                  "P.S. <a href=\"{{ROOT_URL}}\"><span class=\"s3\" style=\"text-decoration: underline;color: #008f00;\">" +
                  "Little Genius<\/span><\/a> is a free, safe, easy-to-use communication tool t<\/span>hat helps me connect with you instantly. " +
                  "You can choose to receive my updates by the Little Genius app or email<\/p>\r\n" +
                  "<p>\r\n  " +
                  "<img style=\"width:150px;\" src=\"http:\/\/{{ROOT_URL}}\/img\/icon-hd-email.png\" alt=\"\" \/>\r\n<\/p>\r\n",          
                GetTheApp: TAPi18n.__("GetTheApp", {}, lang_tag="en") ,
                UnsubscribeEmailNotificaiton: TAPi18n.__("UnsubscribeEmailNotificaiton", {}, lang_tag="en")              
              },
              Assets.getText("messageEmailMasterTemplate.html")
        ),

      "from_email": Meteor.settings.FROM_EMAIL,
      "from_name": Meteor.settings.FROM_NAME,
       "to": [{
        "email": to,
        "name": "Recipient Name",
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


inviteClassMailTemplate = function (to, first, last, classname, classcode, acceptLink) {
  return {
    "message": {
      "merge_language": "handlebars",
      "html": "<p class=\"p1\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px Helvetica;color: #008f00;\">" +
      "Little Genius<\/p>\r\n<p class=\"p2\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px Arial;color: #343b42;\">" +
      "Please join {{classname}}! <\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">" +
      "I\'m using\u00A0Little Genius to send important updates, last minute changes, and class\u00A0assignments for {{classname}}" +
      " (our class code is @{{classcode}}).<\/p>\r\n<p class=\"p4\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;text-align: center;font: 20.0px Arial;color: #008f00;\">" +
      "<a href=\"{{acceptLink}}\">Accept {{first}} {{last}}\'s request<\/a><\/p>\r\n" +
      "<p class=\"p5\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;min-height: 15.0px;\"><br>" +
      "<\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">" +
      "Thanks for joining,\u00A0<\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">" +
      "{{first}} {{last}}<\/p>\r\n<p class=\"p5\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;min-height: 15.0px;\">" +
      "<br><\/p>\r\n<p class=\"p6\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;color: #353535;\">" +
      "<span class=\"s2\" style=\"color: #000000;\">" +
      "P.S. <a href=\"{{ROOT_URL}}\">" +
      "<span class=\"s3\" style=\"text-decoration: underline;color: #008f00;\">" +
      "Little Genius<\/span><\/a> is a free, safe, easy-to-use communication tool t<\/span>hat helps me connect with you instantly." +
      " You can choose to receive my updates by the Little Genius app or email<\/p>\r\n<p>\r\n  " +
      "<img style=\"width:150px;\" src=\"http:\/\/{{ROOT_URL}}\/img\/icon-hd-email.png\" alt=\"\" \/>\r\n<\/p>\r\n",
      "text": "Example text content",
      "subject": "Please join class",
      "from_email": Meteor.settings.FROM_EMAIL,
      "from_name": Meteor.settings.FROM_NAME,
      "to": [{
        "email": to,
        "name": "Recipient Name",
        "type": "to"
      }],
      "global_merge_vars": [
        {
          "name": "classname",
          "content": classname
        },
        {
          "name": "first",
          "content": first
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
          "name": "classname",
          "content": classname
        },
        {
          "name": "classcode",
          "content": classcode
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
