Smartix = Smartix || {};
Smartix.Absence = Smartix.Absence || {};

Smartix.Absence.processParentReply = function(options, currentUser) {
    Smartix.Absence.parentReplySchema.clean(options);
    check(options, Smartix.Absence.parentReplySchema);
    
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    
    // Get the processed absence by Id
    let processedAbsence = Smartix.Absence.Collections.processed.findOne({
        _id: options.processId
    });
    
    // Checks to ensure the processed absence record exists
    if(!processedAbsence) {
        throw new Meteor.Error('record-not-found', 'The processed absence record with id ' + options.processId + ' could not be found.');
    }
    
    // Checks if someone else has notified the school already
    // This can happen if the student have two parent records and
    // one notified the school before the other
    if(processedAbsence.status === "approved" || processedAbsence.status === "pending") {
        throw new Meteor.Error('notice-already-given', 'You, or another parent/guardian of the student has already submitted a notice.');
    }
    
    // Create a new expectedAbsence
    let newExpectedAbsenceId = Smartix.Absence.registerExpectedAbsence({
        namespace: processedAbsence.namespace,
        studentId: processedAbsence.studentId,
        reporterId: currentUser,
        dateFrom: moment.utc(new Date()).startOf('day').subtract(8, 'hours').add(Smartix.Utilities.getMinutesSinceMidnight(schoolStartTime), 'minutes').unix(),
        dateTo: options.eta,
        message: options.message,
        approved: false
    });
    
    // Add the newExpectedAbsenceId to the processedAbsence record
    // And change its status from 'missing' to 'pending'
    processedAbsence = Smartix.Absence.Collections.processed.update({
        _id: options.processId
    }, {
        $addToSet: {
            expectedAbsenceRecords: newExpectedAbsenceId
        },
        $set: {
            status: 'pending'
        }
    });
    
}