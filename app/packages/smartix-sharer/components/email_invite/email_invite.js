/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var contactList = ReactiveVar("");
var contactsObj;
var searchText = ReactiveVar("");
var classObj;
var isInputAnEmail = ReactiveVar(false);
/*****************************************************************************/
/* EmailInvite: Event Handlers */
/*****************************************************************************/
Template.EmailInvite.events({
  'click .inviteBtn': function (e) {

    var classObj = Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    });


    var id = $(e.target).data("id");
    var targerObj = lodash.findByValues2(contactsObj, "id", id);
    var targetEmails = lodash.map(targerObj[0].emails, "value");
    var targetFirstEmail = targetEmails[0];


    Meteor.call( "classinvite", classObj, targetFirstEmail, function (err) {
                   
      toastr.success("Invite Success");

      if (Meteor.user().profile.firstinvitation) {
        analytics.track("First Invitation", {
          date: new Date(),
        });

        Meteor.call("updateProfileByPath", 'profile.firstinvitation', false);
      }

    });

  },
  'keyup .searchbar': function () {
    searchText.set($(".searchbar").val());
    
    var emailRegex = /.+@.+\..+/ ;
    if( emailRegex.test(searchText.get()) ){
        //display invite button
        isInputAnEmail.set(true);
    }else{
        isInputAnEmail.set(false);
    }
  },
  'click .inviteBtnWithEmail':function(){
    var classObj = Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    });
    var email = searchText.get();
    Meteor.call( "classinvite", classObj, email, function (err) {
      toastr.success("Invite Success");
      if (Meteor.user().profile.firstinvitation) {
        analytics.track("First Invitation", {
          date: new Date(),
        });
        Meteor.call("updateProfileByPath", 'profile.firstinvitation', false);
      }  
      
      searchText.set('');    
      $(".searchbar").val('');  
      isInputAnEmail.set(false);  
    });    
  }


});

/*****************************************************************************/
/* EmailInvite: Helpers */
/*****************************************************************************/
Template.EmailInvite.helpers({
  invited: function (argument) {
    if (!Meteor.user().profile['contactsIds']) {
      return "";
    }

    else {

      var contactsIds = Meteor.user().profile['contactsIds'];

      if (contactsIds.indexOf(this.id) > -1) {
        // return "hide";
        return "";
      } else {
        return "";
      }

    }

  },
  classObj: function () {
    return Smartix.Groups.Collection.findOne({
        type: 'class',
        classCode: Router.current().params.classCode
    });
  },
  inviteClassSchema: Smartix.Class.AutoformSchema.inviteClass,
  contactList: function () {
    return contactList.get();
  },
  getName: function (contactObj) {
    log.info(contactObj);
    if (contactObj.displayName !== null && contactObj.displayName !== "")
      return contactObj.displayName;
    else if (contactObj.nickname !== null && contactObj.nickname !== "")
      return contactObj.nickname;
    else if (contactObj.name.formatted !== null && contactObj.name.formatted !== "")
      return contactObj.name.formatted;
    else
      return lodash.map(contactObj.phoneNumbers, 'value')[0];
  },
  isSearched: function (contactObj) {
    var name = "";
    if (contactObj.displayName !== null)
      name = contactObj.displayName;
    else if (contactObj.nickname !== null)
      name = contactObj.nickname;
    else
      name = contactObj.name.formatted;

    var id = this.id;
    var targerObj = lodash.findByValues2(contactsObj, "id", id);
    var targetEmails = lodash.map(targerObj[0].emails, "value");
    var targetFirstEmail = targetEmails[0];


    return lodash.includes(name.toUpperCase(), searchText.get().toUpperCase()) || lodash.includes(targetFirstEmail.toUpperCase(), searchText.get().toUpperCase());
  },
  displayInviteButton : function(){
    if(isInputAnEmail.get()){
      return "showInviteBtn";
    }else{
      return "hideInviteBtn";      
    }
  }
});

/*****************************************************************************/
/* EmailInvite: Lifecycle Hooks */
/*****************************************************************************/
Template.EmailInvite.created = function () {
  contactList.set("");
  searchText.set("");
  if (Meteor.isCordova) {
    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    /*options.desiredFields = [navigator.contacts.fieldType.id];*/
    var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
    navigator.contacts.find(fields, onSuccess, onError, options);
  } else {
    contactList.set([]);
  }
};

Template.EmailInvite.rendered = function () {
};

Template.EmailInvite.destroyed = function () {
  contactList.set("");
  searchText.set("");
};

function onSuccess(contacts) {
  /*alert('Found ' + contacts.length + ' contacts.');*/

  contacts = lodash.filter(contacts, function (item) {
    return item.emails !== null;
  });

  contactsObj = contacts;


  contactList.set(contacts);
}

function onError(contactError) {
  toastr.error('onError!');
}
