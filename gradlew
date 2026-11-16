#!/usr/bin/env sh
set -eu

GRADLE_VERSION="8.14"
CACHE_ROOT="${GRADLE_USER_HOME:-${HOME:-$PWD}/.gradle}/manual-wrapper"
DIST_DIR="$CACHE_ROOT/gradle-$GRADLE_VERSION"
GRADLE_BIN="$DIST_DIR/bin/gradle"

if command -v gradle >/dev/null 2>&1; then
    FOUND_VERSION="$(gradle --version 2>/dev/null | awk '/^Gradle [0-9]/{print $2; exit}')"
    if [ "$FOUND_VERSION" = "$GRADLE_VERSION" ]; then
        exec gradle "$@"
    fi
fi

if [ ! -x "$GRADLE_BIN" ]; then
    mkdir -p "$CACHE_ROOT"
    ZIP="$CACHE_ROOT/gradle-$GRADLE_VERSION-bin.zip"
    URL="https://services.gradle.org/distributions/gradle-$GRADLE_VERSION-bin.zip"
    echo "Gradle $GRADLE_VERSION topilmadi. Rasmiy distributiv yuklanmoqda..."
    if command -v curl >/dev/null 2>&1; then
        curl -fL --retry 3 "$URL" -o "$ZIP"
    elif command -v wget >/dev/null 2>&1; then
        wget -O "$ZIP" "$URL"
    else
        echo "XATO: curl yoki wget kerak." >&2
        exit 1
    fi
    if ! command -v unzip >/dev/null 2>&1; then
        echo "XATO: unzip utilitasi kerak." >&2
        exit 1
    fi
    unzip -q -o "$ZIP" -d "$CACHE_ROOT"
fi

exec "$GRADLE_BIN" "$@"
