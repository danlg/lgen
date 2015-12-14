/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var loading = true;
/*****************************************************************************/
/* LoadingSpinner: Event Handlers */
/*****************************************************************************/
Template.LoadingSpinner.events({});

/*****************************************************************************/
/* LoadingSpinner: Helpers */
/*****************************************************************************/
Template.LoadingSpinner.helpers({});

/*****************************************************************************/
/* LoadingSpinner: Lifecycle Hooks */
/*****************************************************************************/
Template.LoadingSpinner.onCreated(function () {
  //IonLoading.show();
});

Template.LoadingSpinner.onRendered(function () {

});

Template.LoadingSpinner.onDestroyed(function () {
  // if(loading){
  //   IonLoading.hide();
  //   loading =false;
  // }
  //IonLoading.hide();
});
