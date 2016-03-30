Meteor.methods({
   classinvite: function (classObj, targetFirstEmail) {
    var acceptLink = Meteor.settings.public.SHARE_URL + "/join/" + classObj.classCode;
    var acceptLinkEncoded = encodeURI(acceptLink);
    var first = Meteor.user().profile.firstname;
    var last = Meteor.user().profile.lastname;
    log.info("classinvite:classCode:"+ classObj.classCode+":from:"+last+ ":to:"+ targetFirstEmail + ":URI:"+acceptLinkEncoded);
    //do not log the CONTENT of every message sent !
    //log.info(inviteClassMailTemplate(targetFirstEmail, classObj));
  
      try {
        Mandrill.messages.send(inviteClassMailTemplate(targetFirstEmail, classObj));
      }
      catch (e) {
        log.error("classinvite:couldn't send invite email:classCode:"+ classObj.classCode+ ":to:"+ targetFirstEmail );
        log.error(e);
      }
    
  },
    
    
});