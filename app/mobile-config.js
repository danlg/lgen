/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
App.info({
  //id: 'com.gosmartix.smartix', for android
  id: 'io.littlegenius.genie', //for ios because the app is registered with this id and the APN certificate
  name: 'Smartix',
  description: 'Instant, safe, simple communication for teachers, students and parents',
  author: 'Little Genius Education',
  email: 'contact@gosmartix.com',
  website: 'https://app.gosmartix.com',
  version: '1.2.0',
  buildNumber: '100'
});

//since force ssl is used. https://localhost:* needs to be allowed
App.accessRule('https://localhost:*');

App.icons({
    
  // iOS
  'iphone_2x': 'resources/icons/logo-icon-120.png',
  'ipad': 'resources/icons/logo-icon-76.png',
  'ipad_2x': 'resources/icons/logo-icon-152.png',
  'iphone_3x': 'resources/icons/logo-icon-180.png',
  // Android
  'android_mdpi': 'resources/icons/logo-icon-120.png',
  'android_hdpi': 'resources/icons/logo-icon-120.png',
  'android_xhdpi': 'resources/icons/logo-icon-120.png'

});

App.launchScreens({

  //IPhone 4(@2x), 640 x 960
  //'iphone': 'resources/ios/logo-litegreen-splash-ip4@2x.png',
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

  //'android_ldpi_portrait': 'resources/android/logo-splash-android_ldpi_portrait-200x320.png', //200x320px
  //'android_ldpi_landscape': 'resources/splash/android_ldpi_landscape.png',//320x200px
  'android_mdpi_portrait': 'resources/android/logo-splash-android_mdpi_portrait-320x480.png',//320x480px
  //'android_mdpi_landscape': 'resources/splash/android_mdpi_landscape.png',//480x320px
  'android_hdpi_portrait': 'resources/android/logo-splash-android_hdpi_portrait-480x800.png',//480x800px
  //'android_hdpi_landscape': 'resources/splash/android_hdpi_landscape.png',//800x480px
  'android_xhdpi_portrait': 'resources/android/logo-splash-android_xhdpi_portrait-720x1280.png'//720px1280px
  //'android_xhdpi_landscape': 'resources/splash/android_xhdpi_landscape.png'//1280x720px
});

//see https://github.com/apache/cordova-plugin-statusbar
//Preferences see https://cordova.apache.org/docs/en/latest/config_ref/index.html

//IOS
App.setPreference('StatusBarOverlaysWebView', 'true');
App.setPreference('StatusBarStyle', 'lightcontent');
//App.setPreference('StatusBarBackgroundColor', '#000000');//If this value is not set, the background color will be transparent.
App.setPreference('ios-orientation-iphone', 'portrait');
App.setPreference('deployment-target', '8.4');
App.setPreference('BackupWebStorage', 'none');
//target-device(string)//Allowed values: handset, tablet, universal//Default: universal

//ANDROID
App.setPreference('android-targetSdkVersion', '19');
App.setPreference('android-minSdkVersion', '22');

//BOTH
App.setPreference('Orientation', 'portrait');
App.setPreference('AutoHideSplashScreen', 'true');
App.setPreference('SplashScreen', 'screen');
App.setPreference('SplashScreenDelay', '3000');
App.setPreference('DisallowOverscroll', 'false');//was webviewbounce



