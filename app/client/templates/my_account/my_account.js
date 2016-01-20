/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var similarOrganizations = ReactiveVar([]);
/*****************************************************************************/
/* MyAccount: Event Handlers */
/*****************************************************************************/
Template.MyAccount.events({
  
    'click #pick-an-icon-btn':function(){
      var parentDataContext= {iconListToGet:"iconListForYou",sessionToBeSet:"chosenIconForYou"};
      IonModal.open("YouIconChoose", parentDataContext);
    },
    'keyup #organization':function(e){
        var inputOrganization = e.target.value;
        log.info(e.target.value);
        if(inputOrganization == ""){
            similarOrganizations.set([]);              
        }else{
            Meteor.call("getSimilarOrganizations",inputOrganization,function(error,result){
                if(result){
                  similarOrganizations.set(result);  
                }
            });                
        }

        //Find School name from School Entity
        //School.find()({'schoolNames.schoolName': /^pa/})
        //db.users.find({name: /^pa/}) //like 'pa%' 
    },
    'click .suggestedOrganization' :function(e){
        log.info(e);
         var clickedSuggestOrganization = e.target.innerText;
         log.info("yep: " + clickedSuggestOrganization);
         
         document.getElementById("organization").value = clickedSuggestOrganization;
         similarOrganizations.set([]);  
         
    }

});

/*****************************************************************************/
/* MyAccount: Helpers */
/*****************************************************************************/
Template.MyAccount.helpers({
  current: function () {
    return Meteor.user();
  }
  , email: function () {
    //log.info(_.deep(Meteor.user(),'firstname'));
    return Meteor.user().emails[0].address;
  }
  , editprofile: Schema.editprofile
  , profile: function () {
    return Meteor.user().profile;
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
  }

  , getYouAvatar:function(){
    var chosenIcon = Session.get('chosenIconForYou');
    if(chosenIcon){
      return chosenIcon;
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
  }

});

/*****************************************************************************/
/* MyAccount: Lifecycle Hooks */
/*****************************************************************************/
Template.MyAccount.created = function () {
  
  if(Meteor.user() && Meteor.user().profile){
    if(Meteor.user().profile.useravatar){
      Session.set('chosenIconForYou', Meteor.user().profile.useravatar)
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
  }
});
