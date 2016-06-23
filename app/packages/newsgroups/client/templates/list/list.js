Template.NewsgroupsList.onCreated(function(){
    var schoolName = UI._globalHelpers['getCurrentSchoolName']();
    var self = this;
    if(schoolName)
    {
        var schoolId = UI._globalHelpers['getCurrentSchoolId']()
        self.autorun(function(){
            self.subscribe('smartix:newsgroups/allNewsgroupsFromSchoolName',schoolName);
            self.subscribe('smartix:distribution-lists/listsInNamespace',schoolId);
        });
    }
});

Template.NewsgroupsList.helpers({
    getNewsgroups:function(){
        return Smartix.Groups.Collection.find({ type: 'newsgroup' });
    },
    getGroupName:function(groupId){
        //log.info('getGroupName',groupId);
       return Smartix.Groups.Collection.findOne(groupId).name;
    },
    userInNewsgroup:function(){    
        var userInNewsgroup = false;
        //check if user in users array of the group
        if(this.users.indexOf(Meteor.userId()) > -1){
            userInNewsgroup = true;
        }
        //check if user in distribution lists of the group
        if(this.distributionLists && this.optOutUsersFromDistributionLists){
            if(this.optOutUsersFromDistributionLists.indexOf(Meteor.userId()) === -1){
                if( Smartix.Groups.Collection.find({type: 'distributionList', _id : {$in: this.distributionLists}, users: Meteor.userId() }).count() > 0 ){
                    userInNewsgroup = true;            
                }                
            }  
        }   
        return userInNewsgroup;
    },
    userInUserArray:function(){
        return (this.users.indexOf(Meteor.userId()) > -1)
    },
    userInNewsgroupDistributionListButOptOut:function(){
        //check if user in distribution lists of the group
        if(this.optOutUsersFromDistributionLists){    
            return (this.optOutUsersFromDistributionLists.indexOf(Meteor.userId()) > -1)
        }else{
            return false;
        }      
    },    
});

Template.NewsgroupsList.events({
   'click .opt-out':function(event,template){
       if($(event.target).hasClass("distribution-list")){
         var groupId = $(event.target).data("groupId");
         Meteor.call('smartix:newsgroups/addToOptOutList', groupId);
       }else{
         var groupId = $(event.target).data("groupId");
         Meteor.call('class/leave', groupId);            
       }
   },
   'click .opt-in':function(event,template){
       if($(event.target).hasClass("distribution-list")){
         var groupId = $(event.target).data("groupId");
         Meteor.call('smartix:newsgroups/removeFromOptOutList', groupId); 
       }else{
         var groupId = $(event.target).data("groupId");
         Meteor.call('smartix:newsgroups/joinNewsgroup', groupId);          
       }       
   },   
});

Template.NewsgroupsList.onDestroyed(function(){
    Meteor.call('setAllNewsAsRead',Session.get('pickedSchoolId'));
});

