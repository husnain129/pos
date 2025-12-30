@echo off
REM Creative Hands POS - Portable EXE Build Script for Windows
REM This script builds a single portable executable for Windows

echo ======================================
echo Creative Hands POS - Build Script
echo Building Portable EXE...
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js version:
node --version
echo [OK] npm version:
npm --version
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
    echo.
)

REM Clean previous builds
echo [INFO] Cleaning previous builds...
if exist "dist" rmdir /s /q dist
echo [OK] Cleaned
echo.

REM Build the portable EXE
echo [INFO] Building portable executable...
echo This may take 5-10 minutes...
echo.

call npm run build:portable

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================
    echo [SUCCESS] Build completed successfully!
    echo ======================================
    echo.
    echo Your portable EXE is located at:
    echo dist\Creative Hands POS-Portable.exe
    echo.
    if exist "dist\Creative Hands POS-Portable.exe" (
        echo File created successfully
        dir "dist\Creative Hands POS-Portable.exe" | find "Creative Hands POS-Portable.exe"
    )
    echo.
    echo You can now share this single EXE file!
    echo.
) else (
    echo.
    echo ======================================
    echo [ERROR] Build failed
    echo ======================================
    echo.
    echo Please check the error messages above
    pause
    exit /b 1
)

pause
