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
   'iphone': 'resources/ios/Icon.png',
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


// App.launchScreens({
//   'iphone': 'splash/Default~iphone.png',
//   'iphone_2x': 'splash/Default@2x~iphone.png',
//   // ... more screen sizes and platforms ...
// });
