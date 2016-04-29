Meteor.methods({
    'smartix:absence/updateAttendenceRecord': function (records, namespace) {
        return Smartix.Absence.updateAttendenceRecord(records, namespace, this.userId);
    }
})