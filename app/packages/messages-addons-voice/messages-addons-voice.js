Smartix = Smartix || {};

Smartix.Messages = Smartix.Messages || {};

Smartix.Messages.Addons = Smartix.Messages.Addons || {};

Smartix.Messages.Addons.ValidTypes = Smartix.Messages.Addons.ValidTypes || [];

Smartix.Messages.Addons.Voice = {};

Smartix.Messages.Addons.Voice.Type = 'voice';

Smartix.Messages.Addons.ValidTypes.push(Smartix.Messages.Addons.Voice.Type);

Smartix.Messages.Addons.Voice.Schema = new SimpleSchema({
    type:{
        type:String
    },
    fileId: {
        type: String
    }
});