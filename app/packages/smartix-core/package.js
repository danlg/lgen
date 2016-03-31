Package.describe({
	name: 'smartix:core',
	version: '0.0.1',
	summary: 'Smartix libraries'
});

Package.onUse(function(api) {
	api.versionsFrom('1.2');
    api.use('templating', 'client');
    api.use('fourseven:scss@2.0.0','client'); 
    
    //lanaguage-specific app tour image
    api.addFiles([
                    'i18n/fr/app_tour_image.fr.scss',
                    'i18n/zh-CN/app_tour_image.zh-CN.scss',
                    'i18n/zh-TW/app_tour_image.zh-TW.scss',
                 ],'client');
    
    // TAPi18n
    api.addFiles([
                    'i18n/en/en.i18n.json',
                    'i18n/fr/fr.i18n.json',
                    'i18n/zh-CN/zh-CN.i18n.json',
                    'i18n/zh-TW/zh-TW.i18n.json',
                    'i18n/project-tap.i18n'           
                 ]);
	api.use('tap:i18n');
	api.imply('tap:i18n');
    
});