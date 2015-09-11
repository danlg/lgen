App.info({
  id: 'io.littlegenius.genie',
  name: 'Little Genius'
  // description: 'Get über power in one button click',
  // author: 'Matt Development Group',
  // email: 'contact@example.com',
  // website: 'http://example.com'
});


App.setPreference('Orientation', 'portrait');
App.setPreference('ios-orientation-iphone', 'portrait');
App.accessRule('*');

App.icons({
  // iOS
  //https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/IconMatrix.html#//apple_ref/doc/uid/TP40006556-CH27-SW2
  // 'iphone': 'resources/ios/Icon.png',
  //
  'iphone_2x': 'resources/ios/Icon@2x.png',
  'iphone_3x': 'resources/ios/Icon@2x.png',
  'ipad': 'resources/ios/Icon-72.png',
  'ipad_2x': 'resources/ios/Icon-72@2x.png',

   // Android
   'android_ldpi': 'resources/icons/logo-120.png',
   'android_mdpi': 'resources/icons/logo-120.png',
   'android_hdpi': 'resources/icons/logo-120.png',
   'android_xhdpi': 'resources/icons/logo-120.png'
 });


App.launchScreens({
  //https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/IconMatrix.html#//apple_ref/doc/uid/TP40006556-CH27-SW2

  //IPhone 4(@2x), 640 x 960
  'iphone': 'resources/ios/logo-litegreen-splash-ip4@2x.png',
  //'iphone4': 'resources/ios/logo-litegreen-splash-ip4@2x.png',
  //For iPhone 5((@2x)), 640 x 1136
  'iphone_2x': 'resources/ios/logo-litegreen-splash-ip5@2x.png',
  'iphone5': 'resources/ios/logo-litegreen-splash-ip5@2x.png',
  //For iPhone 6(@2x):
  //750 x 1334 (@2x) for portrait
  //  1334 x 750 (@2x) for landscape
  'iphone6': 'resources/ios/logo-litegreen-splash-ip6@2x.png',
//  For iPhone 6 Plus:
//    1242 x 2208 (@3x) for portrait
//  2208 x 1242 (@3x) for landscape
  'iphone6p_portrait': 'resources/ios/logo-litegreen-splash-ip6+@3x.png'
  //'iphone6p_landscape': 'resources/splash/iphone6p_landscape.png',
  //'ipad_portrait': 'resources/splash/ipad_portrait.png',
  //'ipad_portrait_2x': 'resources/splash/ipad_portrait_2x.png',
  //'ipad_landscape': 'resources/splash/ipad_landscape.png',
  //'ipad_landscape_2x': 'resources/splash/ipad_landscape_2x.png',
  //'android_ldpi_portrait': 'resources/splash/android_ldpi_portrait.png',
  //'android_ldpi_landscape': 'resources/splash/android_ldpi_landscape.png',
  //'android_mdpi_portrait': 'resources/splash/android_mdpi_portrait.png',
  //'android_mdpi_landscape': 'resources/splash/android_mdpi_landscape.png',
  //'android_hdpi_portrait': 'resources/splash/android_hdpi_portrait.png',
  //'android_hdpi_landscape': 'resources/splash/android_hdpi_landscape.png',
  //'android_xhdpi_portrait': 'resources/splash/android_xhdpi_portrait.png',
  //'android_xhdpi_landscape': 'resources/splash/android_xhdpi_landscape.png'
});

//Cordova-Android original asset dimensions
//=========================================
//
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
//
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