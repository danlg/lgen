#!/bin/bash
if [ $# -ne 1 ];
    then
    echo "=========================================================="
    echo "Expected config type as argument name e.g. smartix, carmel"
    echo "=========================================================="
fi
cd lib/pushNotification
#echo `pwd`
config=$1".config.push"
#ls -l $config
echo "Copying " `pwd`/$config " -> " `pwd`/config.push.json
cp -f $config config.push.json

if [ $? -eq 0 ];
  then
    echo "Config $1 push successfully set up"
  else
    echo "Config $1 push set up failed ***"
    exit 1
fi

cd ../..
echo "Configuring mobile-config asset file icon for the app"

mobile="mobile-config.js."$1
#echo `pwd`
#echo "mobile-config="$mobile
#ls -l $mobile
echo "Copying " `pwd`/$mobile " -> " `pwd`/mobile-config.js
cp -f $mobile mobile-config.js

if [ $? -eq 0 ];
  then
    echo "Config $1 cordova successfully set up"
  else
    echo "Config $1 cordova set up failed ***"
    exit 1
fi