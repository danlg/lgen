Package.describe({
	name: 'smartix:filehandler',
	version: '0.0.1',
	summary: ''
});


Package.onUse(function(api) {
     api.versionsFrom("1.2"); 
     api.use('smartix:core'); 
     api.addFiles('fileHandler.js','client');
     api.export('Smartix');

});