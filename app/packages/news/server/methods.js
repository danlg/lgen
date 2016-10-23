Meteor.methods({
    'smartix:news/showMessage': function(msgId) {
        log.info("smartix:news/showMessage '" + msgId + "'");
        var targetMsg = Smartix.Messages.Collection.findOne(msgId.toString());
        if (targetMsg) {
            let groupId = targetMsg.group || targetMsg.groups[0];
            if (Smartix.Class.isClassAdmin(Meteor.userId(), groupId)) {
                return Smartix.Messages.showMessage(msgId.toString());
            }
            else{
                log.warn("smartix:news/showMessage:cannot show/not admin userId", Meteor.userId(), "target Msg", targetMsg);
            }
        }
        else{
            log.warn("smartix:news/showMessage:cannot show/not found", msgId);
        }
    },
    
    'smartix:news/hideMessage': function(msgId) {
        log.info("smartix:news/hideMessage", msgId.toString());
        var targetMsg = Smartix.Messages.Collection.findOne(msgId.toString());
        if (targetMsg) {
            let groupId = targetMsg.group || targetMsg.groups[0];
            if (Smartix.Class.isClassAdmin(Meteor.userId(), groupId)) {
                return Smartix.Messages.hideMessage(msgId.toString());
            }
            else{
                log.warn("smartix:news/hideMessage:cannot hide/not admin userId", Meteor.userId(), "target Msg", targetMsg);
            }
        }
        else{
            log.warn("smartix:news/hideMessage:cannot hide/not found", msgId);
        }
    },

    'smartix:news/deleteMessage': function(msgId) {
        var targetMsg = Smartix.Messages.Collection.findOne(msgId);
        if (targetMsg) {
            let groupId = targetMsg.group || targetMsg.groups[0];
            if (Smartix.Class.isClassAdmin(Meteor.userId(), groupId)) {
                return Smartix.Messages.deleteMessage(msgId);
            }
        }
    }

});