/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var similarOrganizations = ReactiveVar([]);
var similarCities = ReactiveVar([]);

Schema = Schema || {};

/**  obsolete. use the one from account package instead **/
/*Schema.editprofile = new SimpleSchema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    organization: { type: String, optional: true },
    city: { type: String, optional: true },
    country: { type: String, optional: true },
    //location not used ?
    //location:     { type: String, optional: true },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    avatarValue: {
        type: String,
        optional: true
    }
});*/

/*****************************************************************************/
/* MyAccount: Event Handlers */
/*****************************************************************************/
Template.MyAccount.events({
  
    'change #attachment': function(event, tmp) {
        event.preventDefault();
        var input = tmp.find('#attachment');
        var imageUpload = input.files[0];
        var reader  = new FileReader();
        if(imageUpload.type == "image/jpeg")
        {
                reader.onload = tmp;
                reader.readAsDataURL(imageUpload);
                reader.onloadend = function () {
                    var parentDataContext = {uploadedImage: reader, sessionToBeSet:"uploadIcon"};
                    IonModal.open("UploadIcon", parentDataContext);
                }
        }
    },
    'click #pick-an-icon-btn':function(){
      var parentDataContext= {iconListToGet:"iconListForYou",sessionToBeSet:"chosenIconForYou"};
      IonModal.open("YouIconChoose", parentDataContext);
    },
    'keyup #organization':function(e){
        var inputOrganization = e.target.value;
        //log.info(e.target.value);
        if(inputOrganization == ""){
            similarOrganizations.set([]);              
        }else{
            Meteor.call("getSimilarOrganizations",inputOrganization,function(error,result){
                if(result){
                  similarOrganizations.set(lodash.uniq(result));  
                }
            });                
        }

        //Find School name from School Entity
        //School.find()({'schoolNames.schoolName': /^pa/})
        //db.users.find({name: /^pa/}) //like 'pa%' 
    },
    'click .suggestedOrganization' :function(e){
         var clickedSuggestOrganization =   $(e.target).text().trim();
         //var clickedSuggestOrganization = e.target.innerText;    
              
         document.getElementById("organization").value = clickedSuggestOrganization;
         similarOrganizations.set([]);  
         
    },
    'keyup #city':function(e){
        var inputCity = e.target.value;
        log.info(e.target.value);
        if(inputCity == ""){
            similarCities.set([]);              
        }else{
            Meteor.call("getSimilarCities",inputCity,function(error,result){
                if(result){
                  similarCities.set(lodash.uniq(result));  
                }
            });                
        }
    },
    'click .suggestedCities' :function(e){
         var clickedSuggestCities =   $(e.target).text().trim();
                 
         document.getElementById("city").value = clickedSuggestCities;
         similarCities.set([]);  
         
    }

});

/*****************************************************************************/
/* MyAccount: Helpers */
/*****************************************************************************/
Template.MyAccount.helpers({
  fromRegisterFlow:function(){
    return Session.get('registerFlow');  
  },
  current: function () {
    return Meteor.user();
  }
  , email: function () {
    return ( Meteor.user() && Meteor.user().emails) ? Meteor.user().emails[0].address : "";
  }
  , editprofile: Smartix.Accounts.editUserSchema
  , currentUserObj: function () {
    return Meteor.user();
  }
  , getFirstNamePlaceHolder: function(){
    return TAPi18n.__("FirstNamePlaceHolder");
  }
  , getLastNamePlaceHolder: function(){
    return TAPi18n.__("LastNamePlaceHolder");
  }
  , getOrganizationPlaceHolder: function(){
    return TAPi18n.__("OrganizationPlaceHolder");
  }
  , getCityPlaceHolder: function(){
    return TAPi18n.__("CityPlaceHolder");
  }
  , getEmailPlaceHolder: function(){
    return TAPi18n.__("EmailPlaceHolder");
  },
    getYouUpload:function(){
        var uploadIcon = Session.get('uploadIcon');
        if(uploadIcon){
            return uploadIcon;
        }
    }
  , getYouAvatar:function(){
    
    if(Session.get('chosenIconForYou')){
        var chosenIcon = Session.get('chosenIconForYou');
        if(chosenIcon){
        return chosenIcon;
        }           
    }
    else if(Meteor.user().profile.avatarValue){
        return Meteor.user().profile.avatarValue;
    }

  }, countriesWithValueOnly:function(){
      var countriesObj = CountryCodes.getList();
      var optionsCountries = [];
      lodash.forOwn(countriesObj,function(countryName,countryCode){
          
        optionsCountries.push({label:countryName,value:countryCode});         
      });
     return optionsCountries;
  },getSimilarOrganizations:function(){
      return similarOrganizations.get();
  },getSimilarCities:function(){
      return similarCities.get();
  },
  userRoles: function () {
      return Roles.getRolesForUser(Meteor.userId(), Session.get('pickedSchoolId'));
  },
  getCurrentCountry:function(){
      var countriesObj = CountryCodes.getList();
      //log.info(countriesObj);
      var userCountry = Meteor.user().country;
      if(userCountry){
        // lodash.find(countriesObj,{})
        return countriesObj[userCountry];
      }else{
        return 'Country'
      }
  }

});

/*****************************************************************************/
/* MyAccount: Lifecycle Hooks */
/*****************************************************************************/
Template.MyAccount.created = function () {
  
  if(Meteor.user() && Meteor.user().profile){
    if(Meteor.user().profile.avatarValue){
      Session.set('uploadIcon', Meteor.user().profile.avatarValue)
    }   
  } 
};

Template.MyAccount.rendered = function () {

};

Template.MyAccount.destroyed = function () {
  delete Session.keys['chosenIconForYou'];
};

Template.ionNavBar.events({
  'click .editAccountBtn': function () { 
    AutoForm.submitFormById("#editprofile");
  },

  'click .skip-account-btn': function () {
    Session.set('registerFlow',false);
    //invite user to download the app if they are using web version
    if (!Meteor.isCordova) {
        if (Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.TEACHER) ||
            Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.PARENT) ||
            Roles.userIsInRole(Meteor.userId(),'user')
           ) {
            log.info("redirect to how to invite");
            Router.go('HowToInvite');
        } else {
            //todo congratulate
            //popup to download app
            Smartix.helpers.routeToTabClasses();
        }
    }
    else {
        Smartix.helpers.routeToTabClasses();
    }
  },

  'click .finish-account-btn': function () {  
    AutoForm.submitFormById("#editprofile");
 
    Session.set('registerFlow',false);
    //invite user to download the app if they are using web version
    if (!Meteor.isCordova) {
   
        if (Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.TEACHER) ||
            Roles.userIsInRole(Meteor.userId(), Smartix.Accounts.School.PARENT) ||
            Roles.userIsInRole(Meteor.userId(),'user')
           ) {
            log.info("redirect to how to invite");
            Router.go('HowToInvite');
        } else {
            //todo congratulate
            //popup to download app
            Smartix.helpers.routeToTabClasses();
        }
    }
    else {
        Smartix.helpers.routeToTabClasses();
    }   
  }  
});
