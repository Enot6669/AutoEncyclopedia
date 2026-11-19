#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
: "${ANDROID_JAR:?Path to Android platform android.jar}"
: "${ANDROID_BUILD_TOOLS:?Path to Android build-tools}"
JAVAC="${JAVAC:-javac}"
mkdir -p build/classes build/dex
"$JAVAC" --release 8 -encoding UTF-8 -classpath "$ANDROID_JAR" -d build/classes src/ru/enot/autoencyclopedia/MainActivity.java
"$ANDROID_BUILD_TOOLS/d8" --min-api 23 --lib "$ANDROID_JAR" --output build/dex $(find build/classes -name '*.class')
"$ANDROID_BUILD_TOOLS/aapt" package -f -M AndroidManifest.xml -I "$ANDROID_JAR" -A assets -S res -F build/unsigned.apk
(cd build/dex && zip -q ../unsigned.apk classes.dex)
"$ANDROID_BUILD_TOOLS/zipalign" -f 4 build/unsigned.apk build/aligned.apk
if [[ ! -f build/local-debug.p12 ]]; then
  keytool -genkeypair -keystore build/local-debug.p12 -storepass android -keypass android -alias debug -keyalg RSA -keysize 2048 -validity 10000 -dname 'CN=Auto Encyclopedia Test'
fi
"$ANDROID_BUILD_TOOLS/apksigner" sign --ks build/local-debug.p12 --ks-pass pass:android --key-pass pass:android --out ../AutoEncyclopedia-0.4.0.apk build/aligned.apk
"$ANDROID_BUILD_TOOLS/apksigner" verify --verbose ../AutoEncyclopedia-0.4.0.apk
