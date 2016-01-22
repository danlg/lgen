#!/bin/bash

meteor add-platform ios
rm -rf .meteor/local/cordova-build
rm -rf ../Smartix-build
   #npm run ios-prd run

case "$1" in
        prd)
            echo "Building " $1
            rm -rf .meteor/local/cordova-build && NODE_ENV=production meteor run ios --settings ../config/production/settings.json --mobile-server=https://app.gosmartix.com -p 5000
            ;;
        uat)
            echo "Building " $1
            rm -rf .meteor/local/cordova-build && meteor run ios --settings ../config/stage/settings.json --mobile-server=https://uat.gosmartix.com -p 4000
            ;;
        *)
            echo $"Usage: $0 {uat|prd}"
            exit 1
esac


   #meteor build ../littlegenius-build --server http://app.littlegenius.io
#sed -i '' 's/IPHONEOS_DEPLOYMENT_TARGET[[:space:]]=[[:space:]]6\.0/IPHONEOS_DEPLOYMENT_TARGET = 8\.0/g' .meteor/local/cordova-build/platforms/ios/LittleGenius.xcodeproj/project.pbxproj
echo "running here post build"

# Set some plist attr for new xcode compile
PLIST=.meteor/local/cordova-build/platforms/ios/Smartix/Smartix-Info.plist

/usr/libexec/PlistBuddy -c "Add :NSAppTransportSecurity dict" $PLIST
/usr/libexec/PlistBuddy -c "Add :NSAppTransportSecurity:NSAllowsArbitraryLoads bool YES" $PLIST
#/usr/libexec/PlistBuddy -c "Add :LSApplicationQueriesSchemes array" $PLIST
#/usr/libexec/PlistBuddy -c "Add :LSApplicationQueriesSchemes:0 string 'fbauth'" $PLIST
/usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName Smartix" $PLIST
# Set buildnumber as cur date in seconds
#DATE=$(date +%s)
#/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $DATE" $PLIST

open .meteor/local/cordova-build/platforms/ios/Smartix.xcodeproj
#echo '- Change provisioning profiles'
#echo '- Convert icons to use Asset Catalog'
#echo '- Add more icons'
#echo '- Add more splashs'
