Meteor.methods({
    'smartix:absence/registerExpectedAbsence': function (options) {
        Absence.registerExpectedAbsenceSchema.clean(options);
        check(options, Absence.registerExpectedAbsenceSchema);
        
        return Smartix.Absence.registerExpectedAbsence(options, this.userId);
    },
    'smartix:absence/approveExpectedAbsence': function (id) {
        
        check(id, String);
        
        return Smartix.Absence.approveExpectedAbsence(id, this.userId);
    }
});