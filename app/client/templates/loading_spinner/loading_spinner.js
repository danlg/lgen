var loading = true
/*****************************************************************************/
/* LoadingSpinner: Event Handlers */
/*****************************************************************************/
Template.LoadingSpinner.events({
});

/*****************************************************************************/
/* LoadingSpinner: Helpers */
/*****************************************************************************/
Template.LoadingSpinner.helpers({
});

/*****************************************************************************/
/* LoadingSpinner: Lifecycle Hooks */
/*****************************************************************************/
Template.LoadingSpinner.onCreated(function () {
  loading = true;
  Meteor.setTimeout(function(){
    if(loading){
      IonLoading.show({
        backdrop: true
      });
    }
  }, 100);
});

Template.LoadingSpinner.onRendered(function () {

});

Template.LoadingSpinner.onDestroyed(function () {
    loading =false;
    IonLoading.hide();
    

});
