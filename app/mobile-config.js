/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
App.info({
  id: 'io.littlegenius.genie',
  name: 'LittleGenius',
  description: 'Instant, free, simple communication for teachers, students and parents',
  author: 'Little Genius Education',
  email: 'contact@littlegenius.io',
  website: 'http://app.littlegenius.io',
  //todo sync this with config.xml
  version: '1.0.91105',
  buildNumber: '100'
});


App.setPreference('Orientation', 'portrait');
App.setPreference('ios-orientation-iphone', 'portrait');
App.accessRule('*');
//here add CDN later
App.accessRule('https://goo.gl/*');
//http://stackoverflow.com/questions/29934218/external-images-not-being-displayed-in-android-app-meteor-cordova
App.setPreference('StatusBarOverlaysWebView', 'true');
App.setPreference('StatusBarStyle', 'lightcontent');
App.setPreference('android-targetSdkVersion', '22');
App.setPreference('android-minSdkVersion', '19');
App.setPreference('BackupWebStorage', 'none');

App.icons({
  // iOS
  //https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/IconMatrix.html#//apple_ref/doc/uid/TP40006556-CH27-SW2
  //dan@LG1:~/DEV/github6/lgen/app/resources/ios$ file Icon*
  //Icon-60.png:          PNG image data, 60 x 60, 8-bit/color RGBA, non-interlaced
  //Icon-72.png:          PNG image data, 72 x 72, 8-bit/color RGBA, non-interlaced
  //Icon-72@2x.png:       PNG image data, 144 x 144, 8-bit/color RGBA, non-interlaced
  //Icon-Small-50.png:    PNG image data, 50 x 50, 8-bit/color RGBA, non-interlaced
  //Icon-Small-50@2x.png: PNG image data, 100 x 100, 8-bit/color RGBA, non-interlaced
  //Icon.png:             PNG image data, 57 x 57, 8-bit/color RGBA, non-interlaced
  //Icon@2x.png:          PNG image data, 114 x 114, 8-bit/color RGBA, non-interlaced

  //    Asset
  // App icon (required for all apps)
  // @1x: iPad 2 and iPad mini icon: 76 x 76
  // 'ipad': 'resources/ios/Icon-72.png',
  'ipad': 'resources/icons/logo-icon-76.png',
  // @2x: iPad and iPad mini icon: 152 x 152//'ipad_2x': 'resources/ios/Icon-72@2x.png'
  'ipad_2x': 'resources/icons/logo-icon-152.png',

  'iphone': 'resources/icons/logo-icon-60.png',

  // 'iphone_2x': 'resources/ios/Icon@2x.png',
  // iPhone_2x: iPhone 4s, iPhone 5,6 : 120 x 120
  'iphone_2x': 'resources/icons/logo-icon-120.png',

  //iPhone_3x: iPhone 6 Plus : 180 x 180
  //'iphone_3x': 'resources/ios/Icon@2x.png',
  'iphone_3x': 'resources/icons/logo-icon-180.png',

  //App icon for the App Store (required for all apps)
  //1024 x 1024 for all device

  // Android
  'android_ldpi': 'resources/icons/logo-icon-120.png',
  'android_mdpi': 'resources/icons/logo-icon-120.png',
  'android_hdpi': 'resources/icons/logo-icon-120.png',
  'android_xhdpi': 'resources/icons/logo-icon-120.png'
});

