//defaultSearchOptions : {limit: 50} <-- means showing 50 items per page
// https://github.com/matteodem/meteor-easy-search/issues/445
UsersStatusIndex = new EasySearch.Index({
    collection: Meteor.users,
    fields: ['status.lastLogin.date', 'profile.firstName', 'profile.lastName','emails.address', 'username'],
    engine: new EasySearch.Minimongo({
        sort: (searchObject,options) =>{
            return {
                //TODO FIX the sorting
                //'status.lastLogin.date': 0
                'status.lastLogin': 0
            }
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

                if (options.search.props.role && options.search.props.role !== 'all') {
                    selector['$and'].push( { ['roles.'+options.search.props.schoolNamespace] : options.search.props.role }  );
                }
                //else{ log.info("role selector not set");//e/g student}

                let status = options.search.props.connectstatus;
                let connectionFlag = ( status === 'online');
                //log.info("connectionFlag", connectionFlag);
                if (options.search.props.connectstatus && options.search.props.connectstatus !== 'allconnection') {
                    selector['$and'].push( { ['status.online'] : connectionFlag }  );
                }
                // else{
                    //log.info("options.search.props", options.search.props);
                    // log.info("connection selector not set");//eg offline
                // }
            }
            //TO examine the above mongo selector,un-comment the below console log
            //log.info("selector", selector);
            return selector;
        }
    }),
    defaultSearchOptions : {limit: 50}
});