
/*****************************************************************************/
/* Chatoption: Event Handlers */
/*****************************************************************************/
Template.Chatoption.events({
  'change input':function (argument) {
    var insertDocObj = AutoForm.getFormValues("chatOptionUpdate").insertDoc;
    Session.set("optionObj", insertDocObj );
  }
});

/*****************************************************************************/
/* Chatoption: Helpers */
/*****************************************************************************/
Template.Chatoption.helpers({
  chatSetting:Schema.chatSetting,
  createdClassByMe:Classes.find(),
  optionObj:function (argument) {
    return Session.get('optionObj');
  },
  ishide:function (argument) {
    return Session.get('optionObj').workHour?"":"shouldhide";
  },
  getTimeRange:function (argument) {
    var from = lodash.get(Session.get('optionObj'),"workHourTime.from") || "";
    var to = lodash.get(Session.get('optionObj'),"workHourTime.to") || "";
    if(from===""&& to===""){
      return "";
    }else{
      return from + " -> " + to;
    }
  },
  getWeeks:function (argument) {
    var weeks = lodash.get(Session.get('optionObj'),"workHourTime.weeks") || [] ;
    if(weeks.length<1){
      return "";
    }else{
      var weeksName = lodash.map(weeks,getWeekName);
        return lodash(weeksName).toString();
    }

  }
});

/*****************************************************************************/
/* Chatoption: Lifecycle Hooks */
/*****************************************************************************/
Template.Chatoption.created = function () {

    Session.setDefault("optionObj",{});
    if(Meteor.user().profile.chatSetting){
      var newOptionObj = lodash.assign(Meteor.user().profile.chatSetting,Session.get("optionObj"));
      Session.set("optionObj", newOptionObj);
    }
};

Template.Chatoption.rendered = function () {
};

Template.Chatoption.destroyed = function () {

};

Template.ionNavBar.events({
  'click .ChatoptionSave':function(e,template){

  },
  'click .ChatoptionCancel':function (argument) {

    var doc = Session.get("optionObj");

    if(doc.workHour){
      var workHourTime = doc.workHourTime;
      if(!(workHourTime.from!=="" &&
      workHourTime.to!=="" &&
      workHourTime.weeks.length>0)){
        doc={};
        Session.set("optionObj",doc);
      }
    }

    AutoForm.submitFormById("#chatOptionUpdate");

  }
});


function getWeekName(week) {
  var weekday=new Array(8);
    weekday[0]="Monday";
    weekday[1]="Mon";
    weekday[2]="Tue";
    weekday[3]="Wed";
    weekday[4]="Thu";
    weekday[5]="Fri";
    weekday[6]="Sat";
    weekday[7]="Sun";
    // console.log("Today is " + weekday[week]);
    return weekday[week];
}