App.launchScreens({
  //https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/IconMatrix.html
  // #//apple_ref/doc/uid/TP40006556-CH27-SW2

  //logo-litegreen-splash-ip4@2x.png:  PNG image data, 640 x 960, 8-bit/color RGBA, non-interlaced
  //logo-litegreen-splash-ip6+@3x.png: PNG image data, 1243 x 2208, 8-bit/color RGBA, non-interlaced
  //logo-litegreen-splash-ip6@2x.png:  PNG image data, 750 x 1334, 8-bit/color RGBA, non-interlaced
  //logo-litegreen-splash-ipad1x.png:  PNG image data, 768 x 1025, 8-bit/color RGBA, non-interlaced
  //logo-litegreen-splash-ipad2x.png:  PNG image data, 1536 x 2049, 8-bit/color RGBA, non-interlaced

  //IPhone 4(@2x), 640 x 960
  'iphone': 'resources/ios/logo-litegreen-splash-ip4@2x.png',
  //'iphone4': 'resources/ios/logo-litegreen-splash-ip4@2x.png',
  //For iPhone 5((@2x)), 640 x 1136
  'iphone_2x': 'resources/ios/logo-litegreen-splash-ip5@2x.png',

  //logo-litegreen-splash-ip5@2x.png:  PNG image data, 640 x 1136, 8-bit/color RGBA, non-interlaced
  'iphone5': 'resources/ios/logo-litegreen-splash-ip5@2x.png',

  //For iPhone 6(@2x):
  //750 x 1334 (@2x) for portrait
  //  1334 x 750 (@2x) for landscape
  'iphone6': 'resources/ios/logo-litegreen-splash-ip6@2x.png',

  //  For iPhone 6 Plus:
  //    1242 x 2208 (@3x) for portrait
  //  2208 x 1242 (@3x) for landscape
  'iphone6p_portrait': 'resources/ios/logo-litegreen-splash-ip6+@3x.png',
  //'iphone6p_landscape': 'resources/splash/iphone6p_landscape.png',
  'ipad_portrait': 'resources/ios/logo-litegreen-splash-ipad1x.png',//768 x 1024
  //'ipad_landscape': 'resources/splash/ipad_landscape.png'
  'ipad_portrait_2x': 'resources/ios/logo-litegreen-splash-ipad2x.png',//1536 x 2048
  // 'ipad_landscape_2x': 'resources/splash/ipad_landscape_2x.png',

  //ANDROID
  //http://stackoverflow.com/questions/13487124/android-splash-screen-sizes-for-ldpi-mdpi-hdpi-xhdpi-displays-eg-1024x76
  // Format : 9-Patch PNG (recommended)

  'android_ldpi_portrait': 'resources/android/logo-splash-android_ldpi_portrait-200x320.png', //200x320px
  //'android_ldpi_landscape': 'resources/splash/android_ldpi_landscape.png',//320x200px
  'android_mdpi_portrait': 'resources/android/logo-splash-android_mdpi_portrait-320x480.png',//320x480px
  //'android_mdpi_landscape': 'resources/splash/android_mdpi_landscape.png',//480x320px
  'android_hdpi_portrait': 'resources/android/logo-splash-android_hdpi_portrait-480x800.png',//480x800px
  //'android_hdpi_landscape': 'resources/splash/android_hdpi_landscape.png',//800x480px
  'android_xhdpi_portrait': 'resources/android/logo-splash-android_xhdpi_portrait-720x1280.png'//720px1280px
  //'android_xhdpi_landscape': 'resources/splash/android_xhdpi_landscape.png'//1280x720px
});

//Cordova-Android original asset dimensions
//=========================================
//drawable/icon.png: 96 x 96
//drawable-hdpi/icon.png: 72 x 72
//drawable-ldpi/icon.png: 36 x 36
//drawable-mdpi/icon.png: 48 x 48
//drawable-xhdpi/icon.png: 96 x 96
//
//drawable-land-hdpi/screen.png: 800 x 480
//drawable-land-ldpi/screen.png: 320 x 200
//drawable-land-mdpi/screen.png: 480 x 320
//drawable-land-xhdpi/screen.png: 1280 x 720
//drawable-port-hdpi/screen.png: 480 x 800
//drawable-port-ldpi/screen.png: 200 x 320
//drawable-port-mdpi/screen.png: 320 x 480
//drawable-port-xhdpi/screen.png: 720 x 1280
//
//Cordova-iOS original asset dimensions
//=========================================
//icons/icon-40.png: 40 x 40
//icons/icon-40@2x.png: 80 x 80
//icons/icon-50.png: 50 x 50
//icons/icon-50@2x.png: 100 x 100
//icons/icon-60.png: 60 x 60
//icons/icon-60@2x.png: 120 x 120
//icons/icon-72.png: 72 x 72
//icons/icon-72@2x.png: 144 x 144
//icons/icon-76.png: 76 x 76
//icons/icon-76@2x.png: 152 x 152
//icons/icon-small.png: 29 x 29
//icons/icon-small@2x.png: 58 x 58
//icons/icon.png: 57 x 57
//icons/icon@2x.png: 114 x 114
//splash/Default-568h@2x~iphone.png: 640 x 1136
//splash/Default-Landscape@2x~ipad.png: 2048 x 1536
//splash/Default-Landscape~ipad.png: 1024 x 768
//splash/Default-Portrait@2x~ipad.png: 1536 x 2048
//splash/Default-Portrait~ipad.png: 768 x 1024
//splash/Default@2x~iphone.png: 640 x 960
//splash/Default~iphone.png: 320 x 480
