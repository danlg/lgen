#!/bin/bash

#$1 is password to storepass
export PASSWORD=$1
export APK_PATH=.meteor/local/cordova-build/platforms/android/build
export UNSIGNED_APK=$APK_PATH/outputs/apk/android-release-unsigned.apk
export SIGNED_APK=$APK_PATH/littlegenius-release-signed.apk

jarsigner -storepass $PASSWORD -verbose -digestalg SHA1 $UNSIGNED_APK io.littlegenius.genie
if [ $? -eq 0 ]; then
    echo "OK: APK $SIGNED_APK signed successfully"
else
    echo "Couldn't sign APK"
    exit 1
fi
rm -f $SIGNED_APK
~/.meteor/android_bundle/android-sdk/build-tools/21.0.0/zipalign 4 $UNSIGNED_APK $SIGNED_APK
if [ $? -eq 0 ]; then
    echo "OK: APK $SIGNED_APK aligned successfully"
else
    echo "Couldn't align APK"
    exit 1
fi
#open $APK_PATH