Smartix.Groups.addDistributionListsToGroup = function(id, lists) {
    // Checks that `id` is of type String
    check(id, String);

    // Checks that `users` is an array of Strings
    check(lists, [String]);

    // Remove non-existent users from array
    lists = Smartix.DistributionLists.removeNonExistentDistributionLists(lists);

    // Push (using `$addToSet`) the new users to the existing `users` array
    Smartix.Groups.Collection.update({
        _id: id
    }, {
        $addToSet: {
            distributionLists: {
                $each: lists
            }
        }
    });
}

Smartix.Groups.removeDistributionListsFromGroup = function(id, lists) {
    // Checks that `id` is of type String
    check(id, String);

    // Checks that `users` is an array of Strings
    check(lists, [String]);

    // Push (using `$addToSet`) the new users to the existing `users` array
    Smartix.Groups.Collection.update({
        _id: id
    }, {
        $pullAll: {
            distributionLists: lists
        }
    });
}