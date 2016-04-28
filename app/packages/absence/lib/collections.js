Smartix = Smartix || {};
Smartix.Absence = Smartix.Absence || {};
Smartix.Absence.Collections = Smartix.Absence.Collections || {};

Smartix.Absence.Collections.expected = new Mongo.Collection('smartix:absence/expected');
Smartix.Absence.Collections.actual = new Mongo.Collection('smartix:absence/actual');

Smartix.Absence.AllowedStatus = ['approved', 'unapproved', 'missing'];

Smartix.Absence.registerExpectedAbsenceSchema = new SimpleSchema({
    studentId: {
        type: String
    },
    reporterId: {
        type: String
    },
    dateFrom: {
        type: Date
    },
    dateTo: {
        type: Date
    },
    message: {
        type: String,
        optional: true
    }
});

Smartix.Absence.expectedAbsenceSchema = new SimpleSchema({
    studentId: {
        type: String
    },
    reporterId: {
        type: String
    },
    date: {
        type: Date,
    },
    message: {
        type: String,
        optional: true
    },
    approved: {
        type: Boolean
    },
    namespace: {
        type: String
    }
});

Smartix.Absence.actualAbsenceSchema = new SimpleSchema({
    studentId: {
        type: String
    },
    date: {
        type: Date,
    },
    expectedAbsenceRecord: {
        type: String
    },
    status: {
        type: String,
        allowedValues: Smartix.Absence.AllowedStatus
    },
    namespace: {
        type: String
    }
});