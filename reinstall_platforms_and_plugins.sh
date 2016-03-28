#!/bin/sh
echo '=== REINSTALLING PLATFORMS AND PLUGINS'

if [ -d "extra/cordova-android" ]; then
    cd "extra/cordova-android"
    git pull
    cd "../.."
else
    cd "extra"
    git clone https://github.com/PeerioTechnologies/cordova-android.git
    cd ".."
fi

echo '=== Removing plugins...'
rm -rf plugins
echo '=== Removing platforms...'
rm -rf platforms

echo '=== Adding IOS platform'
cordova platform add ios

echo '=== Adding ANDROID platform'
cordova platform add android

echo '=== Applying platform project settings'
gulp prepare

echo '=== DONE!'
