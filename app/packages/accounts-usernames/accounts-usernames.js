//log.info('ac-username','is Smartix exist?',Smartix || {});
Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};
Smartix.Accounts.helpers = Smartix.Accounts.helpers || {};

Smartix.Accounts.helpers.generateUniqueUserName = function(firstname, lastname){
    //log.info('generateUniqueUserName',firstname,lastname);
    // Check the arguments are of the correct type
    check(firstname, String);
    check(lastname, String);
    
    //remove all non-ascii character and space
    var firstnameTrim = firstname.replace(/[^\x00-\x7F,]/g, "").trim().toLowerCase();
    var lastnameTrim = lastname.replace(/[^\x00-\x7F,]/g, "").trim().toLowerCase();
    var uniqueName = firstnameTrim + lastnameTrim;

    //if uniqueName becomes empty, transform firstname and lastname to unicode
    if(uniqueName == ""){
        for (var i = 0, len = firstname.length; i < len; i++) {
            uniqueName = uniqueName + firstname.charCodeAt(i);
        }
        for (var i = 0, len = lastname.length; i < len; i++) {
            uniqueName = uniqueName + lastname.charCodeAt(i);
        }
    }
    if (uniqueName.length > 10) {
        uniqueName = uniqueName.substr(0,10);
    }
    var uniqueName = uniqueName.replace(/\W/g, "");//remove space and any non a-Z0-9 character
    var index = 1;
    if (Meteor.users.find({ username: uniqueName }).count() != 0) {
        while (Meteor.users.find({ username: uniqueName + index }).count() != 0) {
            index++;
        }
        uniqueName = uniqueName + index;
    }
    return uniqueName;
};