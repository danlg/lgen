_ = lodash;

//Smartix.Messages.Collection = new Mongo.Collection('smartix:messages');

Smartix = Smartix || {};

Smartix.Messages = Smartix.Messages || {};

Smartix.Messages.ValidTypes = Smartix.Messages.ValidTypes || [];

// Add `text` to `Smartix.Messages.ValidTypes` array
// (from `smartix:messages` package) on initialization
//log.info('push new message valid type: article', );
Smartix.Messages.ValidTypes.push('article');

//log.info('Smartix.Messages.ValidTypes',Smartix.Messages.ValidTypes);

Smartix.Messages.Article = Smartix.Messages.Article || {};

Smartix.Messages.Article.Schema = new SimpleSchema([Smartix.Messages.Schema, {
    "data.text": {
        type: String
    },
    "data.title": {
        type: String
    },    
}]);