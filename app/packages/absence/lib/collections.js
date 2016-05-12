Smartix = Smartix || {};
Smartix.Absence = Smartix.Absence || {};
Smartix.Absence.Collections = Smartix.Absence.Collections || {};

Smartix.Absence.Collections.expected = new Mongo.Collection('smartix:absence/expected');
Smartix.Absence.Collections.actual = new Mongo.Collection('smartix:absence/actual');
Smartix.Absence.Collections.processed = new Mongo.Collection('smartix:absence/processed');

Smartix.Absence.AllowedStatus = ['approved', 'unapproved', 'missing', 'unknown'];

Smartix.Absence.expectedAbsenceSchema = new SimpleSchema({
    namespace: {
        type: String
    },
    studentId: {
        type: String
    },
    reporterId: {
        type: String
    },
    dateFrom: {
        type: Number,
        decimal: false
    },
    dateTo: {
        type: Number,
        decimal: false
    },
    message: {
        type: String,
        optional: true
    },
    approved: {
        type: Boolean,
        defaultValue: false
    },
    adminId: {
        type: String,
        optional: true
    }
});

Smartix.Absence.attendenceRecordsSchema = new SimpleSchema({
    name: {
        type: String
    },
    date: {
        type: Date
    },
    clockIn: {
        type: String,
        optional: true
    },
    late: {
        type: String,
        optional: true
    },
    absent: {
        type: String,
        optional: true
    },
    department: {
        type: String
    }
});

Smartix.Absence.processedAbsenceSchema = new SimpleSchema({
    studentId: {
        type: String
    },
    date: {
        type: String,
    },
    expectedAbsenceRecords: {
        type: [String],
        defaultValue: []
    },
    status: {
        type: String,
        allowedValues: Smartix.Absence.AllowedStatus
    },
    namespace: {
        type: String
    },
    clockIn: {
        type: Number,
        decimal: false
    },
    lastNotified: {
        type: Number,
        decimal: false,
        optional: true
    }
});