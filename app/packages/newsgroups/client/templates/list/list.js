

Template.NewsgroupsList.onCreated(function(){
   
   var self = this;
   self.subscribe('newsgroupsForUser',null,null,Session.get('pickedSchoolId'),function(){
      self.subscribe('newsForUser',null,null,Session.get('pickedSchoolId'));
   });    

});

Template.NewsgroupsList.helpers({
    
    getNewsgroups:function(){
        return Smartix.Groups.Collection.find({ type: 'newsgroup' });
    },
    getGroupName:function(groupId){
        console.log('getGroupName',groupId);
       return Smartix.Groups.Collection.findOne(groupId).name;
    },
    userInNewsgroup:function(){
        return (this.users.indexOf(Meteor.userId()) > -1) ? true : false ;
    }    
    
});


Template.NewsgroupsList.events({
   'click .opt-out':function(event,template){
       var groupId = $(event.target).data("groupId");
       Meteor.call('class/leave', groupId);      
   },
   'click .opt-in':function(event,template){
       var groupId = $(event.target).data("groupId");
       Meteor.call('smartix:newsgroups/joinNewsgroup', groupId);        
    
              
   },   
});

Template.NewsgroupsList.onDestroyed(function(){
   
 Meteor.call('setAllNewsAsRead',Session.get('pickedSchoolId'));

});

