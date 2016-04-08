/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Template.AppLayout.helpers({
    customizeTheme:function(){
        
        var schoolBackgroundColor = Session.get('schoolBackgroundColor')  ;
        var schoolTextColor       = Session.get('schoolTextColor');     
        if(schoolBackgroundColor && schoolTextColor){
            var customStyle = `
                                <style>                    
                                    .bar.bar-stable,
                                    .button.button-stable,
                                    .button.button-positive,
                                    .tabs,
                                    .button-bar .button-bar-button,
                                    .input-box-panel .button
                                    {background-color:${schoolBackgroundColor};color:${schoolTextColor};}
                                    
                                    .bar.bar-stable .title{
                                        color:${schoolTextColor};
                                    }
                                </style>
            
                            `;
            
            return customStyle;            
        }else{
            return "";
        }

    }
    
});

Template.AppLayout.events({});

Template.AppLayout.onCreated(function() {

  this.subscribe('images');
  this.subscribe('sounds');
  this.subscribe('documents'); 
  
  //TODO: subscription to be filtered based on selected school
  this.subscribe('class');
  this.subscribe('getJoinedClassUser');  
  this.subscribe('userPendingApprovedSchools');
  this.subscribe('globalUsersBasicInfo');
  
  var self = this;
  self.autorun(function() {
      self.subscribe('userRelationships', Meteor.userId());  
  });

});
