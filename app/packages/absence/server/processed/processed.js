Smartix = Smartix || {};
Smartix.Absence = Smartix.Absence || {};

// Temporary until the admin settings page is implemented
var schoolStartTime = "08:00";
var consideredAbsent = "10:00";

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
                parsedDate = moment(date, format);
            } else {
                parsedDate = moment(date);
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
            let startOfDay = moment.utc(record.date, 'DD-MM-YYYY').subtract(8, 'hours');
            let endOfDay = startOfDay.add(1, 'day');
            console.log(startOfDay.unix());
            console.log(endOfDay.unix());
        } else {
            // Student is on-time, no action required
            // console.log(record.studentId + ' is on-time');
        }
    })
}