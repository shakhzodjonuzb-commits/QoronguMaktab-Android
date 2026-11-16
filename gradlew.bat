@echo off
setlocal EnableExtensions EnableDelayedExpansion
set "GRADLE_VERSION=8.14"
set "CACHE_ROOT=%USERPROFILE%\.gradle\manual-wrapper"
set "DIST_DIR=%CACHE_ROOT%\gradle-%GRADLE_VERSION%"
set "GRADLE_BIN=%DIST_DIR%\bin\gradle.bat"

where gradle >nul 2>nul
if not errorlevel 1 (
  for /f "tokens=2" %%V in ('gradle --version ^| findstr /b "Gradle "') do set "FOUND_VERSION=%%V"
  if "!FOUND_VERSION!"=="%GRADLE_VERSION%" (
    gradle %*
    exit /b !errorlevel!
  )
)

if not exist "%GRADLE_BIN%" (
  if not exist "%CACHE_ROOT%" mkdir "%CACHE_ROOT%"
  set "ZIP=%CACHE_ROOT%\gradle-%GRADLE_VERSION%-bin.zip"
  echo Gradle %GRADLE_VERSION% yuklanmoqda...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; Invoke-WebRequest 'https://services.gradle.org/distributions/gradle-%GRADLE_VERSION%-bin.zip' -OutFile '%CACHE_ROOT%\gradle-%GRADLE_VERSION%-bin.zip'; Expand-Archive -Force '%CACHE_ROOT%\gradle-%GRADLE_VERSION%-bin.zip' '%CACHE_ROOT%'"
  if errorlevel 1 exit /b 1
)

call "%GRADLE_BIN%" %*
exit /b !errorlevel!
