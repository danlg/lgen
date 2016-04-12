_ = lodash;

Smartix.Messages.Collection = new Mongo.Collection('smartix:messages');

Smartix.Messages.ValidTypes = Smartix.Messages.ValidTypes || [];

// Add `text` to `Smartix.Messages.ValidTypes` array
// (from `smartix:messages` package) on initialization
Smartix.Messages.ValidTypes = _.union(Smartix.Messages.ValidTypes, ['text']);

Smartix.Messages.Text = Smartix.Messages.Text || {};

Smartix.Messages.Text.Schema = new SimpleSchema([Smartix.Messages.Schema, {
    "data.text": {
        type: String
    }
}]);

Smartix.Messages.Text.createMessage = function (group, data, addons) {
    check(group, String);
    check(data.text, String);
    check(addons, [String]);
    
    var newMessage = {};
    
    newMessage.group = group;
    
    // Add `author` property and set to currently-logged in user
    newMessage.author = Meteor.userId();
    newMessage.type = 'text';
    newMessage.data = data
    
    Smartix.Messages.Text.Schema.clean(newMessage);
    
    check(newMessage, Smartix.Messages.Text.Schema);
    
    Smartix.Messages.Collection.insert(newMessage);
    
};

Smartix.Messages.Text.editMessage = function (id, data) {
    check(id, String);
    check(data, Object);
    check(data.text, String);
    
    Smartix.Messages.Collection.update({
        _id: id
    }, {
        $set: {
            data: data
        }
    })
};