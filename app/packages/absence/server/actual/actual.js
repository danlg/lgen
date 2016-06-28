function isValidDate(value) {
    var dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());
}


var convertAttendanceFormat = function (originalRecord, namespace) {
    
    var newRecord = {};
    
    newRecord.studentId = Smartix.Accounts.School.getStudentId(originalRecord.studentId, namespace);
    
    if(newRecord.studentId === false) {
        return "Student with the name " + originalRecord.name + " could not be found";
    }
    
    newRecord.date = moment(originalRecord.date, 'DD-MM-YYYY');
    
    if(!newRecord.date) {
        return "The date " + newRecord.date + " for the record with student name " + originalRecord.name + " could not be parsed";
    }
    
    newRecord.clockIn = Smartix.Utilities.getMinutesSinceMidnight(originalRecord.clockIn);
    
    newRecord.namespace = namespace;
    
    //log.info(newRecord);
    
    return newRecord;
}

Smartix.Absence.attendanceRecordsSchema = new SimpleSchema({
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

var attendanceRecordsPattern = {
    studentId: String,
    name: String,
    date: String,
    clockIn: Match.Maybe(String),
    late: Match.Maybe(String),
    absent: Match.Maybe(String),
    department: String
};

Smartix.Absence.updateAttendanceRecord = function (records, schoolName, currentUser) {

    check(records, Match.OneOf(attendanceRecordsPattern, [attendanceRecordsPattern]));
    check(schoolName, String);
    check(currentUser, Match.Maybe(String));
    
    let namespace =  SmartixSchoolsCol.findOne({
                shortname: schoolName
    })._id;
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    var errors = [];
    
    if(Array.isArray(records)) {
        records = _.map(records, function (record) {
            var convertedRecord = convertAttendanceFormat(record, namespace);
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
            date: record.date,
            namespace: namespace
        }, record, {
            multi: false
        });
    });
    
    // Add a delay of 100 miliseconds to ensure all records are updated
    Meteor.setTimeout(function () {
        Smartix.Absence.processAbsencesForDay(namespace, undefined, undefined, true, currentUser);
    }, 100);
    
    return {
        insertCount: records.length,
        errors: errors
    };
}