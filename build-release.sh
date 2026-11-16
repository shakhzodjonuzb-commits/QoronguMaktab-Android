#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
./gradlew :app:assembleRelease --no-daemon
APK="app/build/outputs/apk/release/app-release-unsigned.apk"
if [ ! -f "$APK" ]; then
  echo "Build tugadi, ammo unsigned APK kutilgan joyda topilmadi: $APK" >&2
  exit 1
fi
printf '\nUnsigned Release APK: %s/%s\n' "$PWD" "$APK"
