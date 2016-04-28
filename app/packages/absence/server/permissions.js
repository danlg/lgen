Smartix = Smartix || {};
Smartix.Absence = Smartix.Absence || {};

Smartix.Absence.canViewAllExpectedAbsences = Smartix.Absence.canViewAllActualAbsences = function (namespace, currentUser) {
    
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Only admins of the school can view all expected absences
    return Smartix.Accounts.School.isAdmin(namespace, currentUser);
}