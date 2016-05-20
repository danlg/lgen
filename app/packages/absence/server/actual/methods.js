Meteor.methods({
    'smartix:absence/updateAttendanceRecord': function (records, namespace) {
        return Smartix.Absence.updateAttendanceRecord(records, namespace, this.userId);
    }
})