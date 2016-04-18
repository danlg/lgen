

Template.NewsgroupsNewsList.onCreated(function(){
   this.subscribe('newsgroupsForUser',null,null,Session.get('pickedSchoolId'));    
   this.subscribe('newsForUser',null,null,Session.get('pickedSchoolId'));
});

Template.NewsgroupsNewsList.helpers({
    
    newsgroups: function(){
        return Smartix.Groups.Collection.find({ type: 'newsgroup' });
    },
    getNews:function(){
        return Smartix.Messages.Collection.find({ group: this._id });
    }
    
})