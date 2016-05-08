Template.AdminNewsgroupsView.onCreated(function () {
    var self = this;
    self.subscribe('smartix:newsgroups/newsgroupByUrl', Router.current().params.classCode, function (error, res) {
        if(!error) {
            var classData = Smartix.Groups.Collection.findOne({
                url: Router.current().params.classCode,
                type: 'newsgroup'
            });
            self.subscribe('smartix:messages/groupMessages', classData._id);
            self.subscribe('allSchoolUsers',classData.namespace);
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
                return Smartix.Messages.Collection.find({$or:[
                    {
                        group: classData._id,
                        deletedAt:""
                    },
                    {
                        group: classData._id,  
                        deletedAt: { $exists: false }                     
                    }
                ]});
            }
        }
    }
});

Template.AdminNewsgroupsView.events({
   'click .show-news-btn':function(event,template){
       var msgId = $(event.target).data('msgId');
       Meteor.call('smartix:news/showMessage',msgId); 
   },
   'click .hide-news-btn':function(event,template){
       var msgId = $(event.target).data('msgId');
       Meteor.call('smartix:news/hideMessage',msgId); 
   },   
   'click .remove-news-btn':function(event,template){
       var msgId = $(event.target).data('msgId');
       Meteor.call('smartix:news/deleteMessage',msgId);       
   },    
});