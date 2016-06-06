DistributionListUsersIndex = new EasySearch.Index({
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
                    
                    //https://github.com/matteodem/meteor-easy-search/issues/239
                    //http://stackoverflow.com/questions/16002659/mongodb-how-to-query-nested-objects
                    //https://docs.mongodb.com/v3.0/reference/operator/query/and/
                    selector['$and'] = [];
                    selector['$and'].push( { '$or': selector['$or'] }); 
                    delete selector['$or'];
                    selector['$and'].push( { ['roles.'+options.search.props.schoolNamespace] : options.search.props.role }  ) ;

                }                
            }

            //TO examine the above mongo selector,un-comment the below console log
            //log.info(selector);
            
            return selector;
        }
    }),
    defaultSearchOptions : {limit: 50},
});