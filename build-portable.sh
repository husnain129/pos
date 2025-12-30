#!/bin/bash

# Creative Hands POS - Portable EXE Build Script
# This script builds a single portable executable for Windows

echo "======================================"
echo "Creative Hands POS - Build Script"
echo "Building Portable EXE..."
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✓ Dependencies installed"
    echo ""
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist
echo "✓ Cleaned"
echo ""

# Build the portable EXE
echo "🔨 Building portable executable..."
echo "This may take 5-10 minutes..."
echo ""

npm run build:portable

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "✅ Build completed successfully!"
    echo "======================================"
    echo ""
    echo "Your portable EXE is located at:"
    echo "📁 dist/Creative Hands POS-Portable.exe"
    echo ""
    echo "File size:"
    if [ -f "dist/Creative Hands POS-Portable.exe" ]; then
        ls -lh "dist/Creative Hands POS-Portable.exe" | awk '{print $5}'
    fi
    echo ""
    echo "You can now share this single EXE file!"
else
    echo ""
    echo "======================================"
    echo "❌ Build failed"
    echo "======================================"
    echo ""
    echo "Please check the error messages above"
    exit 1
fi
