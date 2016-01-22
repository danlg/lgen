#!/bin/bash

#$1 is password to storepass
export PASSWORD=$1
export APK_PATH=.meteor/local/cordova-build/platforms/android/build
export UNSIGNED_APK=$APK_PATH/outputs/apk/android-release-unsigned.apk
export SIGNED_APK=$APK_PATH/smartix-release-signed.apk

rm -f $SIGNED_APK
jarsigner -storepass $PASSWORD -verbose -digestalg SHA1 $UNSIGNED_APK com.gosmartix.smartix
if [ $? -eq 0 ]; then
    echo "OK: APK $SIGNED_APK signed successfully"
else
    echo "Couldn't sign APK"
    exit 1
fi
zipalign 4 $UNSIGNED_APK $SIGNED_APK
if [ $? -eq 0 ]; then
    echo "OK: APK $SIGNED_APK aligned successfully"
else
    echo "Couldn't align APK"
    exit 1
fi
cp $SIGNED_APK .
#open $APK_PATH