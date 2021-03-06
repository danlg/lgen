Template.AdminNewsgroupsView.onCreated(function () {
    var self = this;
    this.subscribe('smartix:newsgroups/newsgroupByUrl', Router.current().params.code, function (error, res) {
        if(!error) {
            var newsgroupData = Smartix.Groups.Collection.findOne({
                url: Router.current().params.code,
                type: 'newsgroup'
            });
            self.subscribe('smartix:messages/groupMessages', newsgroupData._id);
            self.subscribe('allSchoolUsers', newsgroupData.namespace);
        }
    });
    this.subscribe('smartix:distribution-lists/listsBySchoolId',  UI._globalHelpers['getCurrentSchoolId']());
});

Template.AdminNewsgroupsView.helpers({
    classData: function () {
        if(Template.instance().subscriptionsReady()) {
            return Smartix.Groups.Collection.findOne({
                url: Router.current().params.code,
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
                url: Router.current().params.code,
                type: 'newsgroup'
            });
            if(classData) {
                return Smartix.Messages.Collection.find({$or:[
                    {
                        $or: [
                            {group: classData._id},
                            {groups: classData._id}
                        ],
                        deletedAt:""
                    },
                    {
                        $or: [
                            {group: classData._id},
                            {groups: classData._id}
                        ],
                        deletedAt: { $exists: false }
                    }
                ]}, { //news most recent on the top
                    sort: {createdAt: -1}
                });
            }
        }
    },
    getAllDistributionList: function () {
        return Smartix.Groups.Collection.find({
            type: "distributionList"
        });
    },
    distributionListInCurrentGroup:function(distributionLists){
        return (distributionLists.indexOf(this._id) !== -1 ) ;
    }
});

Template.AdminNewsgroupsView.events({
    'click .show-news-btn':function(event,template){
        var msgId = $(event.target).data('msgId');
        Meteor.call('smartix:news/showMessage',msgId,function(){
            toastr.info(TAPi18n.__("Admin.NewsShownAgain"));
        });
    },

    'click .hide-news-btn':function(event,template){
        var msgId = $(event.target).data('msgId');
        Meteor.call('smartix:news/hideMessage',msgId,function(){
            toastr.info(TAPi18n.__("Admin.NewsHiddenFromUser"));
        });
    },

    'click .remove-news-btn':function(event,template){
        var msgId = $(event.target).data('msgId');
        Meteor.call('smartix:news/deleteMessage',msgId,function(){
            toastr.info(TAPi18n.__("Admin.NewsRemoved"));
        });
    },

    'click .delete-newsgroup':function(event,template){
        if (window.confirm("Do you really want to delete this newsgroup?")) {
            var groupId = $(event.target).data('newsgroupId');
            //log.info('deleteNewsgroup',groupId);
            Meteor.call('smartix:newsgroups/deleteNewsgroup',groupId,function(){
                toastr.info(TAPi18n.__("Admin.NewsgroupRemoved"));
            });
        }
    },

    'click .remove-distribution-list-from-group':function(event,template){
        var groupId = $(event.target).data('newsgroupId');
        var distributionListId = $(event.target).val();
        var distributionListName = $(event.target).data('distributionListName');
        //log.info("remove-distribution-list-to-group", groupId, distributionListId);
        Meteor.call('smartix:newsgroups/removeDistributionListToGroup', groupId, distributionListId,function(){
            toastr.info(TAPi18n.__("Admin.DistributionList") + ' ' + distributionListName + TAPi18n.__("Admin.RemovedFromCurrentGroup"));
        });
    },

    'click .add-distribution-list-to-group':function(event,template){
        var groupId = $(event.target).data('newsgroupId');
        var distributionListId = $(event.target).val();
        var distributionListName = $(event.target).data('distributionListName');
        //log.info("add-distribution-list-to-group", groupId, distributionListId);
        Meteor.call('smartix:newsgroups/addDistributionListToGroup', groupId, distributionListId,function(){
            toastr.info(TAPi18n.__("Admin.DistributionList") + ' ' + distributionListName + TAPi18n.__("Admin.AddedToCurrentGroup"));
        });
    }
});