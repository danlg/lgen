Template.VoteChange.helpers({
  tryShowVoteOptionIcon : function(voteType,voteOption){
      var voteCountObj = {voteOptionText : voteOption};
      if(voteType == "checkedStarCloseHelp"){     
          if(voteOption =="star"){
            voteCountObj.ionicIcon = "ion-ios-star";
          }else if(voteOption =="checked"){
            voteCountObj.ionicIcon = "ion-checkmark-round";
          }else if(voteOption =="close"){
            voteCountObj.ionicIcon = "ion-close-round";  
          }else if(voteOption =="help"){
            voteCountObj.ionicIcon = "ion-help";
          }
      }else if(voteType == "checkedClose"){
          if(voteOption == "checked"){
            voteCountObj.ionicIcon = "ion-checkmark-round";
          }else if(voteOption == "close"){
            voteCountObj.ionicIcon = "ion-close-round";    
          }
      }
      
      return voteCountObj;
  },isSelectAction: function (action) { 
    return lodash.includes(action, Meteor.userId()) ? "colored" : "";
  }   
});