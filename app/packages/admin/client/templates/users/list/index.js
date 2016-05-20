//defaultSearchOptions : {limit: 50} <-- means showing 50 items per page
// https://github.com/matteodem/meteor-easy-search/issues/445
UsersIndex = new EasySearch.Index({
    collection: Meteor.users,
    fields: ['profile.firstName', 'profile.lastName','roles','grade','emails.address'],
    engine: new EasySearch.Minimongo({
        sort: function(searchObject,options){
            return { 'profile.lastName' : 0 }
        },
        selector: function (searchObject, options, aggregation) {
            
            // selector contains the default mongo selector that Easy Search would use
            var selector = this.defaultConfiguration().selector(searchObject, options, aggregation);

            if(options.search.props.schoolNamespace){
                // filter for the roles if set
                if (options.search.props.role && options.search.props.role !== 'all') {            
                    selector.roles = {
                        [options.search.props.schoolNamespace] : [options.search.props.role]
                    }
                }                
            }

            
            return selector;
        }
    }),
    defaultSearchOptions : {limit: 50},
});