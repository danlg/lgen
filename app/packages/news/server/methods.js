Meteor.methods({
    'smartix:news/showMessage': function(msgId) {
        log.info("smartix:news/showMessage '" + msgId + "'");
        //log.info("smartix:news/showMessage typeof '" + typeof(msgId) + "'");
        //log.info("smartix:news/showMessage typeof str'" + typeof(msgId.toString()) + "'");
        //let targetMsgCursor = Smartix.Messages.Collection.find(msgId.toString());
        //log.info("smartix:news/showMessage:cursor.count", targetMsgCursor.count());
        //log.info("smartix:news/showMessage:cursor", targetMsgCursor);
        var targetMsg = Smartix.Messages.Collection.findOne(msgId.toString());
        if (targetMsg) {
            if (Smartix.Class.isClassAdmin(Meteor.userId(), targetMsg.group)) {
                return Smartix.Messages.showMessage(msgId.toString());
            }
            else{
                log.info("smartix:news/showMessage:cannot show/not admin", msgId);
            }
        }
        else{
            log.info("smartix:news/showMessage:cannot show/not found", msgId);
        }
    },
    'smartix:news/hideMessage': function(msgId) {
        log.info("smartix:news/hideMessage", msgId.toString());
        var targetMsg = Smartix.Messages.Collection.findOne(msgId.toString());
        if (targetMsg) {
            if (Smartix.Class.isClassAdmin(Meteor.userId(), targetMsg.group)) {
                return Smartix.Messages.hideMessage(msgId.toString());
            }
            else{
                log.info("smartix:news/hideMessage:cannot hide/not admin", msgId);
            }
        }
        else{
            log.info("smartix:news/hideMessage:cannot hide/not found", msgId);
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