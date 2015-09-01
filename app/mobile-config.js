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

App.icons({
  // iOS
  //https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/IconMatrix.html
  'iphone': 'resources/icons/logo-120.png',
  'iphone_2x': 'resources/icons/logo-120.png',
  'iphone_3x': 'resources/icons/logo-180.png',
  'ipad': 'resources/icons/logo-152.png',
  'ipad_2x': 'resources/icons/logo-152.png',

  // Android
  'android_ldpi': 'resources/icons/logo-120.png',
  'android_mdpi': 'resources/icons/logo-120.png',
  'android_hdpi': 'resources/icons/logo-120.png',
  'android_xhdpi': 'resources/icons/logo-120.png'
});


// App.launchScreens({
//   'iphone': 'splash/Default~iphone.png',
//   'iphone_2x': 'splash/Default@2x~iphone.png',
//   // ... more screen sizes and platforms ...
// });
