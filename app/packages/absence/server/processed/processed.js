Smartix = Smartix || {};
Smartix.Absence = Smartix.Absence || {};

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

Smartix.Absence.processAbsencesForDay = function (namespace, date, format, notify, currentUser) {
    check(namespace, String);
    // check(date, Match.Maybe(Match.OneOf(String, Date, [Number])));
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
    if(!date) {
        parsedDate = moment.utc().startOf('day').unix();
    }
    else
    {
        parsedDate = moment(date, ["DD/MM/YYYY", "DD-MM-YYYY", "DD-MM-YY", "DD/MM/YY"]).unix()
    }

    let dateString = moment(parsedDate, 'DD-MM-YYYY').format('DD-MM-YYYY');

    let schoolStartTimeM = Smartix.Utilities.getMinutesSinceMidnight(schoolStartTime);
    
    // If the date is today
    // Ensures the current time is after the schoolStartTime
    // Otherwise, there will be many `pending` entries
    // Caused by students not clocking in (because it's before the schoolStartTime)
    
    //log.info('dateString:', dateString);
    //log.info(moment(dateString, 'DD-MM-YYYY').isSame(new Date(), "day"));
    
    if(
        // If the date is today
        // TODO: checks it is not in the future
        moment(dateString, 'DD-MM-YYYY').isSame(new Date(), "day")) {
        // Converts "08:00" to 480
        let minutesSinceMidnight = Smartix.Utilities.getMinutesSinceMidnight(moment.utc(new Date()).add(8, 'hours').format("HH:mm"));
        
        //log.info('schoolStartTimeM:', schoolStartTimeM);
        //log.info('minutesSinceMidnight:', minutesSinceMidnight);
        
        if(minutesSinceMidnight < schoolStartTimeM) {
            return false;
        }
    }
    
    /////////////////////////////////////
    // GET ATTENDENCE RECORDS FOR DATE //
    /////////////////////////////////////


    let attendanceRecord = Smartix.Absence.Collections.actual.find({
        date: parsedDate,
        namespace: namespace
    }).fetch();

    // Check the clockIn time
    // If it's `null` it means the user has not tapped in
    // If it is later than the `schoolStartTime`, the student is late
    _.each(attendanceRecord, function (record, i) {
        if(record.clockIn === null || record.clockIn > schoolStartTimeM) {
            // Student is late or absent
            
            let recordDate = moment.unix(record.date).format('DD-MM-YYYY');
            // Search the expected absences collection for today
            // Assumes all schools uses HKT (UTC +8)
            let startOfDay = moment.utc(recordDate + " " + schoolStartTime, 'DD-MM-YYYY HH:mm').subtract(8, 'hours');
            let endOfDay = moment.utc(recordDate + " " + schoolEndTime, 'DD-MM-YYYY HH:mm').subtract(8, 'hours');
            let clockedInTime;
            if(record.clockIn !== null) {
                clockedInTime = moment.utc(recordDate + " 00:00", 'DD-MM-YYYY').subtract(8, 'hours').add(record.clockIn, "minutes");
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
            // Count as `approved/pending`
            
            let hasPhonedIn = (
                // User has not clocked in and the time now is before the expected absence's end
                (clockedInTime === null && (Date.now() / 1000) < expectedAbsenceRange.end)
                
                // Or the user has clocked in and the clocked in time is before the expected absence's end
                || (clockedInTime !== null && clockedInTime.unix() < expectedAbsenceRange.end));
  
            if(hasPhonedIn) {
                processedAbsence.expectedAbsenceRecords = expectedAbsenceRange.ids;
                processedAbsence.status = expectedAbsenceRange.approved ? 'approved' : 'pending';
            } else {
                // The user's `clockIn` value is over the last `dateTo` time
                // User is either late or absent and has not sent in a notice
                processedAbsence.status = 'missing';
            }
            
            let process = Smartix.Absence.Collections.processed.upsert({
                date: processedAbsence.date,
                namespace: processedAbsence.namespace,
                studentId: processedAbsence.studentId
            }, processedAbsence, false);
            
            let processId;
            
            if(process.insertedId) {
                processId = process.insertedId;
            } else {
                processId = Smartix.Absence.Collections.processed.findOne({
                    date: processedAbsence.date,
                    namespace: processedAbsence.namespace,
                    studentId: processedAbsence.studentId
                })._id;
            }
            
            if(!hasPhonedIn && notify) {
                // Notify the parents
                // Send notification
                Smartix.Absence.notificationToParentForDetail(processId, currentUser);
            }
            
        } else {
            // Student is on-time, no action required
            // console.log(record.studentId + ' is on-time');
        }
    })   
}