//defaultSearchOptions : {limit: 50} <-- means showing 50 items per page
// https://github.com/matteodem/meteor-easy-search/issues/445

// see Searching on composite fields
// http://matteodem.github.io/meteor-easy-search/docs/recipes/

UsersStatusIndex = new EasySearch.Index({
    collection: Smartix.Accounts.UsersComposite,
    fields: ['status.lastLogin.date', 'profile.firstName', 'profile.lastName',
        'grade', 'grade_shadow',
        'classroom', 'classroom_shadow',
        'fullName',
        'emails.address', 'username',
        'status.lastLogin.userAgent', 'status.online'],
    engine: new EasySearch.Minimongo({
        //sort: (searchObject,options) =>{
        sort: () =>{
            return { 'status.lastLogin.date': -1 }
        },

        selector: function (searchObject, options, aggregation) {
            // selector contains the default mongo selector that Easy Search would use
            var selector = this.defaultConfiguration().selector(searchObject, options, aggregation);

            if(options.search.props.schoolNamespace){
                // filter for the roles if set
                //https://github.com/matteodem/meteor-easy-search/issues/239
                //http://stackoverflow.com/questions/16002659/mongodb-how-to-query-nested-objects
                //https://docs.mongodb.com/v3.0/reference/operator/query/and/
                selector['$and'] = [];
                selector['$and'].push( { '$or': selector['$or'] });
                delete selector['$or'];

                if (options.search.props.role !== 'all') {
                    selector['$and'].push( { ['roles.'+options.search.props.schoolNamespace] : options.search.props.role }  );
                }
                let loginStatus = options.search.props.loginStatus;
                //log.info("loginStatus ", loginStatus);
                if (loginStatus !== 'anyLoggedIn') {
                    if (loginStatus == 'loggedInAtLeastOnce') {
                        selector['$and'].push( { ['status.lastLogin'] : { $exists: true} }  );
                    }
                    if (loginStatus == 'neverLogin') {
                        selector['$and'].push( { ['status.lastLogin'] : { $exists: false} }  );
                    }
                }
            }
            //TO examine the above mongo selector,un-comment the below console log
            //log.info("selector", selector);
            return selector;
        }
    }),
    defaultSearchOptions : {limit: 50}
});