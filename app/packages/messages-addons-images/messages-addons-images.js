// Write your package code here!
Smartix = Smartix || {};

Smartix.Messages = Smartix.Messages || {};

Smartix.Messages.Addons = Smartix.Messages.Addons || {};

Smartix.Messages.Addons.ValidTypes = Smartix.Messages.Addons.ValidTypes || [];

Smartix.Messages.Addons.Images = {};

Smartix.Messages.Addons.Images.Type = 'images';

Smartix.Messages.Addons.ValidTypes.push(Smartix.Messages.Addons.Images.Type);

Smartix.Messages.Addons.Images.Schema = new SimpleSchema({
    type:{
        type:String
    },
    fileId: {
        type: String
    }
});