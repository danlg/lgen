Package.describe({
    name: "smartix:lib",
    summary: "",
    version: "0.0.1",
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom("1.2");
    api.use('iron:router');
    api.use('session', 'client');
    
    //we cannot use ecmascript in smartix:lib
    //api.use('ecmascript');
    //[1.3.2.4] ecmascript incompatible with tap:i18n
    //https://github.com/meteor/meteor/issues/6941
    //not working in Meteor 1.3.2.4 while tap-i18n defined in package #166
    //https://github.com/TAPevents/tap-i18n/issues/166
    api.use('smartix:core');

    api.use('templating', 'client');
    api.use('stevezhu:lodash');
    api.use('smartix:classes', { unordered: true });
    api.use('fourseven:scss@2.0.0', 'client');

    api.addFiles('client/helper.js', 'client');
    api.addFiles('shared/helper.js');
    api.addFiles('shared/find-in-json.js');
    api.addFiles('server/methods.js', 'server');
    api.addFiles('server/method_cs.js', 'server');
    api.addFiles('server/server_lib.js', 'server');
    
    //language-specific app tour image

    api.addAssets([
        'i18n/fr/fr_t1.jpg',
        'i18n/fr/fr_t2.jpg',
        'i18n/fr/fr_t3.jpg',
        'i18n/fr/fr_t4.jpg',
        'i18n/fr/fr_t5.jpg',
        'i18n/fr/fr_t6.jpg'
    ], 'client');
    
    api.addAssets([
        'i18n/zh-CN/zh_cn_t1.jpg',
        'i18n/zh-CN/zh_cn_t2.jpg',
        'i18n/zh-CN/zh_cn_t3.jpg',
        'i18n/zh-CN/zh_cn_t4.jpg',
        'i18n/zh-CN/zh_cn_t5.jpg',
        'i18n/zh-CN/zh_cn_t6.jpg'
    ], 'client');
           

    api.addFiles([
        'i18n/fr/app_tour_image.fr.scss',
        'i18n/zh-CN/app_tour_image.zh-CN.scss',
        'i18n/zh-TW/app_tour_image.zh-TW.scss'
    ], 'client');

    // TAPi18n
    api.addFiles([
        'i18n/en/en.i18n.json',
        'i18n/zh-CN/zh-CN.i18n.json',
        'i18n/zh-TW/zh-TW.i18n.json',
        //add da,fa,fr,hu,id,no,ro,th,sw (9 languages generated French also)
        //CN and TW not yet
        'i18n/ar/ar.i18n.json', 'i18n/da/da.i18n.json', 'i18n/de/de.i18n.json', 'i18n/es/es.i18n.json',
        'i18n/fa/fa.i18n.json', 'i18n/fi/fi.i18n.json', 'i18n/fr/fr.i18n.json', 'i18n/he/he.i18n.json',
        'i18n/hi/hi.i18n.json', 'i18n/hu/hu.i18n.json', 'i18n/id/id.i18n.json', 'i18n/it/it.i18n.json',
        'i18n/ja/ja.i18n.json', 'i18n/ko/ko.i18n.json', 'i18n/nl/nl.i18n.json', 'i18n/no/no.i18n.json',
        'i18n/pl/pl.i18n.json', 'i18n/pt/pt.i18n.json', 'i18n/ro/ro.i18n.json', 'i18n/ru/ru.i18n.json',
        'i18n/sv/sv.i18n.json', 'i18n/sw/sw.i18n.json', 'i18n/th/th.i18n.json', 'i18n/tr/tr.i18n.json',

        'i18n/project-tap.i18n'
    //],'client');
        //
    ]);
    api.use('tap:i18n');
    api.imply('tap:i18n');

    api.export('Smartix');
});