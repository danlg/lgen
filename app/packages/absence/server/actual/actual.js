Smartix.Absence.updateAttendenceRecord = function (record, namespace, currentUser) {
    
    check(record, Match.OneOf(Object, [Object])),
    check(namespace, String),
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Checks for permissions
    console.log(record);
    
    
}

Smartix.Accounts.School.getStudentIdFromName = function () {
    
}