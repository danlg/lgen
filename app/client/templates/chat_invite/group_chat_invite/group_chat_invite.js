/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */

var targetStringVar = ReactiveVar([]);
var targetString = [];
var targetIds = ReactiveVar([]);
var searchString = ReactiveVar("");
/*****************************************************************************/
/* ChatInvite: Event Handlers */
/*****************************************************************************/
Template.GroupChatInvite.events({
  'click .classItem':function(){
    
    log.info(this);
    Router.go('GroupChatInviteChooser',{classCode:this.classCode});
    
  },
  'click .startChatBtn': function () {
    /*var chatArr =  $('.js-example-basic-multiple').val();*/
    /*
      Meteor.call('chatCreate', targetIds.get(), function (err, data) {
      Router.go('ChatRoom', {chatRoomId: data});
    });*/
    
    /*log.info($('.js-example-basic-multiple').val());*/
  },

  'change .targetCB': function (e) {
    targetString = [];
    targetIds.set([]);
    var localarr = [];
    // $(".targetCB:checked").each(function(index,el){
    // localarr.push($(el).val());
    // targetString.push($(el).data("fullname"));
    // });
    // $(e.target).attr('checked','checked');
    localarr.push($(e.target).val());
    targetString.push($(e.target).data("className"));
    targetStringVar.set(targetString);
    targetIds.set(localarr);
  },

  'keyup .searchbar': function () {
    searchString.set($(".searchbar").val().trim());
  }
});

Template.GroupChatInvite.helpers({
  'myclasses': function () {
    return Classes.find({
        createBy: Meteor.userId()
    });
  },
  isSearchable: function () {
    //log.info("className:"+this.className+":searchString:"+searchString.get());
    //log.info("isSearchable:"+lodash.includes(this.className.toUpperCase(), searchString.get().toUpperCase()));
    return lodash.includes(this.className.toUpperCase(), searchString.get().toUpperCase());
  },
  shouldhide: function () {
    log.info("shouldhide:"+targetIds.get());
    return targetIds.get().length > 0 ? "" : "hide";
  },
});