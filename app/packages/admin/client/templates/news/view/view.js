Template.AdminNewsView.onCreated(function () {
    var self = this;
    self.subscribe('smartix:messages/messagesById', Router.current().params.msgcode, function (error, res) {
        if(!error) {
            var messageObj = Smartix.Messages.Collection.findOne()
            let groups = messageObj.groups || [messageObj.group];
            self.subscribe('newsgroups', groups);
        }
    });
});

Template.AdminNewsView.helpers({
    newsData: function () {
        return Smartix.Messages.Collection.findOne();
    },
    groupInfo: function (groupId) {
      return Smartix.Groups.Collection.findOne({
                _id: groupId,
                type: 'newsgroup'
            });
    },
   routeData: function(){
    return {
        school:  UI._globalHelpers['getCurrentSchoolId'](),
        code: this.url
    }
   }
});


Template.AdminNewsView.events({
    'click .show-news-btn':function(event,template){
        var msgId = Router.current().params.msgcode;
        Meteor.call('smartix:news/showMessage',msgId,function(){
            toastr.info(TAPi18n.__("Admin.NewsShownAgain"));
        });
    },

    'click .hide-news-btn':function(event,template){
        var msgId = Router.current().params.msgcode;
        Meteor.call('smartix:news/hideMessage',msgId,function(){
            toastr.info(TAPi18n.__("Admin.NewsHiddenFromUser"));
        });
    },

    'click .remove-news-btn':function(event,template){
        var msgId = Router.current().params.msgcode;
        Meteor.call('smartix:news/deleteMessage',msgId,function(){
            toastr.info(TAPi18n.__("Admin.NewsRemoved"));
            Router.go('admin.news.search', {school: UI._globalHelpers['getCurrentSchoolName']()})
        });
    }
})