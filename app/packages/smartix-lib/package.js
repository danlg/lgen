Package.describe({
  name: "smartix:lib",
  summary: "",
  version: "0.0.1",
  documentation:'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom("1.2");
    api.use('iron:router');
    api.use('smartix:core');
    api.use('templating','client');
    api.use('stevezhu:lodash');
    api.use('smartix:classes');
    api.use('fourseven:scss@2.0.0','client');    
 
    api.addFiles('client/helper.js','client');
    api.addFiles('shared/helper.js');
    api.addFiles('shared/find-in-json.js');
    api.addFiles('server/methods.js','server');
    api.addFiles('server/method_cs.js', 'server');

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
        
    api.export('Smartix');
});