Meteor.methods({
    'smartix:messages/createMessage': function(groupId, messageType, data, addons, isPush) {
        return Smartix.Messages.createMessage(groupId, messageType, data, addons, isPush, this.userId);
    },
    
    'smartix:messages/createNewsMessage': function(broadcastList, messageType, data, addons, isPush) {
        // var newsgroupDoc = Smartix.Groups.Collection.findOne({ url: url });
        var newsgroupDoc = [];
        lodash.forEach(broadcastList, function(url){
            newsgroupObj =     Smartix.Groups.Collection.findOne({ url: url });
            newsgroupDoc.push(newsgroupObj._id);
        });
        if (!newsgroupDoc) {
            return;
        }
        log.info(newsgroupDoc);
        // return;
        return Smartix.Messages.createBroadcastMessage(newsgroupDoc, messageType, data, addons, isPush, this.userId);
    }
});