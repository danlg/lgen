Meteor.methods({
    'smartix:absence/notifyParent': function (processId) {
        return Smartix.Absence.notificationToParentForDetail(processId, this.userId);
    }
})

