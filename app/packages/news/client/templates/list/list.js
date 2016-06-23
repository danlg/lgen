Template.NewsgroupsNewsList.onCreated(function(){
   var self = this;
   var schoolName = UI._globalHelpers['getCurrentSchoolName']();
    if(schoolName)
    {
        self.autorun(function(){
            self.subscribe('newsgroupsForUser',null,null,schoolName);
            self.subscribe('newsForUser',null,null,schoolName);  
        });  
    }
});

Template.NewsgroupsNewsList.helpers({
    getNews:function(){
        // var newsgroupsIds = [];
        // var newsgroupsByUserArray =  Smartix.Groups.Collection.find({ type: 'newsgroup', users: Meteor.userId() }).fetch(); 
        // var newsgroupsByUserArrayIds = lodash.map(newsgroupsByUserArray,'_id');
        // var distributionListsUserBelong = Smartix.Groups.Collection.find({type: 'distributionList', users: Meteor.userId() }).fetch();
        // var distributionListsUserBelongIds = lodash.map(distributionListsUserBelong,'_id');
        // //log.info('distributionListsUserBelongIds',distributionListsUserBelongIds);
        // var newsgroupsBydistributionLists =  Smartix.Groups.Collection.find({ type: 'newsgroup', distributionLists: {$in : distributionListsUserBelongIds } , optOutUsersFromDistributionLists :{  $nin : [Meteor.userId()] } }).fetch();      
        // var newsgroupsBydistributionListsIds = lodash.map(newsgroupsBydistributionLists,'_id');
        // //log.info('newsgroupsBydistributionListsIds',newsgroupsBydistributionListsIds);
        // newsgroupsIds = newsgroupsIds.concat(newsgroupsByUserArrayIds,newsgroupsBydistributionListsIds);
        // //log.info('newsgroupsIds',newsgroupsIds);
        // return Smartix.Messages.Collection.find(
        //     {$or:[
        //     {
        //         group: { $in: newsgroupsIds },
        //         hidden : false,
        //         deletedAt:""
        //     },
        //     {
        //         group: { $in: newsgroupsIds },
        //         hidden: false,
        //         deletedAt: { $exists: false }                     
        //     }
        // ]},
        // {sort: {createdAt: -1 } }
        // );
        return Smartix.Messages.Collection.find();          
    },
    getGroupName:function(groupId){
        //log.info('getGroupName',groupId);
       return Smartix.Groups.Collection.findOne(groupId).name;
    },
});

Template.NewsgroupsNewsList.events({
    'click .add-to-calendar':function(event){
        var startDate = this.startDate;
        var endDate = this.endDate;
        var eventName = this.eventName;
        var location = this.location;
        var description = $(event.target).data('description');
        Smartix.Messages.Addons.Calendar.addEvent(eventName,location,description,startDate,endDate,function(){
            toastr.info(TAPi18n.__("EventAddCalendar")); 
        });
    },
    'click .content .item .content a': function (e) {
        Smartix.FileHandler.openFile(e);
        e.preventDefault();
    },
    'click .content .item .document a': function (e) {
        Smartix.FileHandler.openFile(e);
        e.preventDefault();
    }
});

Template.NewsgroupsNewsList.onDestroyed(function(){
    Meteor.call('setAllNewsAsRead',Session.get('pickedSchoolId'));
});

