Package.describe({
	name: 'smartix:filehandler',
	version: '0.0.1',
	summary: ''
});

//Shouldn't we reference this Cordova plugin as we use fileChooser in fileHandler ? //not sure about syntax
// Cordova.depends(
// 	//com.megster.cordova.FileChooser@http://github.com/don/cordova-filechooser.git#1941938e206d29e0e661c053358bc65889e42fd8
// );

Package.onUse(function(api) {
     api.versionsFrom("1.2"); 
     api.use('smartix:core'); 
     api.addFiles('fileHandler.js','client');
     api.export('Smartix');

});