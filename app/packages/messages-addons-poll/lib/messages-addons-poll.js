
Smartix = Smartix || {};

Smartix.Messages = Smartix.Messages || {};

Smartix.Messages.Addons = Smartix.Messages.Addons || {};

Smartix.Messages.Addons.Poll = Smartix.Messages.Addons.Poll || {};

Smartix.Messages.Addons.Poll.Type = 'poll';

Smartix.Messages.Addons.ValidTypes = Smartix.Messages.Addons.ValidTypes || [];

Smartix.Messages.Addons.ValidTypes = _.union(Smartix.Messages.Addons.ValidTypes, [Smartix.Messages.Addons.Poll.Type]);

/**
 * Represents a Poll.
 * @constructor
 * @param {string} type - type of addons. in this case, it is poll
 * @param {string array} options - String Array that stores what options are available in the poll. This field is useful for doing query
 * @param {object array} votes - Object Array that stores options detail, consists for below four property
 * @param {String} votes.$.option" - store a single option name
 * @param {String array} votes.$.users - string array that stores user's id if they have polled
 * @param {String} votes.$.optionIconType - show type of icon used. e.g icon-emojicon, icon-ionicon , image, text
 * @param {String} votes.$.optionIconValue - related value of optionIconType, e.g if optionIconType is image, imageId should be stored in this field. if optionIconType is text, actual text to be displayed should be stored in this field.
 * @param {Boolean} multiple - whether user can vote for multiple options - not yet implement.  
 * @param {Number} expires - time that the vote expires - not yet implement.        
 */
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
    "votes.$.optionShowEvenNoVote": {
        type: Boolean,
        defaultValue:true
    },       
    "votes.$.users": {
        type: [String]
    },
    "votes.$.optionIconType": {
        type: String
    },
    "votes.$.optionIconValue": {
        type: String
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