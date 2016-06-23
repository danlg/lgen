Template.AdminNewsgroupsView.onCreated(function () {
    var self = this;
    this.subscribe('smartix:newsgroups/newsgroupByUrl', Router.current().params.classCode, function (error, res) {
        if(!error) {
            var classData = Smartix.Groups.Collection.findOne({
                url: Router.current().params.classCode,
                type: 'newsgroup'
            });
            self.subscribe('smartix:messages/groupMessages', classData._id);
            self.subscribe('allSchoolUsers',classData.namespace);
        }
    });
    this.subscribe('smartix:distribution-lists/listsBySchoolName',  UI._globalHelpers['getCurrentSchoolName']());
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
                ]}, { //news most recent on the top
                    sort: {createdAt: -1},
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
        return (distributionLists.indexOf(this._id) !== -1 ) ? true : false
    }    
});

Template.AdminNewsgroupsView.events({
   'click .show-news-btn':function(event,template){
       var msgId = $(event.target).data('msgId');
       Meteor.call('smartix:news/showMessage',msgId,function(){
           toastr.info('The news is shown to user again');
       }); 
   },
   'click .hide-news-btn':function(event,template){
       var msgId = $(event.target).data('msgId');
       Meteor.call('smartix:news/hideMessage',msgId,function(){
           toastr.info('The news is hidden from user');
       }); 
   },   
   'click .remove-news-btn':function(event,template){
       var msgId = $(event.target).data('msgId');
       Meteor.call('smartix:news/deleteMessage',msgId,function(){
           toastr.info('The news has been removed');
       });       
   }, 
   'click .delete-newsgroup':function(event,template){

    if (window.confirm("Do you really want to delete this newsgroup?")) { 
       var groupId = $(event.target).data('newsgroupId');
       //log.info('deleteNewsgroup',groupId);
       Meteor.call('smartix:newsgroups/deleteNewsgroup',groupId,function(){
           toastr.info('This newsgroup has been removed');
       });    
    }            
   }, 
   'click .remove-distribution-list-from-group':function(event,template){
       var groupId = $(event.target).data('newsgroupId');
       var distributionListId = $(event.target).val();
       var distributionListName = $(event.target).data('distributionListName');
       Meteor.call('smartix:newsgroups/removeDistributionListToGroup', groupId, distributionListId,function(){
           toastr.info('Distribution List ' + distributionListName + ' has been removed from current group'); 
       });
   },
   'click .add-distribution-list-to-group':function(event,template){
       var groupId = $(event.target).data('newsgroupId');
       var distributionListId = $(event.target).val();
       var distributionListName = $(event.target).data('distributionListName');       
       Meteor.call('smartix:newsgroups/addDistributionListToGroup', groupId, distributionListId,function(){
           toastr.info('Distribution List ' + distributionListName + ' has been added to current group');            
       });       
   },   
});