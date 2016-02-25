Template.VoteDisplay.helpers({
  isNotEmpty: function (votes) {
    return votes.length > 0;
  },
  isVoteOptionWithIcon:function(voteOptionIconString){
      if(voteOptionIconString){
          return true;
      }else{
          return false;
      }
  },
  optionShouldBeDisplayedEvenIfNoVote: function(voteType){
      if(voteType == "checkedStarCloseHelp" || voteType == "abcd"){
          return false;
      }else if(voteType == "checkedClose"){
          return true;
      }else{
          return true;
      }
  },
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
  }    
});