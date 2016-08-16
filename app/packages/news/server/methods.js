Meteor.methods({
    'smartix:news/showMessage': function(msgId) {
        //log.info("smartix:news/showMessage", msgId);
        var targetMsg = Smartix.Messages.Collection.findOne(msgId);
        if (targetMsg) {
            if (Smartix.Class.isClassAdmin(Meteor.userId(), targetMsg.group)) {
                return Smartix.Messages.showMessage(msgId);
            }
        }
    },
    'smartix:news/hideMessage': function(msgId) {
        //log.info("smartix:news/hideMessage", msgId);
        var targetMsg = Smartix.Messages.Collection.findOne(msgId);
        if (targetMsg) {
            if (Smartix.Class.isClassAdmin(Meteor.userId(), targetMsg.group)) {
                return Smartix.Messages.hideMessage(msgId);
            }
        }
    },

    'smartix:news/deleteMessage': function(msgId) {
        var targetMsg = Smartix.Messages.Collection.findOne(msgId);
        if (targetMsg) {
            if (Smartix.Class.isClassAdmin(Meteor.userId(), targetMsg.group)) {
                return Smartix.Messages.deleteMessage(msgId);
            }
        }

    }

});