_ = lodash;

//Smartix.Messages.Collection = new Mongo.Collection('smartix:messages');
Smartix = Smartix || {};

Smartix.Messages = Smartix.Messages || {};

Smartix.Messages.ValidTypes = Smartix.Messages.ValidTypes || [];

// Add `text` to `Smartix.Messages.ValidTypes` array
// (from `smartix:messages` package) on initialization
//console.log('push new message valid type: text');
Smartix.Messages.ValidTypes.push('text');
//console.log('Smartix.Messages.ValidTypes',Smartix.Messages.ValidTypes);

Smartix.Messages.Text = Smartix.Messages.Text || {};

//console.log('Smartix.Messages.Schema@message-text',Smartix.Messages.Schema);
Smartix.Messages.Text.Schema = new SimpleSchema([Smartix.Messages.Schema, {
    "data.text": {
        type: String
    }
}]);