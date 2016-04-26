Meteor.methods({
   classinvite: function (classObj, targetFirstEmail) {
    var acceptLink = Meteor.settings.public.SHARE_URL + "/join/" + classObj.classCode;
    var acceptLinkEncoded = encodeURI(acceptLink);
    var first = Meteor.user().profile.firstName;
    var last = Meteor.user().profile.lastName;
    log.info("classinvite:classCode:"+ classObj.classCode+":from:"+last+ ":to:"+ targetFirstEmail + ":URI:"+acceptLinkEncoded);
    //do not log the CONTENT of every message sent !
    //log.info(inviteClassMailTemplate(targetFirstEmail, classObj));
  
      try {
        this.unblock();
        Smartix.inviteClassMailTemplate(targetFirstEmail, classObj);
      }
      catch (e) {
        log.error("classinvite:couldn't send invite email:classCode:"+ classObj.classCode+ ":to:"+ targetFirstEmail );
        log.error(e);
      }
    
  }

});