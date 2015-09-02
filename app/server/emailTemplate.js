addClassMailTemplate = function(to,classname) {
  return {
    "message": {
      "merge_language": "handlebars",
      "html": "<p class=\"p1\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px Helvetica;color: #008f00;\">little genius<\/p> <p class=\"p2\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px \'Helvetica Neue Light\';color: #343b42;\">{{classname}} is ready for you to use<\/p> <p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 16.0px \'Helvetica Neue\';color: #a3a3a3;\">Here are instructions\u00A0you can forward to or print for your class to start receiving your messages.<\/p> <p class=\"p4\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 16.0px \'Helvetica Neue\';color: #a3a3a3;min-height: 18.0px;\"><br><\/p> <p class=\"p5\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;text-align: center;font: 20.0px \'Helvetica Neue\';color: #008f00;\">Get PDF instructions for {{classname}}<\/p> <p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 16.0px \'Helvetica Neue\';color: #a3a3a3;\">Or share this link with your students and parents: <a href=\"http:\/\/www.littlegenius.io\/join\/jsebbmath\/%3Ctoken%3E\"><span class=\"s1\" style=\"color: #2ba6cb;\">http:\/\/www.littlegenius.io\/join\/jsebbmath<\/span><\/a><\/p>",
      "text": "Example text content",
      "subject": "new class ready!",
      "from_email": "message.from_email@example.com",
      "from_name": "little genius",
      "to": [{
        "email": to,
        "name": "Recipient Name",
        "type": "to"
      }],
      "global_merge_vars": [{
        "name": "classname",
        "content": classname
      }]
    }
  };
};



testMail = function(to,classname) {

  var date = new Date();
  var email = "mike@sanuker.com";

  return {
    "message": {
      "merge_language": "handlebars",
      "html": "<h1>"+date+"</h1>" ,
      "text": "Example text content",
      "subject": "new class ready!",
      "from_email": "message.from_email@example.com",
      "from_name": "little genius",
      "to": [{
        "email": email ,
        "name": "Recipient Name",
        "type": "to"
      }],
    }
  };
};

inviteClassMailTemplate = function(to,first,last,classname,classcode,acceptLink) {
  return {
    "message": {
      "merge_language": "handlebars",
      "html": "<p class=\"p1\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px Helvetica;color: #008f00;\">little genius<\/p>\r\n<p class=\"p2\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 30.0px Arial;color: #343b42;\">Please join {{classname}}! <\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">I\'m using\u00A0Little Genius to send important updates, last minute changes, and class\u00A0assignments for {{classname}} (our class code is @{{classcode}}).<\/p>\r\n<p class=\"p4\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;text-align: center;font: 20.0px Arial;color: #008f00;\"><a href=\"{{acceptLink}}\">Accept {{first}} {{last}}\'s request<\/a><\/p>\r\n<p class=\"p5\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;min-height: 15.0px;\"><br><\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">Thanks for joining,\u00A0<\/p>\r\n<p class=\"p3\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;\">{{first}} {{last}}<\/p>\r\n<p class=\"p5\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;min-height: 15.0px;\"><br><\/p>\r\n<p class=\"p6\" style=\"margin: 0.0px 0.0px 0.0px 0.0px;font: 13.0px Arial;color: #353535;\"><span class=\"s2\" style=\"color: #000000;\">P.S. <a href=\"http:\/\/www.littlege\"><span class=\"s3\" style=\"text-decoration: underline;color: #008f00;\">Little Genius<\/span><\/a> is a free, safe, easy-to-use communication tool t<\/span>hat helps me connect with you instantly. You can choose to receive my updates by the Little Genius app or email<\/p>\r\n",
      "text": "Example text content",
      "subject": "Please join class",
      "from_email": "message.from_email@example.com",
      "from_name": "little genius",
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
      }

      ]
    }
  };
};
