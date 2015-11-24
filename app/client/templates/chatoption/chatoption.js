var weeks = [];
var workHourTime = {};

/*****************************************************************************/
/* Chatoption: Event Handlers */
/*****************************************************************************/
Template.Chatoption.events({
  'change input': function (argument) {
    var insertDocObj = AutoForm.getFormValues("chatOptionUpdate").insertDoc;
    Session.set("optionObj", insertDocObj);
    
  }
});

/* Chatoption: Created Handlers */
Template.Chatoption.created = function () {


};

/* Chatoption: Helpers */
Template.Chatoption.helpers({
  chatSetting: Schema.chatSetting,
  /*??????? is chatSetting persisted? maybe it is due to the bug of optionObj.workHourTime not defined*/
  createdClassByMe: Classes.find(),

  optionObj: function (argument) {
    log.info(Session.get('optionObj'));
    return Session.get('optionObj');
  },

  checked: function (week) {
    if (Session.get('optionObj').workHourTime) {
      var weeks = Session.get('optionObj').workHourTime.weeks;
      return lodash.includes(weeks, week) ? "checked" : "";
    }
    return "";
  },

  ishidden: function (argument) {
    return Session.get('optionObj').workHour ? "" : "shouldhide";
  },

  getTimeRange: function (argument) {
    var from = lodash.get(Session.get('optionObj'), "workHourTime.from") || "";
    var to = lodash.get(Session.get('optionObj'), "workHourTime.to") || "";
    if (from === "" && to === "") {
      return "";
    } else {
      return from + " -> " + to;
    }
  },

  getWeeks: function (argument) {
    var weeks = lodash.get(Session.get('optionObj'), "workHourTime.weeks") || [];
    log.info(weeks);
    
    if (weeks.length < 1) {
      return "";
    } else {
      var weeksName = lodash.mapKeys(weeks, getWeekName);
      log.info(weeksName);
      var weeksNameFilter = lodash.pick(weeksName, lodash.identity);
      log.info(weeksNameFilter);
      return lodash.keys(weeksNameFilter).toString();
    }
  }
});

/*****************************************************************************/
/* Chatoption: Lifecycle Hooks */
/*****************************************************************************/
Template.Chatoption.rendered = function () {

  //hack possibly implement with a callback called when Meteor.user() is ready 
  //http://stackoverflow.com/questions/14847575/meteor-user-profile-can-only-read-after-refresh?rq=1
  Meteor.autorun(function(handle) {
    if (Meteor.user()) {
      if (Meteor.user().profile) {
        optionObjSetup();
        handle.stop()
      }
      else {
        setTimeout(function(){
          if (!Meteor.user().profile) {
  
          }
        }, 300)
      }
    }
  })  

};

Template.Chatoption.destroyed = function () {

};

Template.ionNavBar.events({
  'click .ChatoptionSave': function (e, template) {
    AutoForm.submitFormById("#chatOptionUpdate");
  }
});


function getWeekName(value,key) {
  
  //log.info(value);
  //log.info(key);  
  var weekday = new Array(8);
  weekday[0] = "Monday";
  weekday[1] = "Mon";
  weekday[2] = "Tue";
  weekday[3] = "Wed";
  weekday[4] = "Thu";
  weekday[5] = "Fri";
  weekday[6] = "Sat";
  weekday[7] = "Sun";
  
  if(key == "mon"){
   return weekday[1];   
  }else if(key == "tue"){
   return weekday[2];       
  }else if(key == "wed"){
   return weekday[3];       
  }else if(key == "thu"){
   return weekday[4];       
  }else if(key == "fri"){
   return weekday[5];       
  }  
  else if(key == "sat"){
   return weekday[6];       
  }else{
    return weekday[7];      
  }
  

}


var optionObjSetup = function(){
  
    //clean up optionObj session 
  Session.set("optionObj", {});
  
  //if user has set chatsetting before, retrieve it and set it to session
  if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.chatSetting) {
    var newOptionObj = lodash.assign(Meteor.user().profile.chatSetting, Session.get("optionObj"));
    Session.set("optionObj", newOptionObj);
  }
  
  //get the latest session
  var optionObj = Session.get('optionObj');
  log.info(optionObj);
  
  //append workHourTime setting to the session if user has set it before
  if (Meteor.user() && Meteor.user()["profile.chatSetting.workHourTime"]) {
    optionObj.workHourTime = Meteor.user().profile.chatSetting.workHourTime;
    Session.set('optionObj', optionObj);
  }
  else if (!optionObj.workHourTime) { //else, define default value to the user via the session
    var workHourTime = {};
    workHourTime.from = "08:00";
    workHourTime.to = "18:00";
    workHourTime.weeks = {
      mon:true,
      tue:true,
      wed:true,
      thu:true,
      fri:true,
      sat:false,
      sun:false
    };
    optionObj.workHourTime = workHourTime;
    Session.set('optionObj', optionObj);
   
  }
  else if (optionObj.workHourTime){
    log.info("optionObj.workHourTime set");
  }
  else{
    log.warn("optionObj.workHourTime NO set");
  }     
}