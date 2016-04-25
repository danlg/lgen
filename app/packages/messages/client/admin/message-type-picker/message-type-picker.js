Template.AdminMessageTypePicker.helpers({
    validMessageTypes: function () {
        if(Smartix
        && Smartix.Messages
        && Smartix.Messages.ValidTypes
        && Array.isArray(Smartix.Messages.ValidTypes)) {
            return Smartix.Messages.ValidTypes;
        }
        return [];
    }
})

Template.AdminMessageTypePicker.events({
    'click': function (event, template) {
        
    }
})