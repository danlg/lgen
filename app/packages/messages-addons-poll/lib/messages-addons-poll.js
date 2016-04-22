
Smartix = Smartix || {};

Smartix.Messages = Smartix.Messages || {};

Smartix.Messages.Addons = Smartix.Messages.Addons || {};

Smartix.Messages.Addons.Poll = Smartix.Messages.Addons.Poll || {};

Smartix.Messages.Addons.Poll.Type = 'poll';

Smartix.Messages.Addons.ValidTypes = Smartix.Messages.Addons.ValidTypes || [];

Smartix.Messages.Addons.ValidTypes = _.union(Smartix.Messages.Addons.ValidTypes, [Smartix.Messages.Addons.Poll.Type]);

Smartix.Messages.Addons.Poll.Schema = new SimpleSchema({
    type:{
        type:String
    },    
    options: {
        type: [String]
    },
    votes: {
        type: [Object]
    },
    "votes.$.option": {
        type: String
    },
    "votes.$.users": {
        type: [String]
    },
    multiple: {
        type: Boolean,
        defaultValue: false
    },
    expires: {
        type: Number,
        optional: true
    }
});