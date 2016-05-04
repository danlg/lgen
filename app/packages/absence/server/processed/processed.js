Smartix = Smartix || {};
Smartix.Absence = Smartix.Absence || {};

// Temporary until the admin settings page is implemented
var schoolStartTime = "08:00";
Smartix.Absence.getAllStudentsWhoAreExpectedToTapIn = function (namespace) {
    return Meteor.users.find({
        
    })
}


Smartix.Absence.processAbsences = function (namespace, currentUser) {
    
    check(namespace, String);
    check(currentUser, Match.Maybe(String));
    
    // Get the `_id` of the currently-logged in user
    if(!(currentUser === null)) {
        currentUser = currentUser || Meteor.userId();
    }
    
    // Get all the students in the namespace who are expected to tap in
    let allSchoolUsers = Smartix.Accounts.School.getAllSchoolStudents(namespace, currentUser);
    console.log(allSchoolUsers);
    console.log(allSchoolUsers.count());
    
    
    // Smartix.Absence.Collections.processed.upsert();
}