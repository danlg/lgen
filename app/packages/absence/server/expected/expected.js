Smartix = Smartix || {};
Smartix.Absence = Smartix.Absence || {};

// Register expected absences, supports multiple days 
Smartix.Absence.registerExpectedAbsence = function (options, currentUser) {
    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    Smartix.Absence.registerExpectedAbsenceSchema.clean(options);
    check(options, Smartix.Absence.registerExpectedAbsenceSchema);
    
    // Checks if the user is the parent of the student specified
    // Or if they are the admin for the school
    if(!(Smartix.Accounts.Relationships.isParent(options.studentId, currentUser, options.namespace)
    || Smartix.Accounts.School.isAdmin(options.namespace, currentUser))) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }
    
    // For each day between the dates specified,
    // Add a new record to the Smartix.Absence.Collections.expected` collection
    
    // If the start date and end date are the same
    // Create one entry in the collection
    if(moment(options.dateFrom).isSame(options.dateTo, 'day')) {
        
        return Smartix.Absence.Collections.expected.insert({
            studentId: options.studentId,
            reporterId: options.reporterId,
            date: moment(options.dateFrom).startOf('day').toDate(),
            approved: false,
            message: options.message,
            namespace: options.namespace
        });
    } else {
        // Get the difference, in days, between the dates
        let diff = moment(options.dateTo).diff(moment(options.dateFrom), 'days');
        let i;
        
        for(i = 0; i <= diff; i++) {
            Smartix.Absence.Collections.expected.insert({
                studentId: options.studentId,
                reporterId: options.reporterId,
                date: moment(options.dateFrom).startOf('day').add(i, 'days').toDate(),
                approved: false,
                message: options.message,
                namespace: options.namespace
            });
        }
        
        return i;
    }
}

Smartix.Absence.approveExpectedAbsence = function(id, currentUser) {
    return Smartix.Absence.setAbsenceApproval(id, currentUser, true);
}

Smartix.Absence.unapproveExpectedAbsence = function(id, currentUser) {
    return Smartix.Absence.setAbsenceApproval(id, currentUser, false);
};

Smartix.Absence.setAbsenceApproval = function (id, currentUser, approve) {
    check(id, String),
    check(currentUser, Match.Maybe(String));
    check(approve, Boolean);
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Checks whether the user has permission to perform this action
    if(!Smartix.Absence.canApproveExpectedAbsence(id, currentUser)) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }
    
    return Smartix.Absence.Collections.expected.update({
        _id: id
    }, {
        $set: {
            approved: approve
        }
    })
};