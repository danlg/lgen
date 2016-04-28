Smartix = Smartix || {};
Smartix.Absence = Smartix.Absence || {};

// Register expected absences, supports multiple days 
Smartix.Absence.registerExpectedAbsence = function (options, currentUser) {
    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    Absence.registerExpectedAbsenceSchema.clean(options);
    check(options, Absence.registerExpectedAbsenceSchema);
    
    // Checks if the user is the parent of the student specified
    if(!Smartix.Accounts.Relationships.isParent(options.studentId, currentUser, namespace)) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }
    
    // For each day between the dates specified,
    // Add a new record to the Absence.Collections.expected` collection
    
    // If the start date and end date are the same
    // Create one entry in the collection
    if(moment(options.dateFrom).isSame(dateTo, 'day')) {
        return Absence.Collections.expected.insert({
            studentId: options.studentId,
            reporterId: options.reportedId,
            date: moment(options.dateFrom).startOf('day').toDate(),
            approved: false
        });
    } else {
        // Get the difference, in days, between the dates
        let diff = moment(options.dateFrom).diff(moment(options.dateTo), 'days');
        let i;
        for(i = 0; i <= diff; i++) {
            Absence.Collections.expected.insert({
                studentId: options.studentId,
                reporterId: options.reportedId,
                date: moment(options.dateFrom).startOf('day').add(i, 'days').toDate(),
                approved: false
            });
        }
        return i;
    }
}

Smartix.Absence.ApproveExpectedAbsence = function(id, currentUser) {
    
    check(id, String),
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Checks whether the user has permission to perform this action
    if(!Smartix.Absence.canApproveExpectedAbsence(id, currentUser)) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }
    
    Absence.Collections.expected.update({
        _id: id
    }, {
        $set: {
            approved: true
        }
    })
}