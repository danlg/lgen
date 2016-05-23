/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Template.AppLayout.helpers({
    customizeTheme: function() {
        var pickSchool = SmartixSchoolsCol.findOne(Session.get('pickedSchoolId'));

        if (!pickSchool) {
            return "";
        }

        if (pickSchool.preferences.schoolBackgroundColor && pickSchool.preferences.schoolTextColor) {
            var schoolBackgroundColor = pickSchool.preferences.schoolBackgroundColor;
            var schoolTextColor = pickSchool.preferences.schoolTextColor;
            if (schoolBackgroundColor && schoolTextColor) {
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
                                        
                                        .bar.bar-stable i{
                                            color:${schoolTextColor};
                                        } 
                                        
                                        .bar.bar-stable .button{
                                            color:${schoolTextColor};
                                        } 
                                        
                                        .card.square-card .mask{
                                           background-color:${schoolBackgroundColor}; 
                                        }
                                        
                                        /** checkbox color **/
                                        .toggle.toggle-positive input:checked + .track,                                        
                                        .toggle input:checked + .track
                                        {
                                            border-color:${schoolBackgroundColor};
                                            background-color:${schoolBackgroundColor};
                                        }                                                                        
                                    </style>
                
                                `;

                return customStyle;
            } else {
                return "";
            }
        } else {
            return "";
        }


    },

    getCurrentSchoolName: function() {
        if (Session.get('pickedSchoolId') === 'global') return 'global';
        if (Session.get('pickedSchoolId') === 'system') return 'system';
        var pickSchool = SmartixSchoolsCol.findOne(Session.get('pickedSchoolId'));
        return pickSchool ? pickSchool.username : false;
    },

    getCurrentSchoolNameDisplay: function() {
        if (Session.get('pickedSchoolId') === 'global') return 'global';
        if (Session.get('pickedSchoolId') === 'system') return 'system';
        var pickSchool = SmartixSchoolsCol.findOne(Session.get('pickedSchoolId'));
        return pickSchool ? pickSchool.name : false;
    },

    belongToMultiSchool: function() {     
        if(Meteor.userId()){
            if(Meteor.user() && Meteor.user().roles){
                return (Object.keys(Meteor.user().roles).length > 1 ) ? true: false;                   
            } 
        }
    },
    getUserName:function(){
        if(Meteor.userId() && Meteor.user() && Meteor.user().profile)
        return Meteor.user().profile.firstName || "";
    },
    isSchoolNamespace:function(){
        return (Session.get('pickedSchoolId') === 'global' || Session.get('pickedSchoolId') === 'system') ? false : true;
    },
    isAdminInCurrentNamespace:function(){
        if(Meteor.userId()){
            if(Meteor.user() && Meteor.user().roles && Meteor.user().roles[Session.get('pickedSchoolId')] ){
               return (Meteor.user().roles[Session.get('pickedSchoolId')].indexOf('admin') !== -1)                  
            } 
        }        
    }

});

Template.AppLayout.events({});

Template.AppLayout.onCreated(function() {

    this.subscribe('images');
    this.subscribe('sounds');
    this.subscribe('documents');


    //TODO: subscription to be filtered based on selected school
    this.subscribe('smartix:classes/associatedClasses');
    this.subscribe('smartix:classes/allUsersWhoHaveJoinedYourClasses');
    this.subscribe('smartix:accounts/ownUserData');
    this.subscribe('smartix:accounts/basicInfoOfAllUsersInNamespace', 'global');
    this.subscribe('allMyChatRoomWithUser');
    
    var self = this;
    self.autorun(function() {
        self.subscribe('userRelationships', Meteor.userId());
        self.subscribe('mySchools');
    });

});
