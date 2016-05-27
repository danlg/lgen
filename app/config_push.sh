#!/bin/bash
if [ $# -ne 1 ];
    then
    echo "=========================================================="
    echo "Expected config type as argument name e.g. smartix, carmel"
    echo "=========================================================="
fi
cd lib/pushNotification
#echo `pwd`
config=$1".config.push.json"
#ls -l $config
echo "Copying " `pwd`/$config " -> " `pwd`/config.push.json
cp -f $config config.push.json

if [ $? -eq 0 ];
  then
    echo "Config $1 successfully set up"
  else
    echo "Config $1  set up failed ***"
    exit 1
fi