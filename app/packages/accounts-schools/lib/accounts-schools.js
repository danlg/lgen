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
    
Smartix.Accounts.School.getStudentId = function (studentId, namespace) {
    check(studentId, String);
    check(namespace, String);
    var user = Meteor.users.findOne({
        "studentId": studentId
    });
    if(user) {
        if(Roles.userIsInRole(user._id, Smartix.Accounts.School.STUDENT, namespace))
        {
            //return user._id;
            return studentId;
        }
    }
    return false;
};