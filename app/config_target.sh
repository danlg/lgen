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
echo "1. Configuring push notification"
echo "   Copying " `pwd`/$config " -> " `pwd`/config.push.json
cp -f $config config.push.json

if [ $? -eq 0 ];
  then
    echo "   Config $1 push successfully set up"
  else
    echo "   Config $1 push set up failed ***"
    exit 1
fi

cd ../..
echo ""
echo "2. Configuring mobile-config asset file icon for the app"
echo "   Copying " `pwd`/$mobile " -> " `pwd`/mobile-config.js
mobile="mobile-config.js."$1
#echo `pwd`
#echo "mobile-config="$mobile
#ls -l $mobile

cp -f $mobile mobile-config.js

if [ $? -eq 0 ];
  then
    echo "   Config $1 cordova successfully set up"
  else
    echo "   Config $1 cordova set up failed ***"
    exit 1
fi

#Preparing symbolic link for mup
cd ../config/
echo ""
echo "3. Preparing symbolic link for mup"

if [ "$1" = "smartix" ];
then
  echo "   Sym linking " `pwd`/mup.json " -> "  `pwd`/${1}.mup.json
  echo "   Sym linking " `pwd`/settings.json " -> " `pwd`/${1}.settings.json
  #echo "config="$1
  rm -f mup.json && rm -f settings.json
  ln -s ${1}.mup.json mup.json && ln -s ${1}.settings.json settings.json

else if [ "$1" = "carmel" ];
  then
    echo "   Sym linking " `pwd`/mup.json " -> "  `pwd`/${1}.mup.json
    echo "   Sym linking " `pwd`/settings.json " -> " `pwd`/${1}.settings.json
    #echo "config="$1
    rm -f mup.json && rm -f settings.json
    ln -s ${1}.mup.json mup.json && ln -s ${1}.settings.json settings.json

  else #uat
    echo "   Sym linking " `pwd`/mup.json " -> "  `pwd`/${1}u.mup.json
    echo "   Sym linking " `pwd`/settings.json " -> " `pwd`/${1}u.settings.json
    #echo "config="$1
    rm -f mup.json && rm -f settings.json
    ln -s ${1}u.mup.json mup.json && ln -s ${1}u.settings.json settings.json
  fi
fi

if [ $? -eq 0 ];
then
    echo "   Config $1 sym link successfully set up"
else
    echo "   Config $1 sym link set up failed ***"
    exit 1
fi