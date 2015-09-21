addClassMailTemplate = function (to, classname, classCode) {
  return {
    "message": {
      "merge_language": "handlebars",
      "html": "<p class=\"p1\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px Helvetica;color: #008f00;\">Little Genius<\/p> <p class=\"p2\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px \'Helvetica Neue Light\';color: #343b42;\">{{classname}} is ready for you to use<\/p> <p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 16.0px \'Helvetica Neue\';color: #a3a3a3;\">Here are instructions\u00A0you can forward to or print for your class to start receiving your messages.<\/p> <p class=\"p4\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 16.0px \'Helvetica Neue\';color: #a3a3a3;min-height: 18.0px;\"><br><\/p> <p class=\"p5\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;text-align: center;font: 20.0px \'Helvetica Neue\';color: #008f00;\">Get PDF instructions for {{classname}}<\/p>\r\n\r\n<br \/>\r\n\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 16.0px \'Helvetica Neue\';color: #a3a3a3;\">Or share this link with your students and parents: <a href=\"{{WEB_URL}}\/{{classCode}}\"><span class=\"s1\" style=\"color: #2ba6cb;\">{{WEB_URL}}\/{{classCode}}<\/span><\/a><\/p>\r\n\r\n<p>\r\n  <img style=\"width:150px\" src=\"{{ROOT_URL}}\/img\/icon-hd-email.png\" alt=\"\" \/>\r\n<\/p>",
      "text": "Example text content",
      "subject": "New class ready!",
      "from_email": process.env.FROM_EMAIL,
      "from_name": process.env.FROM_NAME,
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
          "name": "WEB_URL",
          "content": process.env.WEB_URL,
        },
        {
          "name": "classCode",
          "content": classCode,
        },
        {
          "name": "ROOT_URL",
          "content": process.env.ROOT_URL
        }
      ]
    }
  };
};

// "WEB_URL":process.env.WEB_URL,
// "classCode":classCode,
// "ROOT_URL":process.env.ROOT_URL


testMail = function (to, classname) {

  var date = new Date();
  var email = "mike@sanuker.com";

  return {
    "message": {
      "merge_language": "handlebars",
      "html": "<h1>" + date + "</h1>",
      "text": "Example text content",
      "subject": "new class ready!",
      "from_email": process.env.FROM_EMAIL,
      "from_name": process.env.FROM_NAME,
      "to": [{
        "email": email,
        "name": "Recipient Name",
        "type": "to"
      }],
    }
  };
};

feedback = function (content) {

  var email = "feedback@littlegenius.io";
  var fullName = getFullNameOfCurrentUser();

  // console.log(fullName);

  return {
    "message": {
      "merge_language": "handlebars",
      "html": "<h3> Feedback From " + fullName + " </h3><p>" + content + "</p>",
      "text": "Example text content",
      "subject": "Feedback from user!",
      "from_email": process.env.FROM_EMAIL,
      "from_name": process.env.FROM_NAME,
      "to": [{
        "email": process.env.FEEDBACK_EMAIL,
        "name": "Recipient Name",
        "type": "to"
      }],
    }
  };
};

