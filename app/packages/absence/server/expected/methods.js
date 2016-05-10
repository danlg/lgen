Meteor.methods({
    'smartix:absence/registerExpectedAbsence': function (options) {
        Smartix.Absence.expectedAbsenceSchema.clean(options);
        check(options, Smartix.Absence.expectedAbsenceSchema);
        
        return Smartix.Absence.registerExpectedAbsence(options, this.userId);
    },
    'smartix:absence/approveExpectedAbsence': function (id) {
        
        check(id, String);
        
        return Smartix.Absence.approveExpectedAbsence(id, this.userId);
    },
    'smartix:absence/unapproveExpectedAbsence': function (id) {
        
        check(id, String);
        
        return Smartix.Absence.unapproveExpectedAbsence(id, this.userId);
    }
});