#!/bin/sh
# stop execution on error
set -e

echo ==================== COMPILING ASSETS ====================
# gulp compile --release
# gulp compile


echo =============== BUILDING ANDROID PROJECT =================
python tools/add-manifest-debuggable.py
cordova build android --release

function signapk(){
  echo ==========================================================
  echo "SIGNING: $1 => $2"
  echo ==========================================================
  jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore peerio.keystore $1 peerio_release_key

  echo ========== VERIFYING ==========
  jarsigner -verify -verbose -certs $1

  echo ========== ZIPALIGN ==========
  zipalign -f -v 4 $1 $2
}
mkdir -p ./bin
signapk ./platforms/android/build/outputs/apk/android-x86-release-unsigned.apk ./bin/peerio-x86.apk

echo ============================================
echo "||             BUILD SUCCESS              ||"
echo ============================================

adb uninstall com.peerio
adb install ./bin/peerio-x86.apk
adb shell am start -n com.peerio/com.peerio.MainActivity

