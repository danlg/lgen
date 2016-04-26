Smartix = Smartix || {};
Smartix.Accounts = Smartix.Accounts || {};

// Remove non-existent users from the array
// This is used in cases where the user may have specified a non-existent user `_id`
Smartix.Accounts.removeNonExistentUsers = function (users) {
    // Checks `users` is an array of Strings
    check(users, [String]);

    // Checks if all the users exists
    if (users.length === Meteor.users.find({
        _id: {
            $in: users
        }
    }).count()) {
        // If all users exists, return the `users` array as-is
        return users;
    } else {
        // If not all users exists, filter the `users` array
        // to include only existing users
        return _.filter(users, function (userId, i, array) {
            // This will return `undefined` if no user is found
            return Meteor.users.findOne({ _id: userId });
        });
    }
}