Meteor.methods({
    'smartix:absence/notifyParent': function (processId) {
        return Smartix.Absence.notificationToParentForDetail(processId, this.userId);
    },
    'smartix:absence/replyWithReason': function (options) {
        Smartix.Absence.parentReplySchema.clean(options);
        check(options, Smartix.Absence.parentReplySchema);
        return Smartix.Absence.processParentReply(options, this.userId);
    }
});