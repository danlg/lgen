Meteor.methods({
    'smartix:absence/updateAttendanceRecord': function (records, namespace) {
        return Smartix.Absence.updateAttendanceRecord(records, namespace, this.userId);
    },
    
    'smartix:absence/recordRollCall': function(records, date, classCode, namespace){
        return Smartix.Absence.recordRollCall(records, date, classCode, namespace, this.userId);
    }
})