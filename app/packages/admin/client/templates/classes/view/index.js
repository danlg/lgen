ClassUsersIndex = new EasySearch.Index({
    collection: Meteor.users,
    fields: ['profile.firstName', 'profile.lastName'],
    engine: new EasySearch.Minimongo()
});