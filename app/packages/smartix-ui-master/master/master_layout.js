/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Template.MasterLayout.helpers({});

Template.MasterLayout.events({});

Template.MasterLayout.onCreated(function () {
    
  this.subscribe('images');
  this.subscribe('sounds');
  this.subscribe('documents'); 
  this.subscribe('class');
  this.subscribe('getJoinedClassUser');  
   
  this.subscribe('globalUsersBasicInfo');
  this.subscribe('userRelationships',Meteor.userId());
  
});