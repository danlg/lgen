Template.AdminNewsView.onCreated(function () {
    var self = this;
    self.subscribe('smartix:messages/messagesById', Router.current().params.msgcode, function (error, res) {
        if(!error) {
            var messageObj = Smartix.Messages.Collection.findOne()
            self.subscribe('newsgroups', messageObj.groups);
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