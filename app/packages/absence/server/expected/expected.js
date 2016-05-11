Smartix = Smartix || {};
Smartix.Absence = Smartix.Absence || {};

// Register expected absences, supports multiple days 
Smartix.Absence.registerExpectedAbsence = function (options, currentUser) {
    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    Smartix.Absence.expectedAbsenceSchema.clean(options);
    check(options, Smartix.Absence.expectedAbsenceSchema);
    
    let isParent = Smartix.Accounts.Relationships.isParent(options.studentId, currentUser, options.namespace);
    let isAdmin = Smartix.Accounts.School.isAdmin(options.namespace, currentUser);
    
    // Checks if the user is the parent of the student specified
    // Or if they are the admin for the school
    if(!(isParent || isAdmin)) {
        throw new Meteor.Error("permission-denied", "The user does not have permission to perform this action.");
    }
    
    if(isParent) {
        options.approved = false;
    }
    if(isAdmin) {
        options.approved = true;
    }
    
    // Add the expected absence entry into the collection
    return Smartix.Absence.Collections.expected.insert({
        studentId: options.studentId,
        reporterId: options.reporterId,
        dateFrom: options.dateFrom,
        dateTo: options.dateTo,
        message: options.message,
        namespace: options.namespace,
        approved: options.approved
    });
}

Smartix.Absence.approveExpectedAbsence = function(id, currentUser) {
    var setAbsenceApprovalResult = Smartix.Absence.setAbsenceApproval(id, currentUser, true);
    
    if(setAbsenceApprovalResult>0){
        Smartix.Absence.notificationToParentApprovedNotice(id,currentUser);
    }
    
    return setAbsenceApprovalResult;
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