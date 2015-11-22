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
- mup: npm install -g mup . The "app" directory path should be set to your actual one in `mup.json`.

*for iOS:
- DEPRECATED Build with iOS9.x SDK is now supported. 
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
- End OF DEPRECATION 

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
- Open XCode 7 or 7.1. To submit to AppStore
  - Building with iOS 9.1 SDK is ok.
  - Archive.

For XCode 7.1, when Archiving (build is fine), add in Build Settings -> Header Search Paths
$(OBJROOT)/UninstalledProducts/$(PLATFORM_NAME)/include
as you might get cdvviewcontroller-h-file-not-found error.
See http://forum.ionicframework.com/t/cordova-cdvviewcontroller-h-file-not-found-in-xcode-7-1-beta/32232/5

* Building for Android (APK) - dev
1. Run `keygen-android.sh` you will be asked for 
a) password: type one . This will be reused in step 2
b) prompted by many questions. You can leave all default blank except for 
What is the name of your organization? Type `Little Genius Education Ltd`
This step needs only to be done once per build machine.
This generates a key in the keystore `~/.keystore`

2. `npm run build-apk <PASSWORD>` or `build-android.sh <PASSWORD>`
where PASSWORD is the storepass provided in the previous step
NB: to sign only without building `npm run sign-apk <PASSWORD>` or `sign-android.sh <PASSWORD>`

## ARCHITECTURE ##
The app uses Compose.io MongoDB managed database in UAT and production.
The app uses DigitalOcean boxes for the app server.
Both are colocated in San Francisco DigitalOcean datacenter (not available in Asia).

## INFRASTRUCTURE ##
The UAT server is `uat.littlegenius.io`
The production server is `app.littlegenius.io`
They use a floating IPs. See https://www.digitalocean.com/company/blog/floating-ips-start-architecting-your-applications-for-high-availability/

#Server side#
Balance is used for port forwarding and round robin.
http://www.inlab.de/balance.html
http://www.inlab.de/balance.pdf
To install it:
`sudo apt-get install balance`
`sudo mkdir -m 01777 /var/run/balance/`
then run `balance-start.sh` (custom shell script)

#Building notes#
from martijnwalraven, MDG
https://forums.meteor.com/t/ios-test-flight-with-meteor-bug/7613/8
A mobile client decides where to connect to based on the settings in the generated index.html. 
These settings take their values based on environment variables that can either be set directly or be controlled with 
command options.

If you're using meteor build, you can specify the server to connect to with the --server option (this is similar to the 
--mobile-server option for meteor run). This sets the ROOT_URL and DDP_DEFAULT_CONNECTION_URL in the generated index.html.

Because subsequent updates delivered through Hot Code Push replace the initially bundled index.html with a freshly 
generated one, the server should also be configured with the right connection URL. Otherwise, the client may not be able
 to connect, or perhaps connect to the wrong server, after a Hot Code Push.

Using meteor deploy takes care of setting these values automatically, so there is no need to specify anything in that 
case.. But when deploying on your own server, you have to make sure to set at least the ROOT_URL environment variable 
(DDP_DEFAULT_CONNECTION_URL defaults to the same value). For Meteor Up, you can configure this in mup.json.

For a deployed app, view source on http://<domain>/__cordova/index.html to see what configuration variables it sets 
(look for __meteor_runtime_config__).

#Advanced Build Customization#
Most of the build configuration can be done in Mobile Configuration file starting from Meteor 0.9.4.

Sometimes you might need to override parts of the Cordova project that Meteor generates for you in the project/.meteor/local/cordova-build directory. For example, you might need to add some files to the build process in an ad-hoc way.

For these and other advanced purposes we have created a special top-level folder called cordova-build-override. The whole file tree of this directory will be cp -R (copied overwriting existing files) to the Cordova project right before the build and compilation step.

For example: if you want to have a customized `config.xml`, you can put it in project/cordova-build-override/config.xml.
