Meteor.methods({
    'smartix:messages/createMessage': function(groupId, messageType, data, addons, isPush) {
        return Smartix.Messages.createMessage(groupId, messageType, data, addons, isPush, this.userId);
    },
    
    'smartix:messages/createNewsMessage': function(urls, messageType, data, addons, isPush) {
        // this.unblock();
        let successUrls = [];
        lodash.forEach(urls, function(url){
            var newsgroupDoc = Smartix.Groups.Collection.findOne({ url: url });
            if (!newsgroupDoc) {
                return;
            }
            Smartix.Messages.createMessage(newsgroupDoc._id, messageType, data, addons, isPush, this.userId);
            successUrls.push(url);    
        })
        // log.info(successUrls);
        return successUrls;
    }
});