Template.VoteDisplay.helpers({
  isNotEmpty: function (votes) {
    return votes.length > 0;
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
      }else if(voteType == "heartNoEvilStarQuestion"){     
          if(voteOption =="heart"){
            voteCountObj.ionicIcon = "e1a-hearts";
          }else if(voteOption =="noevil"){
            voteCountObj.ionicIcon = "e1a-see_no_evil";
          }else if(voteOption =="star"){
            voteCountObj.ionicIcon = "e1a-star";  
          }else if(voteOption =="question"){
            voteCountObj.ionicIcon = "e1a-grey_question";
          }
      }else if(voteType == "yesNo"){
          if(voteOption == "yes"){
            voteCountObj.ionicIcon = "e1a-white_check_mark";
          }else if(voteOption == "no"){
            voteCountObj.ionicIcon = "e1a-negative_squared_cross_mark";    
          }
      }else if(voteType == "likeDislike"){
          if(voteOption == "like"){
            voteCountObj.ionicIcon = "e1a-hearts";
          }else if(voteOption == "dislike"){
            voteCountObj.ionicIcon = "e1a-see_no_evil";    
          }
      }else if(voteType == "oneTwoThreeFour"){
          if(voteOption == "one"){
            voteCountObj.ionicIcon = "e1a-one";
          }else if(voteOption == "two"){
            voteCountObj.ionicIcon = "e1a-two";    
          }else if(voteOption == "three"){
            voteCountObj.ionicIcon = "e1a-three";    
          }else if(voteOption == "four"){
            voteCountObj.ionicIcon = "e1a-four";    
          }
      }
      
      return voteCountObj;
  }    
});