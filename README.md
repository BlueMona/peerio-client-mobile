# peerio-client-mobile

## Development

`git config core.ignorecase false`

Modify `src/config.js` as needed for non-prod development.

We use specifically node v4 (node v5 breaks the build)

```
npm install -g bower@1.6.5
npm install -g cordova@5.4.1
npm install bower-installer gulp -g -d
npm install -g ios-deploy # for MacOSX using sudo causes an error, removed
xcode-select --install # if you don't already have console tools for XCode you would need this line
npm install -d # install or update all packages
bower install
bower-installer
cordova platform add ios android # this will generate all the required project files for both platforms
sudo gem install github_changelog_generator
chmod a+x ./generate_changelog.sh ./release_android.sh
```

### using bower link

for the live development of `peerio-client-api`, the following should be done:

```
bower link # in peerio-client-api directory creates a link to the component named the same as dir name (peerio-client-api)
bower link peerio-client-api # in peerio-client-mobile directory creates a symbolic link to the upper dir
```

then run `gulp watch` in the peerio-client-api repo.

## To run

`gulp serve` runs a webserver on localhost:3000 -- you'll need to open www/index.html to use the app. 

In order to use the ios emulator you may have to `npm install ios-sim`. You will also need the Android SDK with platform tools and build tools. 

`gulp run-android`
`gulp run-ios`

If building fails, or when switching branches, run `./reinstall_platforms_and_plugins.sh`. 

## To build

`cordova prepare` followed by `cordova build android` or `cordova build ios`

## notes
xwalk will not work without these permissions
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
