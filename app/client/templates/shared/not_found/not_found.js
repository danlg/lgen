/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
Template.NotFound.events({
  'click .homeBtn': function () {

     
      Router.go('TabClasses');
      window.location.reload();
  }
});