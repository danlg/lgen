Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.School = Smartix.Accounts.School || {};

//do not use the string in the code !! use instead the symbol
//Smartix.Accounts.School.<role>
Smartix.Accounts.School.STUDENT ='student';
Smartix.Accounts.School.PARENT  ='parent';
Smartix.Accounts.School.TEACHER ='teacher';
Smartix.Accounts.School.ADMIN   ='admin';
Smartix.Accounts.School.SYSADMIN='sysadmin';

Smartix.Accounts.School.VALID_USER_TYPES = [
    Smartix.Accounts.School.STUDENT,
    Smartix.Accounts.School.PARENT,
    Smartix.Accounts.School.TEACHER,
    Smartix.Accounts.School.ADMIN,
    Smartix.Accounts.School.SYSADMIN];
    
Smartix.Accounts.School.getStudentIdFromName = function (name, namespace) {
    check(name, String);
    check(namespace, String);
    // Try to separate the names based on commas or spaces,
    // And trims them afterwards
    var commaSeparatedName = name.split(',').map(Function.prototype.call, String.prototype.trim);
    // .filter(Boolean) removes any empty strings
    var spaceSeparatedName = name.split(' ').filter(Boolean);
    var separatedName = (commaSeparatedName.length > 1) ? commaSeparatedName : spaceSeparatedName;
    var lastName = separatedName[0].trim();
    // Removes the lastName
    separatedName.splice(0,1);
    var firstName = separatedName.join(' ').trim();
    var userCursor = Meteor.users.find({
        "profile.lastName": lastName,
        "profile.firstName": firstName
    });
    if(userCursor.count() < 1) {
        userCursor = Meteor.users.find({
            "profile.lastName": lastName
        });
        if(userCursor.count() !== 1) {
            // From here on, assumes the format given was FirstName LastName
            userCursor = Meteor.users.find({
                "profile.firstName": lastName,
                "profile.lastName": firstName
            });
            if(userCursor.count() < 1) {
                userCursor = Meteor.users.find({
                    "profile.lastName": firstName
                });
                if(userCursor.count() !== 1) {
                    return false;
                }
            }
        }
    }
    if(userCursor.count() === 1) {
        var user = userCursor.fetch()[0];
        return user._id;
    }
    return false;
};