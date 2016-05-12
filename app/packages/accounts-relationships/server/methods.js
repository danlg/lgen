Meteor.methods({
    'smartix:accounts-relationships/getRelationship': function(relId) {
        return Smartix.Accounts.Relationships.getRelationship(relId, this.userId);
    },
    'smartix:accounts-relationships/createRelationship': function(options) {
    //e.g Meteor.call('smartix:accounts-relationships/createRelationship',{ parent:'5AWL9FdWwsXnc9rKi' ,child:'HscT8DZ78EfMhwS8v',namespace:'XWXvhBXxmzk8AQibe',name:'mother' });        
        return Smartix.Accounts.Relationships.createRelationship(options, this.userId);
    },
    'smartix:accounts-relationships/editRelationship': function(id, options) {
        //to be implemented
    },
    'smartix:accounts-relationships/removeRelationship': function(relId) {
        return Smartix.Accounts.Relationships.removeRelationship(relId, this.userId);
    },
});