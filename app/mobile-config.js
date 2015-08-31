App.info({
  // id: 'com.example.matt.uber',
  name: 'Little Genius',
  // description: 'Get über power in one button click',
  // author: 'Matt Development Group',
  // email: 'contact@example.com',
  // website: 'http://example.com'
});


App.setPreference('Orientation', 'portrait');
App.setPreference('ios-orientation-iphone', 'portrait');

App.icons({
  // iOS
  'iphone': 'resources/icons/icon-120.png',
  'iphone_2x': 'resources/icons/icon-120.png',
  'iphone_3x': 'resources/icons/icon-120.png',
  'ipad': 'resources/icons/icon-120.png',
  'ipad_2x': 'resources/icons/icon-120.png',

  // Android
  'android_ldpi': 'resources/icons/icon-120.png',
  'android_mdpi': 'resources/icons/icon-120.png',
  'android_hdpi': 'resources/icons/icon-120.png',
  'android_xhdpi': 'resources/icons/icon-120.png'
});


// App.launchScreens({
//   'iphone': 'splash/Default~iphone.png',
//   'iphone_2x': 'splash/Default@2x~iphone.png',
//   // ... more screen sizes and platforms ...
// });