inviteClassMailTemplateTest = function (to, classObj) {
  var emailObj = {};

  var message = {};

  var first = Meteor.user().profile.firstname;
  var last = Meteor.user().profile.lastname;
  var acceptLink = process.env.WEB_URL + classObj.classCode;
  var acceptLinkEncoded = encodeURI(acceptLink);


  message.merge_language = "handlebars";
  message.html = "<p class=\"p1\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px Helvetica;color: #008f00;\">Little Genius<\/p>\r\n<p class=\"p2\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px Arial;color: #343b42;\">Please join {{classname}}! <\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">I\'m using\u00A0Little Genius to send important updates, last minute changes, and class\u00A0assignments for {{classname}} (our class code is @{{classcode}}).<\/p>\r\n<p class=\"p4\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;text-align: center;font: 20.0px Arial;color: #008f00;\"><a href=\"{{acceptLink}}\">Accept {{first}} {{last}}\'s request<\/a><\/p>\r\n<p class=\"p5\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;min-height: 15.0px;\"><br><\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">Thanks for joining,\u00A0<\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">{{first}} {{last}}<\/p>\r\n<p class=\"p5\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;min-height: 15.0px;\"><br><\/p>\r\n<p class=\"p6\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;color: #353535;\"><span class=\"s2\" style=\"color: #000000;\">P.S. <a href=\"{{WEB_URL}}\"><span class=\"s3\" style=\"text-decoration: underline;color: #008f00;\">Little Genius<\/span><\/a> is a free, safe, easy-to-use communication tool t<\/span>hat helps me connect with you instantly. You can choose to receive my updates by the Little Genius app or email<\/p>\r\n<p>\r\n  <img style=\"width:150px;\" src=\"http:\/\/{{ROOT_URL}}\/img\/icon-hd-email.png\" alt=\"\" \/>\r\n<\/p>\r\n";
  message.subject = "Please join class";
  message.from_email = process.env.FROM_EMAIL;
  message.from_name = process.env.FROM_NAME;
  message.to = [{"email": to, "name": "Recipient Name", "type": "to"}];
  message.global_merge_vars = [];
  message.global_merge_vars.push({"name": "classname", "content": classObj.classname});
  message.global_merge_vars.push({"name": "first", "content": first});
  message.global_merge_vars.push({"name": "last", "content": last});
  message.global_merge_vars.push({"name": "classcode", "content": classObj.classcode});
  message.global_merge_vars.push({"name": "acceptLink", "content": acceptLink});
  message.global_merge_vars.push({"name": "WEB_URL", "content": process.env.WEB_URL});
  message.global_merge_vars.push({"name": "ROOT_URL", "content": process.env.ROOT_URL});


  emailObj.message = message;
  return emailObj;


};


inviteClassMailTemplate = function (to, first, last, classname, classcode, acceptLink) {
  return {
    "message": {
      "merge_language": "handlebars",
      "html": "<p class=\"p1\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px Helvetica;color: #008f00;\">Little Genius<\/p>\r\n<p class=\"p2\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px Arial;color: #343b42;\">Please join {{classname}}! <\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">I\'m using\u00A0Little Genius to send important updates, last minute changes, and class\u00A0assignments for {{classname}} (our class code is @{{classcode}}).<\/p>\r\n<p class=\"p4\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;text-align: center;font: 20.0px Arial;color: #008f00;\"><a href=\"{{acceptLink}}\">Accept {{first}} {{last}}\'s request<\/a><\/p>\r\n<p class=\"p5\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;min-height: 15.0px;\"><br><\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">Thanks for joining,\u00A0<\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">{{first}} {{last}}<\/p>\r\n<p class=\"p5\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;min-height: 15.0px;\"><br><\/p>\r\n<p class=\"p6\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;color: #353535;\"><span class=\"s2\" style=\"color: #000000;\">P.S. <a href=\"{{WEB_URL}}\"><span class=\"s3\" style=\"text-decoration: underline;color: #008f00;\">Little Genius<\/span><\/a> is a free, safe, easy-to-use communication tool t<\/span>hat helps me connect with you instantly. You can choose to receive my updates by the Little Genius app or email<\/p>\r\n<p>\r\n  <img style=\"width:150px;\" src=\"http:\/\/{{ROOT_URL}}\/img\/icon-hd-email.png\" alt=\"\" \/>\r\n<\/p>\r\n",
      "text": "Example text content",
      "subject": "Please join class",
      "from_email": process.env.FROM_EMAIL,
      "from_name": process.env.FROM_NAME,
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
          "name": "WEB_URL",
          "content": process.env.WEB_URL
        },
        {
          "name": "ROOT_URL",
          "content": process.env.ROOT_URL
        }

      ]
    }
  };
};
