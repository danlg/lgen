if(Meteor.isServer){
    //console.log('ac-username','is Smartix exist?',Smartix || {});
    Smartix = Smartix || {};
    Smartix.Accounts = Smartix.Accounts || {};
    Smartix.Accounts.helpers = Smartix.Accounts.helpers || {};

    Smartix.Accounts.helpers.generateUniqueUserName = function(firstname, lastname){
        //console.log('generateUniqueUserName',firstname,lastname);
        // Check the arguments are of the correct type
        check(firstname, String);
        check(lastname, String);
        
        //remove all non-ascii character
        var uniqueName = (firstname + lastname).replace(/[^\x00-\x7F]/g, "");
        
        //if uniqueName becomes empty, transform firstname and lastname to unicode
        if(uniqueName == ""){
            for (var i = 0, len = firstname.length; i < len; i++) {
            uniqueName = uniqueName + firstname.charCodeAt(i);
            }
            for (var i = 0, len = lastname.length; i < len; i++) {
            uniqueName = uniqueName + lastname.charCodeAt(i);
            }        
        }
        var index = 1;
        if (Meteor.users.find({ username: uniqueName }).count() != 0) {
            while (Meteor.users.find({ username: uniqueName + index }).count() != 0) {
                index++;
            }
            uniqueName = uniqueName + index;
        }
        return uniqueName;

    };
}