NewsgroupsIndex = new EasySearch.Index({
    collection: Smartix.Groups.Collection,
    fields: ['name', 'url'],
    engine: new EasySearch.Minimongo({
        selector: function (searchObject, options, aggregation) {
            
            // selector contains the default mongo selector that Easy Search would use
            var selector = this.defaultConfiguration().selector(searchObject, options, aggregation);

            // modify the selector to only match documents where region equals "New York"
            selector.type = 'newsgroup';

            return selector;
        }
    })
});