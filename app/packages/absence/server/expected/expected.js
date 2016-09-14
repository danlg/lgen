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
    // log.info("Smartix.Absence.registerExpectedAbsence" , isParent);
    // log.info("Smartix.Absence.registerExpectedAbsence" , isAdmin);
    // log.info("Smartix.Absence.registerExpectedAbsence" , options, currentUser);
    if(!(isParent || isAdmin)) {
        throw new Meteor.Error("permission-denied registerExpectedAbsence", "The user does not have permission to perform this action.");
    }
    if(isParent) {
        options.approved = false;
    }
    if(isAdmin) {
        options.approved = true;
        options.adminId = currentUser;
    }

    let studentObj = Meteor.users.findOne({
        studentId: options.studentId,
        schools: [options.namespace]
    });
    let studentId = options.studentId;
    //if studentObj exists take the unique id else continue with the options.studentId
    if(studentObj){
        studentId = studentObj._id;
    }    
    // Add the expected absence entry into the collection
    let insertedAbsenceId = Smartix.Absence.Collections.expected.insert({
        studentId: studentId,
        reporterId: options.reporterId,
        dateFrom: options.dateFrom,
        dateTo: options.dateTo,
        message: options.message,
        namespace: options.namespace,
        approved: options.approved
    });
    if(isParent) {
        Smartix.Absence.notificationToAdminApprovalRequest(insertedAbsenceId, currentUser);
    }
    return insertedAbsenceId;
};

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
    
    if (approve) {
        // Notify the parents
        Smartix.Absence.notificationToParentApprovedNotice(id, currentUser);

        // Find any processed absences and change their status
        Smartix.Absence.Collections.processed.update({
            expectedAbsenceRecords: id
        },
        {
            $set: {
                status: "approved"
            }
        })
    } else {
        // Find any processed absences and change their status
        Smartix.Absence.Collections.processed.update({
            expectedAbsenceRecords: id
        },
        {
            $set: {
                status: "pending"
            }
        })
    }

    //log.info(approve);
    //log.info(currentUser);
    //log.info(id);
    
    return Smartix.Absence.Collections.expected.update({
        _id: id
    }, {
        $set: {
            approved: approve,
            adminId: currentUser
        }
    })
};