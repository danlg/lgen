var contactList = ReactiveVar("");
/*****************************************************************************/
/* EmailInvite: Event Handlers */
/*****************************************************************************/
Template.EmailInvite.events({
  'click .inviteBtn':function(){

    AutoForm.submitFormById("#inviteClassForm")
  }

});

/*****************************************************************************/
/* EmailInvite: Helpers */
/*****************************************************************************/
Template.EmailInvite.helpers({
  inviteClassSchema:Schema.inviteClass,
  contactList:function(){
      return contactList.get();
  }
});

/*****************************************************************************/
/* EmailInvite: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailInvite.created = function () {
  var options      = new ContactFindOptions();
  options.filter   = "";
  options.multiple = true;
  /*options.desiredFields = [navigator.contacts.fieldType.id];*/
  var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
  navigator.contacts.find(fields, onSuccess, onError, options);
};

Template.EmailInvite.rendered = function () {
};

Template.EmailInvite.destroyed = function () {
};

function onSuccess(contacts) {
    /*alert('Found ' + contacts.length + ' contacts.');*/

    
    contactList.set(contacts);
};

function onError(contactError) {
    alert('onError!');
};
