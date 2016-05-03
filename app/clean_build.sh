#!/bin/bash
cd .meteor/local

## declare an array variable
declare -a files=("build" "bundler-cache" "cordova-build" "isopacks" "plugin-cache" "shell")
#we delete everything but not the local database ".meteor/local/db"

## now loop through the above array
for dir in "${files[@]}"
do
   echo "removing" "$dir"
   rm -rf $dir
   #ls -1 "$dir"
done


