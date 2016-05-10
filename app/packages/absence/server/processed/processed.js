Smartix = Smartix || {};
Smartix.Absence = Smartix.Absence || {};

// Temporary until the admin settings page is implemented
var schoolStartTime = "08:00";
var minutesToConsiderAbsent = 120;
var schoolEndTime = "16:00";

Smartix.Absence.getAllStudentsWhoAreExpectedToTapIn = function (namespace) {
    return Meteor.users.find({
    })
};

Smartix.Absence.processAbsences = function (namespace, currentUser) {
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Get all the students in the namespace who are expected to tap in
    let allSchoolUsers = Smartix.Accounts.School.getAllSchoolStudents(namespace, currentUser);
    log.info(allSchoolUsers);
    log.info(allSchoolUsers.count());
    // Smartix.Absence.Collections.processed.upsert();
};

Smartix.Absence.processAbsencesForDay = function (namespace, date, format, currentUser) {
    check(namespace, String);
    check(date, Match.Maybe(Match.OneOf(String, Date)));
    check(format, Match.Maybe(String));
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    ////////////////
    // PARSE DATE //
    ////////////////
    
    let parsedDate;
    
    if(date) {
        if(typeof date instanceof Date) {
            // `date` is of type `Date`, but can be an invalid date
            parsedDate = moment(date);
        } else if (typeof date === "string") {
            // `date` is of type `String`
            // Parse using format if provided
            if(typeof format === "string") {
                // Assumes all schools uses HKT (UTC +8)
                parsedDate = moment.utc(date, format).subtract(8, 'hours');
            } else {
                parsedDate = moment.utc(date).subtract(8, 'hours');
            }
        } else if (typeof date === "number") {
            parsedDate = moment(date * 1000);
        } else {
            parsedDate = moment().startOf('day');
        }
    } else {
        parsedDate = moment().startOf('day');
    }
    
    let dateString = parsedDate.format('DD-MM-YYYY');
    
    /////////////////////////////////////
    // GET ATTENDENCE RECORDS FOR DATE //
    /////////////////////////////////////
    
    console.log(dateString);
    
    let attendenceRecord = Smartix.Absence.Collections.actual.find({
        date: dateString,
        namespace: namespace
    }).fetch();
    
    console.log(attendenceRecord);
    
    let schoolStartTimeM = Smartix.Utilities.getMinutesSinceMidnight(schoolStartTime);
    
    console.log(schoolStartTimeM);
    
    // Check the clockIn time
    // If it's `null` it means the user has not tapped in
    // If it is later than the `schoolStartTime`, the student is late
    _.each(attendenceRecord, function (record, i) {
        if(record.clockIn === null || record.clockIn > schoolStartTimeM) {
            // Student is late or absent
            console.log(record.studentId + ' is absent or late');
            
            // Search the expected absences collection for today
            // Assumes all schools uses HKT (UTC +8)
            let startOfDay = moment.utc(record.date + " " + schoolStartTime, 'DD-MM-YYYY HH:mm').subtract(8, 'hours');
            let endOfDay = moment.utc(record.date + " " + schoolEndTime, 'DD-MM-YYYY HH:mm').subtract(8, 'hours');
            let clockedInTime;
            if(record.clockIn !== null) {
                clockedInTime = moment.utc(record.date + " " + record.clockIn, 'DD-MM-YYYY HH:mm').subtract(8, 'hours');
            } else {
                clockedInTime = null;
            }
            
            
            // Get all expected absences relevant to the user at the date specified
            let relevantAbsences = Smartix.Absence.Collections.expected.find({
                dateFrom: {
                    $lt: (endOfDay.unix())
                },
                dateTo: {
                    $gte: (startOfDay.unix())
                },
                studentId: record.studentId,
                namespace: namespace
            }).fetch();
            
            let expectedAbsenceRange = _.reduce(relevantAbsences, function (accumulator, value, index, collection) {
                accumulator.ids.push(value._id);
                accumulator.approved = accumulator.approved || value.approved;
                accumulator.start = Math.min(accumulator.start, value.dateFrom);
                accumulator.end = Math.max(accumulator.end, value.dateTo);
                return accumulator;
            }, {
                ids: [],
                approved: false,
                start: endOfDay.unix(),
                end: startOfDay.unix()
            });
            
            // Checks if the user has registered an expected absence
            let processedAbsence = {};
            processedAbsence.studentId = record.studentId;
            processedAbsence.date = record.date;
            processedAbsence.namespace = record.namespace;
            processedAbsence.clockIn = record.clockIn;
            
            // Simple implementation -
            // If the user's `clockIn` value is less than the last `dateTo` time
            // Count as `approved/unapproved`
            
            
            if((clockedInTime === null && (Date.now() / 1000) < expectedAbsenceRange.end)
                || (clockedInTime !== null && clockedInTime.unix() < expectedAbsenceRange.end)) {
                processedAbsence.expectedAbsenceRecords = expectedAbsenceRange.ids;
                processedAbsence.status = expectedAbsenceRange.approved ? 'approved' : 'pending';
            } else {
                // The user's `clockIn` value is over the last `dateTo` time
                // User is either late or absent and has not sent in a notice
                processedAbsence.status = 'missing';
            }
            
            Smartix.Absence.Collections.processed.insert(processedAbsence);
            
        } else {
            // Student is on-time, no action required
            // console.log(record.studentId + ' is on-time');
        }
    })   
}