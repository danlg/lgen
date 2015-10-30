## PRE REQUISITES ##
Littlegenius is a Meteor application. It was scaffolded by iron-cli https://github.com/iron-meteor/iron-cli .
See http://docs.meteor.com/#/full/

## HARDWARE REQUIREMENTS##
To build the iOS app, you will need a Mac OSX
For Android, Windows, Linux or Mac can be used (the guidelines below have just been tested on Mac though).

## SOFTWARE REQUIREMENTS##
You need to install:
- Meteor
- npm

*for iOS:
- XCode 6.4 / iOS 8.4 SDK to build:  http://developer.apple.com/devcenter/download.action?path=/Developer_Tools/Xcode_6.4/Xcode_6.4.dmg
 for other builds see http://stackoverflow.com/questions/10335747/how-to-download-xcode-4-5-6-7-and-get-the-dmg-file
 (XCode 7/ iOS 9 SDK cannot be used due to a prevention of clear http, workarounds found do not work on ioS8.4 just iOS9)
 This is a temporary workaround until SSL is implemented.
http://adcdownload.apple.com/Developer_Tools/Xcode_6.4/Xcode_6.4.dmg
http://adcdownload.apple.com/Developer_Tools/Command_Line_Tools_OS_X_10.10_for_Xcode_6.4/Command_Line_Tools_OS_X_10.10_for_Xcode_6.4.dmg

Ensure that xcodebuild is pointing to 6.4
How to add SDK 8.4 to XCode 7:
dan@LG1:/Applications/Xcode7.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs$ ln -s /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS8.4.sdk
Enablebitcode to false

TO DO change the build process as it now works with iOS 9.1 SDK provided that the following block is added to LittleGenius-Info.plist

<key>NSAppTransportSecurity</key>
<dict>
	<key>NSAllowsArbitraryLoads</key>
	<true/>
</dict>

- XCode 7 / iOS 9 SDK to submit to AppStore (unfortunately you cannot use iOS SDK 8.4 with XCode7)

*for Android:
- Android Studio
- API 22

## MOBILE REQUIREMENTS##
- iOS >=8
- Android >= Kitkat 4.4 / API level 19

## BUILD PROCESS ##

littlegenius can be built using npm build script in (app/package.json)
Just `npm run <command>`

* Building the app using the local browser and local DB
`npm run local`

* Building the package for deployment
It uses `mup` behind the scenes.
Run `npm run deploy`. Will deploy to UAT. It takes 2-4 minutes.
You may need to run: npm run restart if the deployment takes too long or it cannot connect to MongoDB.

* Building the iOS
- `npm run ios-device`
- Open XCode 6.4. Clean & Build with iOS 8.4 SDK (because it is not sure which SDK is picked up by default by Meteor and it may be iOS 9 which we do not want).
  - Archive.
  - Close XCode 6.4`
- Open XCode 7. To submit to AppStore (due to validation error in 6.4)

## ARCHITECTURE ##
The app uses Compose.io MongoDB managed database in UAT and production.
The app uses DigitalOcean boxes for the app server.
Both are colocated in San Francisco DigitalOcean datacenter (not available in Asia).

## INFRASTRUCTURE ##
The UAT server is `uat.littlegenius.io`
The production server is `app.littlegenius.io`
They use a floating IPs. See https://www.digitalocean.com/company/blog/floating-ips-start-architecting-your-applications-for-high-availability/