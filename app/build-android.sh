#!/bin/bash
#$1 is password to storepass
meteor add-platform android
meteor build ../android-build --server http://uat.gosmartix.com:80
source sign-android.sh $1