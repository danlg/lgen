#!/bin/bash
cd .meteor/local

## declare an array variable
#declare -a files=("build" "bundler-cache" "cordova-build" "isopacks" "plugin-cache" "shell")

#we do not delete cordova-build/plugins as it is llong to download to speed up build

declare -a files=("build" "bundler-cache" "isopacks"  "shell"\
                  "cordova-build/" \
                 # "cordova-build/hooks" "cordova-build/platforms" "cordova-build/resources" \
                 # "cordova-build/www cordova-build/config.xml"
                 )

#we delete everything but not the local database ".meteor/local/db"

## now loop through the above array
for dir in "${files[@]}"
do
   echo "removing" "$dir"
   rm -rf $dir
   #ls -1 "$dir"
done


