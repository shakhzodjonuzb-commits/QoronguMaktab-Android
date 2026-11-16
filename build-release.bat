@echo off
setlocal
cd /d "%~dp0"
call gradlew.bat :app:assembleRelease --no-daemon
if errorlevel 1 exit /b %errorlevel%
set "APK=app\build\outputs\apk\release\app-release-unsigned.apk"
if not exist "%APK%" (
  echo XATO: unsigned APK topilmadi: %APK%
  exit /b 1
)
echo.
echo Unsigned Release APK: %CD%\%APK%
