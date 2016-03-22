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
- XCode 7 / iOS 9 SDK to submit to AppStore 

TO DO change the build process as it now works with iOS 9.1 SDK provided that the following block is added to Smartix-Info.plist

<key>NSAppTransportSecurity</key>
<dict>
	<key>NSAllowsArbitraryLoads</key>
	<true/>
</dict>



*for Android:
- Android Studio
- API 22

## MOBILE REQUIREMENTS##
- iOS >=7 (will be 8 when we move to WKWebview)
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
The UAT server is `uat.gosmartix.com`
The production server is `app.gosmartix.com`
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

#Build notes#

The `npm run build-uat` is not working to build the mobile iOS client. The problem is that the connection to the remote server 
doesn't work (Hence a blank screen, which is not temporary). For some reason `npm run ios-device-uat` must be 
run to build it.

#Run bud
```bud -c /opt/littlegenius/config/bud.conf.json -d```
See wiki
https://github.com/danlg/lgen/wiki/Installing-bud-for-TLS-1.2-support

#upgrade Meteor 1.3
Install nvm: curl https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
Install node 0.10.43: nvm install 0.10.43
Install npm latest: npm -g install npm@latest

#start Mongo
/usr/bin/mongod --config /etc/mongod.conf

#Manage services
sudo apt-get install sysv-rc-conf
sysv-rc-conf

#Install custom version of mup to allow compilation on Linux x64
https://github.com/danlg/meteor-up.git

