_ = lodash;

//Smartix.Messages.Collection = new Mongo.Collection('smartix:messages');

Smartix.Messages.ValidTypes = Smartix.Messages.ValidTypes || [];

// Add `text` to `Smartix.Messages.ValidTypes` array
// (from `smartix:messages` package) on initialization
Smartix.Messages.ValidTypes = _.union(Smartix.Messages.ValidTypes, ['images']);

Smartix.Messages.Images = Smartix.Messages.Images || {};

Smartix.Messages.Images.Schema = new SimpleSchema([Smartix.Messages.Schema, {
    "data.text": {
        type: String
    },
    fileId:{
        type:String
    }
}]);