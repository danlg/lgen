Meteor.methods({
    'smartix:accounts/getUserInfo': function (userId, namespace) {
        
        check(userId, String);
        check(namespace, String);
        
        return Smartix.Accounts.getUserInfo(userId, namespace, this.userId);
    },
    'smartix:accounts/createUser': function (email, options, namespace, types) {
        check(email, Match.Where(function (val) {
            check(val, String);
            return SimpleSchema.RegEx.Email.test(val);
        }));
        check(options, Object);
        check(namespace, String);
        check(types, [String]);
        
        return Smartix.Accounts.createUser(email, options, namespace, types, this.userId);
    },
    'smartix:accounts/editUser': function(userId, options) {
        
        check(userId, String);
        check(options, Object);
        
        return Smartix.Accounts.editUser(userId, options, this.userId);
    },
    'smartix:accounts/removeUser': function (userId, namespace) {
        
        check(userId, String);
        check(namespace, String);
        
        return Smartix.Accounts.removeUser(userId, namespace, this.userId);
    },
    'smartix:accounts/deleteUser': function (id) {
        return Smartix.Accounts.deleteUser(userId, this.userId);
    },
    'smartix:accounts/updateDob': function (dob) {
        return Smartix.Accounts.updateDob(dob, this.userId);
    }
});