function isValidDate(value) {
    var dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());
}

var getMinutesSinceMidnight = function (timeString) {
    if(!timeString) {
        return null;
    }
    var mmt = moment(timeString, 'HH:mm');

    // Your moment at midnight
    var mmtMidnight = mmt.clone().startOf('day');

    // Difference in minutes
    var diffMinutes = mmt.clone().diff(mmtMidnight, 'minutes');
    
    if(isNaN(diffMinutes)) {
        return null;
    }
    
    return diffMinutes;
}

var convertAttendenceFormat = function (originalRecord, namespace) {
    
    var newRecord = {};
    
    // Convert the names into user's IDs
    newRecord.studentId = Smartix.Accounts.School.getStudentIdFromName(originalRecord.name, namespace);
    
    if(newRecord.studentId === false) {
        return "Student with the name " + originalRecord.name + " could not be found";
    }
    
    newRecord.date = new Date(originalRecord.date);
    
    if(!isValidDate(newRecord.date)) {
        return "The date " + originalRecord.name + " for the record with student name " + originalRecord.name + " could not be parsed";
    }
    
    newRecord.clockIn = getMinutesSinceMidnight(originalRecord.clockIn);
    
    
    
    return newRecord;
}

Smartix.Absence.attendenceRecordsSchema = new SimpleSchema({
    name: {
        type: String
    },
    date: {
        type: String
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

var attendenceRecordsPattern = {
    name: String,
    date: String,
    clockIn: Match.Maybe(String),
    late: Match.Maybe(String),
    absent: Match.Maybe(String),
    department: String
};

Smartix.Absence.updateAttendenceRecord = function (records, namespace, currentUser) {
    
    check(records, Match.OneOf(attendenceRecordsPattern, [attendenceRecordsPattern])),
    check(namespace, String),
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    var errors = [];
    
    if(Array.isArray(records)) {
        records = _.map(records, function (record) {
            var convertedRecord = convertAttendenceFormat(record, namespace);
            if(typeof convertedRecord === "string") {
                errors.push(convertedRecord);
                return null;
            }
            return convertedRecord;
        }).filter(Boolean);
    }
    
    var insertCount = 0;
    
    _.each(records, function(record) { 
        Smartix.Absence.Collections.actual.upsert({
            studentId: record.studentId,
            date: record.date
        }, record, {
            multi: false
        });
    })
    
    return {
        insertCount: records.length,
        errors: errors
    };
}