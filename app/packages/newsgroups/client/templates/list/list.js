

Template.NewsgroupsList.onCreated(function(){
   
   var self = this;
   
   self.subscribe('newsgroupsForUser',null,null,Session.get('pickedSchoolId'),function(){
       self.subscribe('smartix:distribution-lists/listsInNamespace',Session.get('pickedSchoolId'),function(){
            self.subscribe('newsForUser',null,null,Session.get('pickedSchoolId'));           
       });
   });    

});

Template.NewsgroupsList.helpers({
    
    getNewsgroups:function(){
        return Smartix.Groups.Collection.find({ type: 'newsgroup' });
    },
    getGroupName:function(groupId){
        //console.log('getGroupName',groupId);
       return Smartix.Groups.Collection.findOne(groupId).name;
    },
    userInNewsgroup:function(){
        
        var userInNewsgroup = false;
        
        //check if user in users array of the group
        if(this.users.indexOf(Meteor.userId()) > -1){
            userInNewsgroup = true;
        }
        
        //check if user in distribution lists of the group and not opt-out
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

