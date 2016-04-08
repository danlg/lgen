/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Template.AppLayout.helpers({});

Template.AppLayout.events({});

Template.AppLayout.onCreated(function() {

  this.subscribe('images');
  this.subscribe('sounds');
  this.subscribe('documents'); 
  this.subscribe('class');
  this.subscribe('getJoinedClassUser');
  this.subscribe('globalUsersBasicInfo');
  
  var self = this;
  self.autorun(function() {
      self.subscribe('userRelationships', Meteor.userId());  
  });

});