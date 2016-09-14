/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var similarOrganizations = ReactiveVar([]);
var similarCities = ReactiveVar([]);
Schema = Schema || {};


Template.MyAccount.onCreated( function() {
});

Template.MyAccount.onRendered( function() {
});

Template.MyAccount.destroyed = function () {
    //Form submits when user clicks on Back to Update
    AutoForm.submitFormById("#editprofile");
    Session.set('chosenIconForYou', null);
    Session.set('avatarType', null);
};

Template.MyAccount.events({

    'click #pick-an-icon-btn':function(){
        var parentDataContext= {iconListToGet:"iconListForYou", avatarType:"avatarType", imageSmall:"chosenIconForYou", imageLarge:"uploadLarge"};
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

Template.MyAccount.helpers({
    fromRegisterFlow:function(){
        return Session.get('registerFlow');
    },

    current: function () {
        return Meteor.user();
    },

    email: function () {
        return ( Meteor.user() && Meteor.user().emails) ? Meteor.user().emails[0].address : "";
    },

    editprofile: Smartix.Accounts.editUserSchema,

    currentUserObj: function () {
        return Meteor.user();
    },

    getFirstNamePlaceHolder: function(){
        return TAPi18n.__("FirstNamePlaceHolder");
    },

    getLastNamePlaceHolder: function(){
        return TAPi18n.__("LastNamePlaceHolder");
    },

    getOrganizationPlaceHolder: function(){
        return TAPi18n.__("OrganizationPlaceHolder");
    },

    getCityPlaceHolder: function(){
        return TAPi18n.__("CityPlaceHolder");
    },

    getEmailPlaceHolder: function(){
        return TAPi18n.__("EmailPlaceHolder");
    },

    selectCountryHelper: function(){
        return TAPi18n.__("SelectCountry");
    },

    isEmoji: function(){
        if(Session.get('avatarType')){
            var avatarType = Session.get('avatarType');
            return (avatarType === "emoji") ;
        }
        else if(Meteor.user().profile.avatarType){
            return (Meteor.user().profile.avatarType === "emoji") ;
        }
        else return true;
    },

    getAvatarType:function(){
        if(Session.get('avatarType')){
            var avatarType = Session.get('avatarType');
            if(avatarType){
                return avatarType;
            }
        }
        else if(Meteor.user().profile.avatarValue){
            return Meteor.user().profile.avatarType;
        }
    },

    getYouAvatar:function() {
        if(Session.get('chosenIconForYou')){
            var chosenIcon = Session.get('chosenIconForYou');
            if(chosenIcon){
                return chosenIcon;
            }
        }
        else if(Meteor.user().profile.avatarValue){
            return Meteor.user().profile.avatarValue;
        }
    },

    getAvatarLarge:function() {
        var avatarLarge = Session.get('uploadLarge');
        if(avatarLarge) {
            return avatarLarge;
        }
    },

    countriesWithValueOnly:function(){
        var countriesObj = CountryCodes.getList();
        var optionsCountries = [];
        lodash.forOwn(countriesObj,function(countryName,countryCode) {
            optionsCountries.push({label:countryName,value:countryCode});
        });
        return optionsCountries;
    },

    getSimilarOrganizations:function(){
        return similarOrganizations.get();
    },

    getSimilarCities:function(){
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
        }
        else{
            return TAPi18n.__("Country");
        }
    }
});

Template.ionNavBar.events({
//   'click .editAccountBtn': function () { 
//     AutoForm.submitFormById("#editprofile");
//   },

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
