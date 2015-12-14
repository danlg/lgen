/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
/*****************************************************************************/
/* Image: Event Handlers */
/*****************************************************************************/
Template.Image.events({});

/*****************************************************************************/
/* Image: Helpers */
/*****************************************************************************/
Template.Image.helpers({
  img: function () {
    return this.img;
  }
});

/*****************************************************************************/
/* Image: Lifecycle Hooks */
/*****************************************************************************/
Template.Image.onCreated(function () {
  this.img = this.data.img || null;
});

Template.Image.onRendered(function () {
});

Template.Image.onDestroyed(function () {
});
