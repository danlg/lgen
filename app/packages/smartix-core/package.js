Package.describe({
	name: 'smartix:core',
	version: '0.0.1',
	summary: 'Smartix libraries'
});

Package.onUse(function(api) {
	api.versionsFrom('1.2');
    api.use('practicalmeteor:loglevel')
    api.use('iron:router');
    api.use('tap:i18n');
    api.use('reactive-var','client');
    api.use('session', 'client');    
    api.use('templating', 'client');
    api.use('fourseven:scss@2.0.0','client'); 
    
    api.addFiles('route.js');

    api.addFiles('client/templates/report/report.html','client');
                 
    api.addFiles([
                    'client/templates/about/about.html',
                    'client/templates/about/about.js',                    
                 ],
                'client');

    api.addFiles([
                    'client/templates/connection_status/connection_status.html',                  
                 ],
                'client');
 
     api.addFiles([
                    'client/templates/feedback/feedback.html',
                    'client/templates/feedback/feedback.js',
                    'client/templates/feedback/feedback.css',                                       
                 ],
                'client');

     api.addFiles([
                    'client/templates/help/help.html',                                    
                 ],
                'client');

     api.addFiles([
                    'client/templates/legal/en.privacy.html',
                    'client/templates/legal/en.tandc.html',
                    'client/templates/legal/fr.privacy.html',
                    'client/templates/legal/fr.tandc.html',                                                                                               
                 ],
                'client');

     api.addFiles([
                    'client/templates/login/login.html',
                    'client/templates/login/login.js',   
                    'client/templates/login/login.css',                                           
                    'client/templates/login/loginResponsiveimageLandscape.css',                       
                    'client/templates/login/loginResponsiveimagePotrait.css',                                                           
                 ],
                'client');

     api.addFiles([
                    'client/templates/shared/loading/loading.html',
                    'client/templates/shared/loading/loading.js',
                    'client/templates/shared/not_found/not_found.html',
                    'client/templates/shared/not_found/not_found.js',                                                                                                                                    
                 ],
                'client');
                                                                                                  
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
    
    
    //initialize dependency
    api.use('yuukan:streamy');
    api.use('chrismbeckett:toastr');
    api.use('raix:push');
    api.use('francocatena:status');
    api.use('aldeed:autoform','client');
    api.use('aldeed:collection2');
    api.use('aldeed:simple-schema');
    api.use('accounts-base');
    api.use('accounts-google');
    api.use('accounts-oauth');
    api.use('accounts-password'); 
    api.use('jquery');
    
    api.addFiles('_app.js','client');         
    api.addFiles('client/init.js','client');       
    api.addFiles('server/init.js','server');
    api.addFiles([
                  'client/autoformHooks/addClass.js',
                  'client/autoformHooks/chatSetting.js',
                  'client/autoformHooks/editClass.js',
                  'client/autoformHooks/emailInvite.js',
                  'client/autoformHooks/emailsignup.js',
                  'client/autoformHooks/joinClassHook.js',
                  'client/autoformHooks/profileEdit.js',
                 ],'client');
        
    
    api.export('log');
    api.export('Smartix');    
});