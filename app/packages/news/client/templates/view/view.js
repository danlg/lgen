

Template.NewsgroupsNewsView.onCreated(function(){
   
   var self = this;
   self.subscribe('newsgroupsForUser',null,null,Session.get('pickedSchoolId'),function(){
      self.subscribe('newsForUser',null,null,Session.get('pickedSchoolId'));
   });    

});
    
Template.NewsgroupsNewsView.helpers({
    
    getNews:function(){
        var newsgroups =  Smartix.Groups.Collection.find({ type: 'newsgroup', users: Meteor.userId() }).fetch(); 
        var newsgroupsIds = lodash.map(newsgroups,'_id');
        
        return Smartix.Messages.Collection.find({ group: { $in: newsgroupsIds }, _id: Router.current().params.msgid }  );
    },
    getGroupName:function(groupId){
        console.log('getGroupName',groupId);
       return Smartix.Groups.Collection.findOne(groupId).name;
    }
    
});


Template.NewsgroupsNewsView.onDestroyed(function(){
   
 Meteor.call('setAllNewsAsRead',Session.get('pickedSchoolId'));

});

