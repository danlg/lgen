Smartix = Smartix || {};
Smartix.Absence = Smartix.Absence || {};

Smartix.Absence.canViewExpectedAbsence = function (id, namespace, currentUser) {
    check(id, String);
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    // Only admins of the school, the student and his/her parents
    // can view all expected absences
    // Get the expected absence object
    let expectedAbsence = Smartix.Absence.Collections.expected.findOne({
        _id: id
    });
    if(!expectedAbsence) {
        throw new Meteor.Error('record-not-found', 'The record specified could not be found in the database');
    }
    return Smartix.Accounts.School.isAdmin(namespace, user)
        || expectedAbsence.studentId === currentUser
        || expectedAbsence.reporterId === currentUser
        || Smartix.Accounts.Relationships.isParent(expectedAbsence.studentId, currentUser, namespace);
};

Smartix.Absence.canApproveExpectedAbsence = function (id, currentUser) {
    check(id, String);
    check(currentUser, Match.Maybe(String));
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    // Only admins of the school can approve absences
    let expectedAbsence = Smartix.Absence.Collections.expected.findOne({
        _id: id
    });
    if(!expectedAbsence) {
        throw new Meteor.Error('record-not-found', 'The record specified could not be found in the database');
    }
    return Smartix.Accounts.School.isAdmin(expectedAbsence.namespace, currentUser);
};