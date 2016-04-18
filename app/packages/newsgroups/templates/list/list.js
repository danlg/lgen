

Template.NewsgroupsNewsList.onCreated(function(){
   this.subscribe('newsgroupsForUser',null,null,Session.get('pickedSchoolId'));    
   this.subscribe('newsForUser',null,null,Session.get('pickedSchoolId'));
});

Template.NewsgroupsNewsList.helpers({
    
    getNews:function(){
        var newsgroups =  Smartix.Groups.Collection.find({ type: 'newsgroup' }).fetch(); 
        var newsgroupsIds = lodash.map(newsgroups,'_id');
        
        return Smartix.Messages.Collection.find({ group: { $in: newsgroupsIds } }, {sort: {createdAt: -1 } } );
    },
    getGroupName:function(){
       return Smartix.Groups.Collection.findOne(this.group).name;
    }
    
})