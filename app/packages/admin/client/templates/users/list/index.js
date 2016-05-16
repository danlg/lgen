//defaultSearchOptions : {limit: 50} <-- means showing 50 items per page
// https://github.com/matteodem/meteor-easy-search/issues/445
UsersIndex = new EasySearch.Index({
    collection: Meteor.users,
    fields: ['profile.firstName', 'profile.lastName'],
    engine: new EasySearch.Minimongo(),
    defaultSearchOptions : {limit: 50}
});