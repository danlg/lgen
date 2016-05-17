Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.School = Smartix.Accounts.School || {};

Smartix.Accounts.School.getNamespaceFromSchoolName = function (schoolName) {
    Meteor.subscribe('schoolInfo', schoolName);
    //log.info('packages/accounts-schools-client/accounts-schools.js#schoolName: ' + schoolName);
    // Get the `_id` of the school from its username
    var schoolDoc = SmartixSchoolsCol.findOne({
        username: schoolName
    });
    return schoolDoc ? schoolDoc._id : false;
};