//defaultSearchOptions : {limit: 50} <-- means showing 50 items per page
// https://github.com/matteodem/meteor-easy-search/issues/445
UsersIndex = new EasySearch.Index({
    collection: Meteor.users,
    fields: ['profile.firstName', 'profile.lastName','roles','grade'],
    engine: new EasySearch.Minimongo({
        sort: function(searchObject,options){
            return { 'profile.lastName' : 0 }
        },
        selector: function (searchObject, options, aggregation) {
            
            // selector contains the default mongo selector that Easy Search would use
            var selector = this.defaultConfiguration().selector(searchObject, options, aggregation);

            // modify the selector to only match documents where region equals "New York"
            //selector.type = 'class';

            return selector;
        }
    }),
    defaultSearchOptions : {limit: 50}
});