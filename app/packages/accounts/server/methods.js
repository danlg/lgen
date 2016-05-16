Meteor.methods({
    'smartix:accounts/getUserInfo': function (userId, namespace) {
        
        check(userId, Match.Maybe(String));
        check(namespace, String);
        
        return Smartix.Accounts.getUserInfo(userId, namespace, this.userId);
    },
    'smartix:accounts/createUser': function (email, userObj, namespace, types) {
        check(email, Match.Where(function (val) {
            check(val, String);
            return SimpleSchema.RegEx.Email.test(val);
        }));
        check(userObj, Object);
        check(namespace, String);
        check(types, [String]);
        let autoEmailVerified = false;
        let doNotifyEmail = true;
        return Smartix.Accounts.createUser(email, userObj, namespace, types, this.userId, autoEmailVerified, doNotifyEmail);
    },
    'smartix:accounts/editUser': function(userId, options) {
        
        check(userId, Match.Maybe(String));
        check(options, Object);
        
        return Smartix.Accounts.editUser(userId, options, this.userId);
    },
    'smartix:accounts/removeUser': function (userId, namespace) {
        
        check(userId, Match.Maybe(String));
        check(namespace, String);
        
        return Smartix.Accounts.removeUser(userId, namespace, this.userId);
    },
    'smartix:accounts/deleteUser': function (id) {
        return Smartix.Accounts.deleteUser(userId, this.userId);
    },
    'smartix:accounts/updateDob': function (dob) {
        return Smartix.Accounts.updateDob(dob, this.userId);
    },
    'smartix:accounts/setHybridAppPromote': function () {
        Meteor.users.update(Meteor.userId(), { $set: { "hybridAppPromote": true } });
    }
});