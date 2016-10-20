/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
var searchText = ReactiveVar("");
var selectArrName = [];
var selectArrId = [];
/*****************************************************************************/
/* MessageClassSelection: Event Handlers */
/*****************************************************************************/
Template.MessageClassSelection.events({
  'keyup .searchText': function () {
    searchText.set($(".searchText").val());
  },
  'change .targetCB': function () {
    selectArrName = [];
    selectArrId = [];
    $(".targetCB:checked").each(function (index, el) {
      selectArrName.push($(el).attr("data-className"));
      selectArrId.push($(el).val());
    });
  },
  'click .bar': function () {

    Session.set("sendMessageSelectedClasses", {selectArrName: selectArrName, selectArrId: selectArrId});
    selectArrId = [];
    selectArrName = [];
    Router.go("SendMessage");
  }
});

/* MessageClassSelection: Helpers */
Template.MessageClassSelection.helpers({
  createdClasses: function () {
    return Smartix.Groups.Collection.find({
        type: 'class'
    });
  },
  searchresult: function (className) {
    return lodash.includes(className, searchText.get()) ? "" : "hide"
  },
  selected: function (classCode) {
    return lodash.includes(Session.get('sendMessageSelectedClasses').selectArrId, classCode) ? "checked" : "";
  }
});

/* MessageClassSelection: Lifecycle Hooks */
Template.MessageClassSelection.onCreated( function() {
  this.subscribe('createdClassByMe');
});

Template.MessageClassSelection.onRendered( function() {
});

Template.MessageClassSelection.destroyed = function () {
};
