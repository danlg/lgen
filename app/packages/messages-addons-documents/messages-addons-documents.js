// Write your package code here!
Smartix = Smartix || {};

Smartix.Messages = Smartix.Messages || {};

Smartix.Messages.Addons = Smartix.Messages.Addons || {};

Smartix.Messages.Addons.ValidTypes = Smartix.Messages.Addons.ValidTypes || [];

Smartix.Messages.Addons.Documents = {};

Smartix.Messages.Addons.Documents.Type = 'documents';

Smartix.Messages.Addons.ValidTypes.push(Smartix.Messages.Addons.Documents.Type);

Smartix.Messages.Addons.Documents.Schema = new SimpleSchema({
    type:{
        type:String
    },
    fileId: {
        type: String
    }
});