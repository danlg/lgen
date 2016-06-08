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
mobile="mobile-config.js."$1
echo "   Copying " `pwd`/$mobile " -> " `pwd`/mobile-config.js
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


if [ "$1" == "carmel" ] || [ "$1" == "carmelu" ]
  then
  echo ""
  echo "   Configuring stylsheet for the carmel"
  appStylesheet="client/stylesheets/app.scss.carmel"
  ionicVariables="client/stylesheets/meteoric_ionic-sass/stylesheets/_variables.scss.carmel"
  echo "   Copying " $appStylesheet " -> " client/stylesheets/app.scss
  echo "   Copying " $ionicVariables " -> " client/stylesheets/meteoric_ionic-sass/stylesheets/_variables.scss.carmel

  #echo `pwd`
  #echo "mobile-config="$mobile
  #ls -l $mobile
  
  #echo $stylesheet
  cp -f $appStylesheet client/stylesheets/app.scss
  cp -f $ionicVariables client/stylesheets/meteoric_ionic-sass/stylesheets/_variables.scss


  if [ $? -eq 0 ];
    then
      echo "   Stylesheets updated successfully"
    else
      echo "   There was an issue with loading the stylesheets"
      exit 1
  fi
fi

#Preparing symbolic link for mup
echo ""
echo "3. Preparing symbolic link for mup"

echo "   Sym linking " `pwd`/mup.json " -> "  `pwd`/${1}u.mup.json
echo "   Sym linking " `pwd`/settings.json " -> " `pwd`/${1}u.settings.json
#echo "config="$1
rm -f mup.json && rm -f settings.json
ln -s ${1}u.mup.json mup.json && ln -s ${1}u.settings.json settings.json

if [ $? -eq 0 ];
then
    echo "   Config $1 sym link successfully set up"
else
    echo "   Config $1 sym link set up failed ***"
    exit 1
fi