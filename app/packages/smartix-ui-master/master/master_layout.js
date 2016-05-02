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
            if (Object.keys(Meteor.user().roles).length > 1) {
                return true;
            } else {
                return false;
            }            
        }
    },
    getUserName:function(){
        if(Meteor.userId())
        return Meteor.user().profile.firstName;
    },
    isSchoolNamespace:function(){
        return (Session.get('pickedSchoolId') === 'global' || Session.get('pickedSchoolId') === 'system') ? false : true;
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
