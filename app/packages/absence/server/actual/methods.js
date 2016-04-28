Meteor.methods({
    'smartix:absence/updateAttendenceRecord': function (record, namespace) {
        return Smartix.Absence.updateAttendenceRecord(record, namespace, this.userId);
    }
})