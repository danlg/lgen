Meteor.methods({
    'smartix:accounts-relationships/getRelationship': function(relId) {
        return Smartix.Accounts.Relationships.getRelationship(relId, this.userId);
    },
    'smartix:accounts-relationships/createRelationship': function(options) {
        Smartix.Accounts.Relationships.createRelationship(options, this.userId);
    },
    'smartix:accounts-relationships/editRelationship': function(id, options) {
        //to be implemented
    },
    'smartix:accounts-relationships/removeRelationship': function(relId) {
        return Smartix.Accounts.Relationships.removeRelationship(relId, this.userId);
    },
});