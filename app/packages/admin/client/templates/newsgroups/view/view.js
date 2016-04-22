Template.AdminNewsgroupsView.onCreated(function () {
    var self = this;
    self.subscribe('smartix:newsgroups/newsgroupByUrl', Router.current().params.classCode, function (error, res) {
        if(!error) {
            var classData = Smartix.Groups.Collection.findOne({
                url: Router.current().params.classCode,
                type: 'newsgroup'
            });
            self.subscribe('smartix:messages/groupMessages', classData._id);
        }
    });
});

Template.AdminNewsgroupsView.helpers({
    classData: function () {
        if(Template.instance().subscriptionsReady()) {
            return Smartix.Groups.Collection.findOne({
                url: Router.current().params.classCode,
                type: 'newsgroup'
            });
        }
    },
    userData: function (data) {
        if(Template.instance().subscriptionsReady()) {
            return Meteor.users.findOne({
                _id: data
            });
        }
    },
    news: function () {
        if(Template.instance().subscriptionsReady()) {
            var classData = Smartix.Groups.Collection.findOne({
                url: Router.current().params.classCode,
                type: 'newsgroup'
            });
            if(classData) {
                return Smartix.Messages.Collection.find({
                    group: classData._id
                });
            }
        }
    }
});