var weeks = [];
var workHourTime = {};

/*****************************************************************************/
/* Chatoption: Event Handlers */
/*****************************************************************************/
Template.Chatoption.events({
  'change input': function (argument) {
    var insertDocObj = AutoForm.getFormValues("chatOptionUpdate").insertDoc;
    Session.set("optionObj", insertDocObj);
  },

  'change .timeCb': function () {
    weeks = [];
    $('.timeCb:checked').each(function () {
      weeks.push($(this).val());
    });
    workHourTime.weeks = weeks;
    // Session.set('workHourTime', workHourTime );
    var optionObj = Session.get('optionObj');
    //find out why optionObj.workHourTime is undefined
    if (optionObj.workHourTime)
      optionObj.workHourTime.weeks = weeks;
    Session.set('optionObj', optionObj);
  },

  'change .from': function () {
    var optionObj = Session.get('optionObj');
    var from = $('.from').val();
    if (optionObj.workHourTime)
      optionObj.workHourTime.from = from;
    Session.set('optionObj', optionObj);
  },

  'change .to': function () {
    var optionObj = Session.get('optionObj');
    var to = $('.to').val();
    if (optionObj.workHourTime)
      optionObj.workHourTime.to = to;
    Session.set('optionObj', optionObj);
  }
});

/* Chatoption: Created Handlers */
Template.Chatoption.created = function () {
  Session.setDefault("optionObj", {});
  if (Meteor.user().profile.chatSetting) {
    var newOptionObj = lodash.assign(Meteor.user().profile.chatSetting, Session.get("optionObj"));
    Session.set("optionObj", newOptionObj);
  }
  //new code from work_time_selection.js
  var optionObj = Session.get('optionObj');
  if (Meteor.user()["profile.chatSetting.workHourTime"]) {
    optionObj.workHourTime = Meteor.user().profile.chatSetting.workHourTime;
    Session.set('optionObj', optionObj);
  }
  else if (!optionObj.workHourTime) {
    var workHourTime = {};
    workHourTime.from = "";
    workHourTime.to = "";
    workHourTime.weeks = [];
    optionObj.workHourTime = workHourTime;
    Session.set('optionObj', optionObj);
  }
  else if (optionObj.workHourTime){
    log.info("optionObj.workHourTime set");
  }
  else{
    log.warn("optionObj.workHourTime NO set");
  }
};

/* Chatoption: Helpers */
Template.Chatoption.helpers({
  chatSetting: Schema.chatSetting,
  /*??????? is chatSetting persisted? maybe it is due to the bug of optionObj.workHourTime not defined*/
  createdClassByMe: Classes.find(),

  optionObj: function (argument) {
    return Session.get('optionObj');
  },

  checked: function (week) {
    if (Session.get('optionObj').workHourTime) {
      var weeks = Session.get('optionObj').workHourTime.weeks;
      return lodash.includes(weeks, week) ? "checked" : "";
    }
    return "";
  },

  from: function (argument) {
    var from = Session.get('optionObj').workHourTime.from;
    if (from === "" || !from) {
      var optionObj = Session.get('optionObj');
      from = moment().format("09:00");
      optionObj.workHourTime.from = from;
      Session.set('optionObj', optionObj);
    }
    return from;
  },

  to: function (argument) {
    var to = Session.get('optionObj').workHourTime.to;
    if (to === "" || !to) {
      var optionObj = Session.get('optionObj');
      to = moment().format("17:00");
      optionObj.workHourTime.to = to;
      Session.set('optionObj', optionObj);
    }
    return to;
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
    if (weeks.length < 1) {
      return "";
    } else {
      var weeksName = lodash.map(weeks, getWeekName);
      return lodash(weeksName).toString();
    }
  }
});

/*****************************************************************************/
/* Chatoption: Lifecycle Hooks */
/*****************************************************************************/


Template.Chatoption.rendered = function () {
};

Template.Chatoption.destroyed = function () {

};

Template.ionNavBar.events({
  'click .ChatoptionSave': function (e, template) {

  },

  'click .ChatoptionCancel': function (argument) {
    var doc = Session.get("optionObj");
    if (lodash.get(doc, "workHour")) {
      var allWork = lodash.get(doc, "workHour") &&
        lodash.get(doc, "workHourTime.from") &&
        lodash.get(doc, "workHourTime.to") &&
        lodash.get(doc, "workHourTime.weeks") &&
        lodash.get(doc, "workHourTime.weeks").length > 0;

      log.info(allWork);
      if (allWork) {
        AutoForm.submitFormById("#chatOptionUpdate");
      }
      else {
        Session.set("optionObj", {});
        window.history.back();
      }
    } else {
      Session.set("optionObj", {});
      AutoForm.submitFormById("#chatOptionUpdate");
    }

  }
});


function getWeekName(week) {
  var weekday = new Array(8);
  weekday[0] = "Monday";
  weekday[1] = "Mon";
  weekday[2] = "Tue";
  weekday[3] = "Wed";
  weekday[4] = "Thu";
  weekday[5] = "Fri";
  weekday[6] = "Sat";
  weekday[7] = "Sun";
  
  log.info("Today is " + weekday[week]);
  return weekday[week];
}
