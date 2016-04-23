/*! Copyright (c) 2015 Little Genius Education Ltd.  All Rights Reserved. */
App.info({
  id: 'com.gosmartix.smartix',
  name: 'Smartix',
  description: 'Instant, safe, simple communication for teachers, students and parents',
  author: 'Little Genius Education',
  email: 'contact@gosmartix.com',
  website: 'https://app.gosmartix.com',
  //todo sync this with config.xml
  version: '1.0.600000',
  buildNumber: '100'
});

//since force ssl is used. https://locahost:* needs to be allowed
App.accessRule('https://localhost:*');

App.icons({
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
  //'android_ldpi': 'resources/icons/logo-icon-120.png',
  'android_mdpi': 'resources/icons/logo-icon-120.png',
  'android_hdpi': 'resources/icons/logo-icon-120.png',
  'android_xhdpi': 'resources/icons/logo-icon-120.png'
});

App.launchScreens({

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

  //'android_ldpi_portrait': 'resources/android/logo-splash-android_ldpi_portrait-200x320.png', //200x320px
  //'android_ldpi_landscape': 'resources/splash/android_ldpi_landscape.png',//320x200px
  'android_mdpi_portrait': 'resources/android/logo-splash-android_mdpi_portrait-320x480.png',//320x480px
  //'android_mdpi_landscape': 'resources/splash/android_mdpi_landscape.png',//480x320px
  'android_hdpi_portrait': 'resources/android/logo-splash-android_hdpi_portrait-480x800.png',//480x800px
  //'android_hdpi_landscape': 'resources/splash/android_hdpi_landscape.png',//800x480px
  'android_xhdpi_portrait': 'resources/android/logo-splash-android_xhdpi_portrait-720x1280.png'//720px1280px
  //'android_xhdpi_landscape': 'resources/splash/android_xhdpi_landscape.png'//1280x720px
});

App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#000000');
