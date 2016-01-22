#!/bin/bash
#$1 is password to storepass
meteor add-platform android
meteor build ../android-build --server https://app.gosmartix.com
source sign-android.sh $1