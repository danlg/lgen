/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Template.MasterLayout.helpers({});

Template.MasterLayout.events({});

Template.MasterLayout.onCreated(function () {

  this.subscribe('images');
  this.subscribe('sounds');
  this.subscribe('documents'); 
  
  //TODO: subscription to be filtered based on selected school
  this.subscribe('class');
  this.subscribe('getJoinedClassUser');  
  
  this.subscribe('userPendingApprovedSchools');
  this.subscribe('globalUsersBasicInfo');
  
  var self = this;
  self.autorun(function(){
      self.subscribe('userRelationships',Meteor.userId());  
  })

  
});